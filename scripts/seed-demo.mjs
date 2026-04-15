import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";

loadEnv({ path: ".env.local" });
loadEnv();

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.NEON_DATABASE_URL ??
  process.env.NEON_POSTGRES_URL;

if (!databaseUrl) {
  throw new Error(
    "Missing database connection string. Set DATABASE_URL, NEON_DATABASE_URL, or NEON_POSTGRES_URL.",
  );
}

const sql = neon(databaseUrl);

const categories = [
  {
    id: "cat-almacen",
    name: "Almacén",
    slug: "almacen",
    description: "Secos, conservas, aceites, harinas y básicos de góndola.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "cat-bebidas",
    name: "Bebidas",
    slug: "bebidas",
    description: "Aguas, gaseosas, jugos y mixers para reposición rápida.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "cat-limpieza",
    name: "Limpieza e higiene",
    slug: "limpieza-e-higiene",
    description: "Detergentes, papel, lavandina y cuidado del hogar.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "cat-snacks",
    name: "Snacks",
    slug: "snacks",
    description: "Compra impulsiva, golosinas y productos de caja.",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "cat-desayuno",
    name: "Desayuno y merienda",
    slug: "desayuno-y-merienda",
    description: "Yerba, café, galletitas y untables para ticket diario.",
    sortOrder: 5,
    isActive: true,
  },
];

const products = [
  {
    id: "prod-aceite-sol",
    categoryId: "cat-almacen",
    name: "Aceite de girasol 900 ml",
    slug: "aceite-de-girasol-900-ml",
    brand: "Cocina Sur",
    description: "Caja mayorista x 12 unidades. Ideal para reposición semanal.",
    imageUrl:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80",
    priceCents: 324000,
    salePriceCents: 299000,
    isFeatured: true,
    isActive: true,
    availabilityNote: "Entrega en 48 hs",
    sortOrder: 1,
  },
  {
    id: "prod-fideos",
    categoryId: "cat-almacen",
    name: "Fideos spaghetti 500 g",
    slug: "fideos-spaghetti-500-g",
    brand: "Molino Río",
    description: "Pack mayorista x 24 unidades para góndola seca.",
    imageUrl:
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=1200&q=80",
    priceCents: 238000,
    salePriceCents: null,
    isFeatured: false,
    isActive: true,
    availabilityNote: null,
    sortOrder: 2,
  },
  {
    id: "prod-arroz",
    categoryId: "cat-almacen",
    name: "Arroz largo fino 1 kg",
    slug: "arroz-largo-fino-1-kg",
    brand: "Campo Claro",
    description: "Bulto x 10 unidades con rotación estable y margen seguro.",
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80",
    priceCents: 267000,
    salePriceCents: 249000,
    isFeatured: false,
    isActive: true,
    availabilityNote: null,
    sortOrder: 3,
  },
  {
    id: "prod-gaseosa-cola",
    categoryId: "cat-bebidas",
    name: "Gaseosa cola 2.25 L",
    slug: "gaseosa-cola-2-25-l",
    brand: "Brío",
    description: "Fardo x 6 botellas PET para alta rotación.",
    imageUrl:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=1200&q=80",
    priceCents: 412000,
    salePriceCents: 389000,
    isFeatured: true,
    isActive: true,
    availabilityNote: "Promoción de temporada",
    sortOrder: 1,
  },
  {
    id: "prod-agua",
    categoryId: "cat-bebidas",
    name: "Agua mineral 1.5 L",
    slug: "agua-mineral-1-5-l",
    brand: "Aqua Norte",
    description: "Pack x 6 unidades, exhibición refrigerada o góndola.",
    imageUrl:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=1200&q=80",
    priceCents: 185000,
    salePriceCents: null,
    isFeatured: false,
    isActive: true,
    availabilityNote: null,
    sortOrder: 2,
  },
  {
    id: "prod-jugo-naranja",
    categoryId: "cat-bebidas",
    name: "Jugo de naranja 1 L",
    slug: "jugo-de-naranja-1-l",
    brand: "Frutal",
    description: "Caja x 12 unidades para heladera y góndola de impulso.",
    imageUrl:
      "https://images.unsplash.com/photo-1600271886742-f049cd5bba3f?auto=format&fit=crop&w=1200&q=80",
    priceCents: 296000,
    salePriceCents: 279000,
    isFeatured: true,
    isActive: true,
    availabilityNote: null,
    sortOrder: 3,
  },
  {
    id: "prod-lavandina",
    categoryId: "cat-limpieza",
    name: "Lavandina 1 L",
    slug: "lavandina-1-l",
    brand: "Blanca Total",
    description: "Caja mayorista x 12 unidades para limpieza hogar y comercio.",
    imageUrl:
      "https://images.unsplash.com/photo-1583947582886-f40ec95dd752?auto=format&fit=crop&w=1200&q=80",
    priceCents: 164000,
    salePriceCents: 149000,
    isFeatured: true,
    isActive: true,
    availabilityNote: null,
    sortOrder: 1,
  },
  {
    id: "prod-papel",
    categoryId: "cat-limpieza",
    name: "Papel higiénico x 4",
    slug: "papel-higienico-x-4",
    brand: "Casa Clara",
    description: "Bulto x 10 packs, alta rotación y margen estable.",
    imageUrl:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1200&q=80",
    priceCents: 278000,
    salePriceCents: null,
    isFeatured: false,
    isActive: true,
    availabilityNote: "Últimas unidades del lote",
    sortOrder: 2,
  },
  {
    id: "prod-detergente",
    categoryId: "cat-limpieza",
    name: "Detergente limón 750 ml",
    slug: "detergente-limon-750-ml",
    brand: "Brillo Max",
    description: "Caja x 12 botellas para reposición del hogar y gastronómicos.",
    imageUrl:
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=1200&q=80",
    priceCents: 221000,
    salePriceCents: 208000,
    isFeatured: false,
    isActive: true,
    availabilityNote: null,
    sortOrder: 3,
  },
  {
    id: "prod-papas",
    categoryId: "cat-snacks",
    name: "Papas fritas clásicas 140 g",
    slug: "papas-fritas-clasicas-140-g",
    brand: "Crunch Club",
    description: "Caja x 18 unidades para exhibición en puntera o caja.",
    imageUrl:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1200&q=80",
    priceCents: 356000,
    salePriceCents: 332000,
    isFeatured: true,
    isActive: true,
    availabilityNote: null,
    sortOrder: 1,
  },
  {
    id: "prod-caramelos",
    categoryId: "cat-snacks",
    name: "Caramelos surtidos 800 g",
    slug: "caramelos-surtidos-800-g",
    brand: "Dulce Día",
    description: "Bolsa institucional para recarga de exhibidores.",
    imageUrl:
      "https://images.unsplash.com/photo-1516747773440-fd9eb4d5b5dd?auto=format&fit=crop&w=1200&q=80",
    priceCents: 214000,
    salePriceCents: null,
    isFeatured: false,
    isActive: true,
    availabilityNote: null,
    sortOrder: 2,
  },
  {
    id: "prod-chocolates",
    categoryId: "cat-snacks",
    name: "Mini chocolates surtidos x 24",
    slug: "mini-chocolates-surtidos-x-24",
    brand: "Cacao Pop",
    description: "Display listo para caja con alta conversión por impulso.",
    imageUrl:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80",
    priceCents: 489000,
    salePriceCents: 459000,
    isFeatured: true,
    isActive: true,
    availabilityNote: "Stock promocional",
    sortOrder: 3,
  },
  {
    id: "prod-yerba",
    categoryId: "cat-desayuno",
    name: "Yerba mate suave 1 kg",
    slug: "yerba-mate-suave-1-kg",
    brand: "Monte Verde",
    description: "Pack x 10 unidades para compra habitual y recompra alta.",
    imageUrl:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80",
    priceCents: 497000,
    salePriceCents: 468000,
    isFeatured: true,
    isActive: true,
    availabilityNote: null,
    sortOrder: 1,
  },
  {
    id: "prod-cafe",
    categoryId: "cat-desayuno",
    name: "Café molido clásico 500 g",
    slug: "cafe-molido-clasico-500-g",
    brand: "Tostado 9",
    description: "Caja x 8 unidades, ideal para autoservicios y kioscos premium.",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    priceCents: 542000,
    salePriceCents: null,
    isFeatured: false,
    isActive: true,
    availabilityNote: null,
    sortOrder: 2,
  },
  {
    id: "prod-galletitas",
    categoryId: "cat-desayuno",
    name: "Galletitas surtidas 400 g",
    slug: "galletitas-surtidas-400-g",
    brand: "Merienda Plus",
    description: "Caja x 18 unidades para combo de desayuno y merienda.",
    imageUrl:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80",
    priceCents: 319000,
    salePriceCents: 301000,
    isFeatured: false,
    isActive: true,
    availabilityNote: null,
    sortOrder: 3,
  },
];

const orders = [
  {
    id: "order-demo-001",
    orderNumber: "PERSYS-20260415-DEMO1",
    status: "pending_whatsapp",
    currencyCode: "ARS",
    subtotalCents: 1180000,
    discountCents: 75000,
    totalCents: 1105000,
    customerCompany: "Autoservicio Central",
    customerName: "Mariela Gómez",
    customerPhone: "+54 9 351 555 0123",
    customerEmail: "compras@autoserviciocentral.com",
    taxId: "30-71234567-8",
    deliveryCity: "Córdoba Capital",
    notes: "Entregar por la mañana y avisar al llegar.",
    whatsAppUrl:
      "https://wa.me/5493510000000?text=Hola%20Persys%2C%20quiero%20confirmar%20el%20pedido%20PERSYS-20260415-DEMO1.",
    whatsAppMessage:
      "Hola Persys, quiero confirmar el pedido PERSYS-20260415-DEMO1.\n\nEmpresa: Autoservicio Central\nContacto: Mariela Gómez\nTeléfono: +54 9 351 555 0123\nEmail: compras@autoserviciocentral.com\nCiudad de entrega: Córdoba Capital\nCUIT/CUIT: 30-71234567-8\n\nProductos:\n- Aceite de girasol 900 ml x2 · $598.000\n- Papas fritas clásicas 140 g x1 · $332.000\n- Yerba mate suave 1 kg x1 · $468.000\n\nNotas: Entregar por la mañana y avisar al llegar.\n\nDescuento aplicado: $75.000\nTotal estimado: $1.105.000",
    source: "shop",
    createdAt: new Date("2026-04-15T09:15:00.000Z"),
    updatedAt: new Date("2026-04-15T09:15:00.000Z"),
  },
  {
    id: "order-demo-002",
    orderNumber: "PERSYS-20260414-DEMO2",
    status: "confirmed",
    currencyCode: "ARS",
    subtotalCents: 1614000,
    discountCents: 101000,
    totalCents: 1513000,
    customerCompany: "Kiosco Nueva Esquina",
    customerName: "Federico Luna",
    customerPhone: "+54 9 351 555 0177",
    customerEmail: "pedidos@nuevaesquina.com.ar",
    taxId: null,
    deliveryCity: "Villa Allende",
    notes: "Dejar en depósito lateral.",
    whatsAppUrl:
      "https://wa.me/5493510000000?text=Hola%20Persys%2C%20quiero%20confirmar%20el%20pedido%20PERSYS-20260414-DEMO2.",
    whatsAppMessage:
      "Hola Persys, quiero confirmar el pedido PERSYS-20260414-DEMO2.\n\nEmpresa: Kiosco Nueva Esquina\nContacto: Federico Luna\nTeléfono: +54 9 351 555 0177\nEmail: pedidos@nuevaesquina.com.ar\nCiudad de entrega: Villa Allende\n\nProductos:\n- Gaseosa cola 2.25 L x2 · $778.000\n- Mini chocolates surtidos x 24 x1 · $459.000\n- Galletitas surtidas 400 g x1 · $301.000\n\nNotas: Dejar en depósito lateral.\n\nDescuento aplicado: $101.000\nTotal estimado: $1.513.000",
    source: "shop",
    createdAt: new Date("2026-04-14T13:40:00.000Z"),
    updatedAt: new Date("2026-04-14T15:05:00.000Z"),
  },
  {
    id: "order-demo-003",
    orderNumber: "PERSYS-20260413-DEMO3",
    status: "fulfilled",
    currencyCode: "ARS",
    subtotalCents: 1029000,
    discountCents: 60000,
    totalCents: 969000,
    customerCompany: "Despensa San Martín",
    customerName: "Luciana Roldán",
    customerPhone: "+54 9 351 555 0199",
    customerEmail: "compras@despensasanmartin.com",
    taxId: "27-33444555-1",
    deliveryCity: "Alta Gracia",
    notes: "Pedido entregado completo.",
    whatsAppUrl:
      "https://wa.me/5493510000000?text=Hola%20Persys%2C%20quiero%20confirmar%20el%20pedido%20PERSYS-20260413-DEMO3.",
    whatsAppMessage:
      "Hola Persys, quiero confirmar el pedido PERSYS-20260413-DEMO3.\n\nEmpresa: Despensa San Martín\nContacto: Luciana Roldán\nTeléfono: +54 9 351 555 0199\nEmail: compras@despensasanmartin.com\nCiudad de entrega: Alta Gracia\nCUIT/CUIT: 27-33444555-1\n\nProductos:\n- Lavandina 1 L x3 · $447.000\n- Papel higiénico x 4 x1 · $278.000\n- Jugo de naranja 1 L x1 · $279.000\n\nNotas: Pedido entregado completo.\n\nDescuento aplicado: $60.000\nTotal estimado: $969.000",
    source: "shop",
    createdAt: new Date("2026-04-13T16:20:00.000Z"),
    updatedAt: new Date("2026-04-13T18:10:00.000Z"),
  },
];

const orderItems = [
  {
    id: "item-demo-001",
    orderId: "order-demo-001",
    productId: "prod-aceite-sol",
    productSnapshotName: "Aceite de girasol 900 ml",
    productSnapshotSku: "DEMO-ACEITE-900",
    unitPriceCents: 324000,
    saleUnitPriceCents: 299000,
    quantity: 2,
    lineSubtotalCents: 648000,
    lineTotalCents: 598000,
    createdAt: new Date("2026-04-15T09:15:00.000Z"),
  },
  {
    id: "item-demo-002",
    orderId: "order-demo-001",
    productId: "prod-papas",
    productSnapshotName: "Papas fritas clásicas 140 g",
    productSnapshotSku: "DEMO-PAPAS-140",
    unitPriceCents: 356000,
    saleUnitPriceCents: 332000,
    quantity: 1,
    lineSubtotalCents: 356000,
    lineTotalCents: 332000,
    createdAt: new Date("2026-04-15T09:15:00.000Z"),
  },
  {
    id: "item-demo-003",
    orderId: "order-demo-001",
    productId: "prod-yerba",
    productSnapshotName: "Yerba mate suave 1 kg",
    productSnapshotSku: "DEMO-YERBA-1KG",
    unitPriceCents: 497000,
    saleUnitPriceCents: 468000,
    quantity: 1,
    lineSubtotalCents: 497000,
    lineTotalCents: 468000,
    createdAt: new Date("2026-04-15T09:15:00.000Z"),
  },
  {
    id: "item-demo-004",
    orderId: "order-demo-002",
    productId: "prod-gaseosa-cola",
    productSnapshotName: "Gaseosa cola 2.25 L",
    productSnapshotSku: "DEMO-COLA-225",
    unitPriceCents: 412000,
    saleUnitPriceCents: 389000,
    quantity: 2,
    lineSubtotalCents: 824000,
    lineTotalCents: 778000,
    createdAt: new Date("2026-04-14T13:40:00.000Z"),
  },
  {
    id: "item-demo-005",
    orderId: "order-demo-002",
    productId: "prod-chocolates",
    productSnapshotName: "Mini chocolates surtidos x 24",
    productSnapshotSku: "DEMO-CHOCO-24",
    unitPriceCents: 489000,
    saleUnitPriceCents: 459000,
    quantity: 1,
    lineSubtotalCents: 489000,
    lineTotalCents: 459000,
    createdAt: new Date("2026-04-14T13:40:00.000Z"),
  },
  {
    id: "item-demo-006",
    orderId: "order-demo-002",
    productId: "prod-galletitas",
    productSnapshotName: "Galletitas surtidas 400 g",
    productSnapshotSku: "DEMO-GALLETAS-400",
    unitPriceCents: 319000,
    saleUnitPriceCents: 301000,
    quantity: 1,
    lineSubtotalCents: 319000,
    lineTotalCents: 301000,
    createdAt: new Date("2026-04-14T13:40:00.000Z"),
  },
  {
    id: "item-demo-007",
    orderId: "order-demo-003",
    productId: "prod-lavandina",
    productSnapshotName: "Lavandina 1 L",
    productSnapshotSku: "DEMO-LAVANDINA-1L",
    unitPriceCents: 164000,
    saleUnitPriceCents: 149000,
    quantity: 3,
    lineSubtotalCents: 492000,
    lineTotalCents: 447000,
    createdAt: new Date("2026-04-13T16:20:00.000Z"),
  },
  {
    id: "item-demo-008",
    orderId: "order-demo-003",
    productId: "prod-papel",
    productSnapshotName: "Papel higiénico x 4",
    productSnapshotSku: "DEMO-PAPEL-X4",
    unitPriceCents: 278000,
    saleUnitPriceCents: null,
    quantity: 1,
    lineSubtotalCents: 278000,
    lineTotalCents: 278000,
    createdAt: new Date("2026-04-13T16:20:00.000Z"),
  },
  {
    id: "item-demo-009",
    orderId: "order-demo-003",
    productId: "prod-jugo-naranja",
    productSnapshotName: "Jugo de naranja 1 L",
    productSnapshotSku: "DEMO-JUGO-1L",
    unitPriceCents: 296000,
    saleUnitPriceCents: 279000,
    quantity: 1,
    lineSubtotalCents: 296000,
    lineTotalCents: 279000,
    createdAt: new Date("2026-04-13T16:20:00.000Z"),
  },
];

async function countRows(tableName) {
  const statements = {
    products: "select count(*)::int as count from products",
    categories: "select count(*)::int as count from categories",
    orders: "select count(*)::int as count from orders",
    order_items: "select count(*)::int as count from order_items",
  };
  const query = statements[tableName];
  if (!query) {
    throw new Error(`Unsupported table name: ${tableName}`);
  }
  const rows = await sql.query(query);
  return rows[0]?.count ?? 0;
}

const previousProductCount = await countRows("products");
const previousCategoryCount = await countRows("categories");
const previousOrderCount = await countRows("orders");
const previousOrderItemCount = await countRows("order_items");

await sql.transaction((tx) => [
  tx`delete from order_items`,
  tx`delete from orders`,
  tx`delete from products`,
  tx`delete from categories`,
  ...categories.map((category) => tx`
    insert into categories (id, name, slug, description, sort_order, is_active)
    values (
      ${category.id},
      ${category.name},
      ${category.slug},
      ${category.description},
      ${category.sortOrder},
      ${category.isActive}
    )
  `),
  ...products.map((product) => tx`
    insert into products (
      id,
      category_id,
      name,
      slug,
      brand,
      description,
      image_url,
      price_cents,
      sale_price_cents,
      is_featured,
      is_active,
      availability_note,
      sort_order
    )
    values (
      ${product.id},
      ${product.categoryId},
      ${product.name},
      ${product.slug},
      ${product.brand},
      ${product.description},
      ${product.imageUrl},
      ${product.priceCents},
      ${product.salePriceCents},
      ${product.isFeatured},
      ${product.isActive},
      ${product.availabilityNote},
      ${product.sortOrder}
    )
  `),
  ...orders.map((order) => tx`
    insert into orders (
      id,
      order_number,
      status,
      currency_code,
      subtotal_cents,
      discount_cents,
      total_cents,
      customer_company,
      customer_name,
      customer_phone,
      customer_email,
      tax_id,
      delivery_city,
      notes,
      whats_app_url,
      whats_app_message,
      source,
      created_at,
      updated_at
    )
    values (
      ${order.id},
      ${order.orderNumber},
      ${order.status},
      ${order.currencyCode},
      ${order.subtotalCents},
      ${order.discountCents},
      ${order.totalCents},
      ${order.customerCompany},
      ${order.customerName},
      ${order.customerPhone},
      ${order.customerEmail},
      ${order.taxId},
      ${order.deliveryCity},
      ${order.notes},
      ${order.whatsAppUrl},
      ${order.whatsAppMessage},
      ${order.source},
      ${order.createdAt},
      ${order.updatedAt}
    )
  `),
  ...orderItems.map((item) => tx`
    insert into order_items (
      id,
      order_id,
      product_id,
      product_snapshot_name,
      product_snapshot_sku,
      unit_price_cents,
      sale_unit_price_cents,
      quantity,
      line_subtotal_cents,
      line_total_cents,
      created_at
    )
    values (
      ${item.id},
      ${item.orderId},
      ${item.productId},
      ${item.productSnapshotName},
      ${item.productSnapshotSku},
      ${item.unitPriceCents},
      ${item.saleUnitPriceCents},
      ${item.quantity},
      ${item.lineSubtotalCents},
      ${item.lineTotalCents},
      ${item.createdAt}
    )
  `),
]);

const nextProductCount = await countRows("products");
const nextCategoryCount = await countRows("categories");
const nextOrderCount = await countRows("orders");
const nextOrderItemCount = await countRows("order_items");

console.log(
  `Seed complete. Categories: ${previousCategoryCount} -> ${nextCategoryCount}. Products: ${previousProductCount} -> ${nextProductCount}. Orders: ${previousOrderCount} -> ${nextOrderCount}. Order items: ${previousOrderItemCount} -> ${nextOrderItemCount}.`,
);
