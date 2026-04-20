import {
  boolean,
  integer,
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
};

export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull().unique(),
    description: text("description"),
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps,
  },
  (table) => [index("categories_active_sort_idx").on(table.isActive, table.sortOrder)],
);

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    categoryId: varchar("category_id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull().unique(),
    brand: varchar("brand", { length: 191 }).notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    priceCents: integer("price_cents").notNull(),
    salePriceCents: integer("sale_price_cents"),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    availabilityNote: varchar("availability_note", { length: 191 }),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps,
  },
  (table) => [
    index("products_category_active_sort_idx").on(
      table.categoryId,
      table.isActive,
      table.sortOrder,
    ),
    index("products_featured_idx").on(table.isFeatured, table.isActive),
  ],
);

export const orderStatusValues = [
  "pending_whatsapp",
  "submitted",
  "confirmed",
  "fulfilled",
  "cancelled",
] as const;
export const orderStatusEnum = pgEnum("order_status", orderStatusValues);

export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    orderNumber: varchar("order_number", { length: 191 }).notNull().unique(),
    status: orderStatusEnum("status").default("pending_whatsapp").notNull(),
    currencyCode: varchar("currency_code", { length: 3 }).default("ARS").notNull(),
    subtotalCents: integer("subtotal_cents").notNull(),
    discountCents: integer("discount_cents").notNull(),
    totalCents: integer("total_cents").notNull(),
    customerCompany: varchar("customer_company", { length: 191 }).notNull(),
    customerName: varchar("customer_name", { length: 191 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 191 }).notNull(),
    customerEmail: varchar("customer_email", { length: 191 }).notNull(),
    taxId: varchar("tax_id", { length: 191 }),
    deliveryCity: varchar("delivery_city", { length: 191 }).notNull(),
    notes: text("notes"),
    whatsAppUrl: text("whats_app_url").notNull(),
    whatsAppMessage: text("whats_app_message").notNull(),
    source: varchar("source", { length: 64 }).default("shop").notNull(),
    ...timestamps,
  },
  (table) => [index("orders_status_created_idx").on(table.status, table.createdAt)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    orderId: varchar("order_id", { length: 191 }).notNull(),
    productId: varchar("product_id", { length: 191 }),
    productSnapshotName: varchar("product_snapshot_name", { length: 191 }).notNull(),
    productSnapshotSku: varchar("product_snapshot_sku", { length: 191 }).notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    saleUnitPriceCents: integer("sale_unit_price_cents"),
    quantity: integer("quantity").notNull(),
    lineSubtotalCents: integer("line_subtotal_cents").notNull(),
    lineTotalCents: integer("line_total_cents").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export const promoBanners = pgTable(
  "promo_banners",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    title: varchar("title", { length: 191 }).notNull(),
    subtitle: varchar("subtitle", { length: 255 }),
    imageUrl: text("image_url").notNull(),
    imageKey: varchar("image_key", { length: 255 }).notNull(),
    ctaLabel: varchar("cta_label", { length: 64 })
      .default("Ver promoción")
      .notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps,
  },
  (table) => [index("promo_banners_active_sort_idx").on(table.isActive, table.sortOrder)],
);

export const promoBannerProducts = pgTable(
  "promo_banner_products",
  {
    bannerId: varchar("banner_id", { length: 191 }).notNull(),
    productId: varchar("product_id", { length: 191 }).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.bannerId, table.productId] }),
    index("promo_banner_products_banner_idx").on(table.bannerId),
  ],
);

export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    clerkUserId: varchar("clerk_user_id", { length: 191 }).notNull(),
    action: varchar("action", { length: 191 }).notNull(),
    entityType: varchar("entity_type", { length: 191 }).notNull(),
    entityId: varchar("entity_id", { length: 191 }).notNull(),
    payloadJson: jsonb("payload_json"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("admin_audit_logs_created_idx").on(table.createdAt)],
);
