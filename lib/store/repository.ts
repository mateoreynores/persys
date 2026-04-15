import "server-only";

import { asc, desc, eq, inArray } from "drizzle-orm";

import { adminAuditLogs, categories, orderItems, orders, products } from "@/db/schema";
import { getDb } from "@/lib/db";
import { getBusinessWhatsAppNumber, isDatabaseConfigured } from "@/lib/env";
import { slugify } from "@/lib/format";
import { createId, createOrderNumber } from "@/lib/id";
import { demoCategories, demoOrders, demoProducts } from "@/lib/store/demo-data";
import { checkoutSchema, type CatalogSnapshot, type CheckoutInput, type OrderRecord, type StoreCategory, type StoreProduct } from "@/lib/store/types";

function sortCategories(items: StoreCategory[]) {
  return [...items].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.name.localeCompare(right.name, "es");
  });
}

function sortProducts(items: StoreProduct[]) {
  return [...items].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.name.localeCompare(right.name, "es");
  });
}

function mapProductRow(
  row: typeof products.$inferSelect,
  categoryMap: Map<string, StoreCategory>,
): StoreProduct {
  const category = categoryMap.get(row.categoryId);

  return {
    id: row.id,
    categoryId: row.categoryId,
    categorySlug: category?.slug ?? "sin-categoria",
    categoryName: category?.name ?? "Sin categoría",
    name: row.name,
    slug: row.slug,
    brand: row.brand,
    description: row.description,
    imageUrl: row.imageUrl,
    priceCents: row.priceCents,
    salePriceCents: row.salePriceCents,
    isFeatured: row.isFeatured,
    isActive: row.isActive,
    availabilityNote: row.availabilityNote,
    sortOrder: row.sortOrder,
  };
}

async function listDbCategories() {
  const db = getDb();

  if (!db) {
    return sortCategories(demoCategories);
  }

  const rows = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
  }));
}

async function listDbProducts() {
  const db = getDb();

  if (!db) {
    return sortProducts(demoProducts);
  }

  const categoryRows = await listDbCategories();
  const categoryMap = new Map(categoryRows.map((item) => [item.id, item]));
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.name));

  return rows.map((row) => mapProductRow(row, categoryMap));
}

function buildCatalogSnapshot(
  categoryRows: StoreCategory[],
  productRows: StoreProduct[],
  query?: string,
  categorySlug?: string,
): CatalogSnapshot {
  const trimmedQuery = query?.trim().toLowerCase() ?? "";
  const activeCategories = sortCategories(categoryRows.filter((item) => item.isActive));
  const filteredProducts = sortProducts(
    productRows.filter((product) => {
      if (!product.isActive) {
        return false;
      }

      if (categorySlug && product.categorySlug !== categorySlug) {
        return false;
      }

      if (!trimmedQuery) {
        return true;
      }

      return [
        product.name,
        product.brand,
        product.description,
        product.categoryName,
      ].some((value) => value.toLowerCase().includes(trimmedQuery));
    }),
  );

  return {
    categories: activeCategories,
    products: filteredProducts,
    featuredProducts: filteredProducts.filter((item) => item.isFeatured).slice(0, 4),
    activeProductCount: productRows.filter((item) => item.isActive).length,
  };
}

export async function getCatalogSnapshot(options?: {
  query?: string;
  category?: string;
}) {
  const [categoryRows, productRows] = await Promise.all([
    listDbCategories(),
    listDbProducts(),
  ]);

  return buildCatalogSnapshot(categoryRows, productRows, options?.query, options?.category);
}

export async function getFeaturedLandingProducts() {
  const snapshot = await getCatalogSnapshot();

  return snapshot.featuredProducts.slice(0, 3);
}

export async function getAdminCatalogSnapshot() {
  const [categoryRows, productRows] = await Promise.all([
    listDbCategories(),
    listDbProducts(),
  ]);

  return {
    categories: sortCategories(categoryRows),
    products: sortProducts(productRows),
  };
}

export async function getCategoryById(categoryId: string) {
  const catalog = await getAdminCatalogSnapshot();
  return catalog.categories.find((item) => item.id === categoryId) ?? null;
}

export async function getProductById(productId: string) {
  const catalog = await getAdminCatalogSnapshot();
  return catalog.products.find((item) => item.id === productId) ?? null;
}

async function fetchOrderRows() {
  const db = getDb();

  if (!db) {
    return demoOrders;
  }

  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  if (orderRows.length === 0) {
    return [];
  }

  const itemRows = await db
    .select()
    .from(orderItems)
    .where(
      inArray(
        orderItems.orderId,
        orderRows.map((row) => row.id),
      ),
    );

  return orderRows.map((row) => ({
    id: row.id,
    orderNumber: row.orderNumber,
    status: row.status,
    currencyCode: row.currencyCode,
    subtotalCents: row.subtotalCents,
    discountCents: row.discountCents,
    totalCents: row.totalCents,
    customerCompany: row.customerCompany,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail,
    taxId: row.taxId,
    deliveryCity: row.deliveryCity,
    notes: row.notes,
    whatsAppUrl: row.whatsAppUrl,
    whatsAppMessage: row.whatsAppMessage,
    source: row.source,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    items: itemRows
      .filter((item) => item.orderId === row.id)
      .map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productSnapshotName: item.productSnapshotName,
        productSnapshotSku: item.productSnapshotSku,
        unitPriceCents: item.unitPriceCents,
        saleUnitPriceCents: item.saleUnitPriceCents,
        quantity: item.quantity,
        lineSubtotalCents: item.lineSubtotalCents,
        lineTotalCents: item.lineTotalCents,
      })),
  }));
}

export async function listOrders(status?: string) {
  const orderRows = await fetchOrderRows();
  return status ? orderRows.filter((item) => item.status === status) : orderRows;
}

export async function getOrderById(orderId: string) {
  const orderRows = await fetchOrderRows();
  return orderRows.find((item) => item.id === orderId) ?? null;
}

export async function getDashboardStats() {
  const [catalog, orderRows] = await Promise.all([getAdminCatalogSnapshot(), listOrders()]);

  return {
    activeProducts: catalog.products.filter((item) => item.isActive).length,
    activeCategories: catalog.categories.filter((item) => item.isActive).length,
    pendingOrders: orderRows.filter((item) => item.status === "pending_whatsapp").length,
    revenueCents: orderRows
      .filter((item) => item.status !== "cancelled")
      .reduce((total, item) => total + item.totalCents, 0),
  };
}

function buildWhatsAppMessage(order: {
  orderNumber: string;
  customerCompany: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  taxId?: string | null;
  deliveryCity: string;
  notes?: string | null;
  items: Array<{
    name: string;
    quantity: number;
    total: number;
  }>;
  totalCents: number;
  discountCents: number;
}) {
  const lines = [
    `Hola Persys, quiero confirmar el pedido ${order.orderNumber}.`,
    "",
    `Empresa: ${order.customerCompany}`,
    `Contacto: ${order.customerName}`,
    `Teléfono: ${order.customerPhone}`,
    `Email: ${order.customerEmail}`,
    `Ciudad de entrega: ${order.deliveryCity}`,
  ];

  if (order.taxId) {
    lines.push(`CUIT/CUIT: ${order.taxId}`);
  }

  lines.push("", "Productos:");

  for (const item of order.items) {
    lines.push(
      `- ${item.name} x${item.quantity} · ${new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(item.total / 100)}`,
    );
  }

  if (order.notes) {
    lines.push("", `Notas: ${order.notes}`);
  }

  lines.push(
    "",
    `Descuento aplicado: ${new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(order.discountCents / 100)}`,
    `Total estimado: ${new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(order.totalCents / 100)}`,
  );

  return lines.join("\n");
}

export async function createOrder(rawInput: CheckoutInput) {
  const input = checkoutSchema.parse(rawInput);
  const db = getDb();
  const catalog = await getAdminCatalogSnapshot();
  const productMap = new Map(catalog.products.map((item) => [item.id, item]));

  const items = input.cartItems.map((line) => {
    const product = productMap.get(line.productId);

    if (!product || !product.isActive) {
      throw new Error("Uno o más productos ya no están disponibles.");
    }

    const unitPriceCents = product.priceCents;
    const effectivePriceCents = product.salePriceCents ?? product.priceCents;

    return {
      id: createId("item"),
      orderId: "",
      productId: product.id,
      productSnapshotName: product.name,
      productSnapshotSku: "",
      unitPriceCents,
      saleUnitPriceCents: product.salePriceCents,
      quantity: line.quantity,
      lineSubtotalCents: unitPriceCents * line.quantity,
      lineTotalCents: effectivePriceCents * line.quantity,
    };
  });

  const subtotalCents = items.reduce((total, item) => total + item.lineSubtotalCents, 0);
  const totalCents = items.reduce((total, item) => total + item.lineTotalCents, 0);
  const discountCents = subtotalCents - totalCents;
  const orderId = createId("order");
  const orderNumber = createOrderNumber();
  const whatsAppMessage = buildWhatsAppMessage({
    orderNumber,
    customerCompany: input.customerCompany,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    taxId: input.taxId,
    deliveryCity: input.deliveryCity,
    notes: input.notes,
    items: items.map((item) => ({
      name: item.productSnapshotName,
      quantity: item.quantity,
      total: item.lineTotalCents,
    })),
    totalCents,
    discountCents,
  });
  const whatsAppNumber = getBusinessWhatsAppNumber();
  const whatsAppUrl = whatsAppNumber
    ? `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsAppMessage)}`
    : "";

  const orderRecord: OrderRecord = {
    id: orderId,
    orderNumber,
    status: "pending_whatsapp",
    currencyCode: "ARS",
    subtotalCents,
    discountCents,
    totalCents,
    customerCompany: input.customerCompany,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    taxId: input.taxId || null,
    deliveryCity: input.deliveryCity,
    notes: input.notes || null,
    whatsAppUrl,
    whatsAppMessage,
    source: "shop",
    createdAt: new Date(),
    updatedAt: new Date(),
    items: items.map((item) => ({ ...item, orderId })),
  };

  if (!db) {
    demoOrders.unshift(orderRecord);
    return orderRecord;
  }

  await db.insert(orders).values({
    id: orderRecord.id,
    orderNumber: orderRecord.orderNumber,
    status: orderRecord.status,
    currencyCode: orderRecord.currencyCode,
    subtotalCents: orderRecord.subtotalCents,
    discountCents: orderRecord.discountCents,
    totalCents: orderRecord.totalCents,
    customerCompany: orderRecord.customerCompany,
    customerName: orderRecord.customerName,
    customerPhone: orderRecord.customerPhone,
    customerEmail: orderRecord.customerEmail,
    taxId: orderRecord.taxId,
    deliveryCity: orderRecord.deliveryCity,
    notes: orderRecord.notes,
    whatsAppUrl: orderRecord.whatsAppUrl,
    whatsAppMessage: orderRecord.whatsAppMessage,
    source: orderRecord.source,
  });

  await db.insert(orderItems).values(
    orderRecord.items.map((item) => ({
      id: item.id,
      orderId: orderRecord.id,
      productId: item.productId,
      productSnapshotName: item.productSnapshotName,
      productSnapshotSku: item.productSnapshotSku,
      unitPriceCents: item.unitPriceCents,
      saleUnitPriceCents: item.saleUnitPriceCents,
      quantity: item.quantity,
      lineSubtotalCents: item.lineSubtotalCents,
      lineTotalCents: item.lineTotalCents,
    })),
  );

  return orderRecord;
}

export async function upsertCategory(input: {
  id?: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}) {
  const db = getDb();
  const name = input.name.trim();
  const payload = {
    id: input.id ?? createId("cat"),
    name,
    slug: slugify(name),
    description: input.description?.trim() || null,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
  };

  if (!db) {
    const index = demoCategories.findIndex((item) => item.id === payload.id);
    if (index >= 0) {
      demoCategories[index] = payload;
    } else {
      demoCategories.push(payload);
    }
    return payload;
  }

  const exists = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, payload.id));
  if (exists.length > 0) {
    await db.update(categories).set(payload).where(eq(categories.id, payload.id));
  } else {
    await db.insert(categories).values(payload);
  }
  return payload;
}

export async function upsertProduct(input: {
  id?: string;
  categoryId: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  salePriceCents: number | null;
  availabilityNote?: string;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}) {
  const db = getDb();
  const category = await getCategoryById(input.categoryId);
  if (!category) {
    throw new Error("La categoría seleccionada no existe.");
  }

  const name = input.name.trim();
  const payload = {
    id: input.id ?? createId("prod"),
    categoryId: input.categoryId,
    name,
    slug: slugify(name),
    brand: input.brand.trim(),
    description: input.description.trim(),
    imageUrl: input.imageUrl.trim(),
    priceCents: input.priceCents,
    salePriceCents:
      typeof input.salePriceCents === "number" && input.salePriceCents > 0
        ? input.salePriceCents
        : null,
    isFeatured: input.isFeatured,
    isActive: input.isActive,
    availabilityNote: input.availabilityNote?.trim() || null,
    sortOrder: input.sortOrder,
  };

  if (!db) {
    const mapped: StoreProduct = {
      ...payload,
      categoryName: category.name,
      categorySlug: category.slug,
    };
    const index = demoProducts.findIndex((item) => item.id === mapped.id);
    if (index >= 0) {
      demoProducts[index] = mapped;
    } else {
      demoProducts.push(mapped);
    }
    return mapped;
  }

  const exists = await db.select({ id: products.id }).from(products).where(eq(products.id, payload.id));
  if (exists.length > 0) {
    await db.update(products).set(payload).where(eq(products.id, payload.id));
  } else {
    await db.insert(products).values(payload);
  }

  return {
    ...payload,
    categoryName: category.name,
    categorySlug: category.slug,
  };
}

export async function updateOrderStatus(orderId: string, status: OrderRecord["status"]) {
  const db = getDb();

  if (!db) {
    const order = demoOrders.find((item) => item.id === orderId);
    if (!order) {
      throw new Error("Pedido no encontrado.");
    }
    order.status = status;
    order.updatedAt = new Date();
    return order;
  }

  await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  return getOrderById(orderId);
}

export async function logAdminAction(input: {
  clerkUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  payload?: Record<string, unknown>;
}) {
  const db = getDb();

  if (!db) {
    return;
  }

  await db.insert(adminAuditLogs).values({
    id: createId("audit"),
    clerkUserId: input.clerkUserId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    payloadJson: input.payload ?? null,
  });
}

export function getRuntimeModeLabel() {
  return isDatabaseConfigured() ? "Neon Postgres" : "Demo local";
}
