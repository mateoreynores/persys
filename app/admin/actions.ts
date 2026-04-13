"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminUser } from "@/lib/admin";
import { parseCurrencyInput } from "@/lib/format";
import {
  logAdminAction,
  updateOrderStatus,
  upsertCategory,
  upsertProduct,
} from "@/lib/store/repository";
import { orderStatusSchema } from "@/lib/store/types";

function getCheckboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getRequiredString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getOptionalString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getNumberValue(formData: FormData, key: string) {
  const value = Number.parseInt(String(formData.get(key) ?? "0"), 10);
  return Number.isFinite(value) ? value : 0;
}

export async function saveCategoryAction(formData: FormData) {
  const session = await requireAdminUser();
  const returnTo = getOptionalString(formData, "returnTo") || "/admin/catalog";

  const category = await upsertCategory({
    id: getOptionalString(formData, "id") || undefined,
    name: getRequiredString(formData, "name"),
    description: getOptionalString(formData, "description"),
    sortOrder: getNumberValue(formData, "sortOrder"),
    isActive: getCheckboxValue(formData, "isActive"),
  });

  if (session?.userId) {
    await logAdminAction({
      clerkUserId: session.userId,
      action: "save_category",
      entityType: "category",
      entityId: category.id,
      payload: { name: category.name },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/catalog");
  revalidatePath("/shop");
  redirect(returnTo);
}

export async function saveProductAction(formData: FormData) {
  const session = await requireAdminUser();
  const returnTo = getOptionalString(formData, "returnTo") || "/admin/catalog";
  const salePriceInput = getOptionalString(formData, "salePrice");

  const product = await upsertProduct({
    id: getOptionalString(formData, "id") || undefined,
    categoryId: getRequiredString(formData, "categoryId"),
    name: getRequiredString(formData, "name"),
    sku: getRequiredString(formData, "sku"),
    brand: getRequiredString(formData, "brand"),
    description: getRequiredString(formData, "description"),
    imageUrl: getRequiredString(formData, "imageUrl"),
    priceCents: parseCurrencyInput(getRequiredString(formData, "price")),
    salePriceCents: salePriceInput ? parseCurrencyInput(salePriceInput) : null,
    availabilityNote: getOptionalString(formData, "availabilityNote"),
    sortOrder: getNumberValue(formData, "sortOrder"),
    isFeatured: getCheckboxValue(formData, "isFeatured"),
    isActive: getCheckboxValue(formData, "isActive"),
  });

  if (session?.userId) {
    await logAdminAction({
      clerkUserId: session.userId,
      action: "save_product",
      entityType: "product",
      entityId: product.id,
      payload: { name: product.name, sku: product.sku },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/catalog");
  revalidatePath("/shop");
  redirect(returnTo);
}

export async function updateOrderStatusAction(formData: FormData) {
  const session = await requireAdminUser();
  const returnTo = getOptionalString(formData, "returnTo") || "/admin/orders";
  const orderId = getRequiredString(formData, "orderId");
  const status = orderStatusSchema.parse(getRequiredString(formData, "status"));

  const order = await updateOrderStatus(orderId, status);

  if (session?.userId && order) {
    await logAdminAction({
      clerkUserId: session.userId,
      action: "update_order_status",
      entityType: "order",
      entityId: order.id,
      payload: { status: order.status },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  redirect(returnTo);
}
