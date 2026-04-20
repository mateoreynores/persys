"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminUser } from "@/lib/admin";
import { parseCurrencyInput } from "@/lib/format";
import { keyFromPublicUrl } from "@/lib/r2";
import {
  deletePromoBanner,
  setPromoProducts,
  upsertPromoBanner,
} from "@/lib/store/promos";
import {
  logAdminAction,
  updateOrderStatus,
  upsertCategory,
  upsertProduct,
  upsertStoreSettings,
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

function revalidateCatalog() {
  revalidatePath("/admin");
  revalidatePath("/admin/catalog");
  revalidatePath("/shop");
  revalidatePath("/shop/checkout");
}

function revalidatePromos() {
  revalidatePath("/admin");
  revalidatePath("/admin/promos");
  revalidatePath("/shop");
}

function getAllValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

export async function saveCategoryAction(formData: FormData) {
  const session = await requireAdminUser();

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

  revalidateCatalog();
}

export async function saveProductAction(formData: FormData) {
  const session = await requireAdminUser();
  const salePriceInput = getOptionalString(formData, "salePrice");
  const minimumQuantityInput = getOptionalString(formData, "minimumQuantity");

  const product = await upsertProduct({
    id: getOptionalString(formData, "id") || undefined,
    categoryId: getRequiredString(formData, "categoryId"),
    name: getRequiredString(formData, "name"),
    brand: getRequiredString(formData, "brand"),
    description: getRequiredString(formData, "description"),
    imageUrl: getRequiredString(formData, "imageUrl"),
    priceCents: parseCurrencyInput(getRequiredString(formData, "price")),
    salePriceCents: salePriceInput ? parseCurrencyInput(salePriceInput) : null,
    minimumQuantity: minimumQuantityInput ? getNumberValue(formData, "minimumQuantity") : null,
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
      payload: { name: product.name },
    });
  }

  revalidateCatalog();
}

export async function saveStoreSettingsAction(formData: FormData) {
  const session = await requireAdminUser();

  const settings = await upsertStoreSettings({
    cartMinimumAmountCents: parseCurrencyInput(getOptionalString(formData, "cartMinimumAmount")),
  });

  if (session?.userId) {
    await logAdminAction({
      clerkUserId: session.userId,
      action: "save_store_settings",
      entityType: "store_settings",
      entityId: settings.id,
      payload: {
        cartMinimumAmountCents: settings.cartMinimumAmountCents,
      },
    });
  }

  revalidateCatalog();
}

export async function savePromoBannerAction(formData: FormData) {
  const session = await requireAdminUser();

  const id = getOptionalString(formData, "id") || undefined;
  const imageUrl = getRequiredString(formData, "imageUrl");
  const providedKey = getOptionalString(formData, "imageKey");
  const imageKey = providedKey || keyFromPublicUrl(imageUrl) || "";

  if (!imageUrl) {
    throw new Error("Subí una imagen para la promoción.");
  }

  const banner = await upsertPromoBanner({
    id,
    title: getRequiredString(formData, "title"),
    subtitle: getOptionalString(formData, "subtitle") || null,
    imageUrl,
    imageKey,
    ctaLabel: getOptionalString(formData, "ctaLabel") || "Ver promoción",
    sortOrder: getNumberValue(formData, "sortOrder"),
    isActive: getCheckboxValue(formData, "isActive"),
  });

  const productIds = getAllValues(formData, "productIds");
  await setPromoProducts(banner.id, productIds);

  if (session?.userId) {
    await logAdminAction({
      clerkUserId: session.userId,
      action: "save_promo_banner",
      entityType: "promo_banner",
      entityId: banner.id,
      payload: { title: banner.title, productCount: productIds.length },
    });
  }

  revalidatePromos();
}

export async function deletePromoBannerAction(formData: FormData) {
  const session = await requireAdminUser();
  const bannerId = getRequiredString(formData, "id");

  await deletePromoBanner(bannerId);

  if (session?.userId) {
    await logAdminAction({
      clerkUserId: session.userId,
      action: "delete_promo_banner",
      entityType: "promo_banner",
      entityId: bannerId,
    });
  }

  revalidatePromos();
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
