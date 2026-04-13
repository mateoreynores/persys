import { z } from "zod";

import { orderStatusValues } from "@/db/schema";

export const orderStatusSchema = z.enum(orderStatusValues);

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(999),
});

export const checkoutSchema = z.object({
  customerCompany: z.string().trim().min(2).max(191),
  customerName: z.string().trim().min(2).max(191),
  customerPhone: z.string().trim().min(6).max(191),
  customerEmail: z.email().max(191),
  taxId: z.string().trim().max(191).optional().or(z.literal("")),
  deliveryCity: z.string().trim().min(2).max(191),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  cartItems: z.array(cartLineSchema).min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type StoreProduct = {
  id: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  salePriceCents: number | null;
  isFeatured: boolean;
  isActive: boolean;
  availabilityNote: string | null;
  sortOrder: number;
};

export type CatalogSnapshot = {
  categories: StoreCategory[];
  products: StoreProduct[];
  featuredProducts: StoreProduct[];
  activeProductCount: number;
};

export type OrderLine = {
  id: string;
  orderId: string;
  productId: string | null;
  productSnapshotName: string;
  productSnapshotSku: string;
  unitPriceCents: number;
  saleUnitPriceCents: number | null;
  quantity: number;
  lineSubtotalCents: number;
  lineTotalCents: number;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  status: z.infer<typeof orderStatusSchema>;
  currencyCode: string;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  customerCompany: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  taxId: string | null;
  deliveryCity: string;
  notes: string | null;
  whatsAppUrl: string;
  whatsAppMessage: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderLine[];
};
