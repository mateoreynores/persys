import "server-only";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { asc, eq, inArray } from "drizzle-orm";

import { promoBannerProducts, promoBanners } from "@/db/schema";
import { getDb } from "@/lib/db";
import { createId } from "@/lib/id";
import { getR2Bucket, getR2Client } from "@/lib/r2";
import { getAdminCatalogSnapshot } from "@/lib/store/repository";
import type { PromoBanner, PromoBannerWithProducts, StoreProduct } from "@/lib/store/types";

function mapBannerRow(row: typeof promoBanners.$inferSelect, productIds: string[]): PromoBanner {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.imageUrl,
    imageKey: row.imageKey,
    ctaLabel: row.ctaLabel,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    productIds,
  };
}

async function fetchBannerRows(filterActive: boolean) {
  const db = getDb();
  if (!db) {
    return [] as PromoBanner[];
  }

  const rows = await db
    .select()
    .from(promoBanners)
    .orderBy(asc(promoBanners.sortOrder), asc(promoBanners.createdAt));

  const filtered = filterActive ? rows.filter((row) => row.isActive) : rows;
  if (filtered.length === 0) {
    return [];
  }

  const ids = filtered.map((row) => row.id);
  const linkRows = await db
    .select()
    .from(promoBannerProducts)
    .where(inArray(promoBannerProducts.bannerId, ids))
    .orderBy(asc(promoBannerProducts.sortOrder));

  const linkMap = new Map<string, string[]>();
  for (const link of linkRows) {
    const current = linkMap.get(link.bannerId) ?? [];
    current.push(link.productId);
    linkMap.set(link.bannerId, current);
  }

  return filtered.map((row) => mapBannerRow(row, linkMap.get(row.id) ?? []));
}

function hydratePromoWithProducts(
  banner: PromoBanner,
  productMap: Map<string, StoreProduct>,
): PromoBannerWithProducts {
  const products = banner.productIds
    .map((id) => productMap.get(id))
    .filter((product): product is StoreProduct => Boolean(product && product.isActive));

  return { ...banner, products };
}

export async function listActivePromos(): Promise<PromoBannerWithProducts[]> {
  const banners = await fetchBannerRows(true);
  if (banners.length === 0) {
    return [];
  }

  const catalog = await getAdminCatalogSnapshot();
  const productMap = new Map(catalog.products.map((item) => [item.id, item]));

  return banners
    .map((banner) => hydratePromoWithProducts(banner, productMap))
    .filter((banner) => banner.products.length > 0);
}

export async function listAdminPromos(): Promise<PromoBannerWithProducts[]> {
  const banners = await fetchBannerRows(false);
  if (banners.length === 0) {
    return [];
  }

  const catalog = await getAdminCatalogSnapshot();
  const productMap = new Map(catalog.products.map((item) => [item.id, item]));

  return banners.map((banner) => hydratePromoWithProducts(banner, productMap));
}

export async function getPromoById(id: string): Promise<PromoBannerWithProducts | null> {
  const banners = await listAdminPromos();
  return banners.find((banner) => banner.id === id) ?? null;
}

export async function upsertPromoBanner(input: {
  id?: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  imageKey: string;
  ctaLabel: string;
  isActive: boolean;
  sortOrder: number;
}): Promise<PromoBanner> {
  const db = getDb();
  if (!db) {
    throw new Error("Base de datos no configurada. No se pueden guardar promos.");
  }

  const payload = {
    id: input.id ?? createId("banner"),
    title: input.title.trim(),
    subtitle: input.subtitle?.trim() ? input.subtitle.trim() : null,
    imageUrl: input.imageUrl.trim(),
    imageKey: input.imageKey.trim(),
    ctaLabel: input.ctaLabel.trim() || "Ver promoción",
    isActive: input.isActive,
    sortOrder: input.sortOrder,
  };

  const exists = await db
    .select({ id: promoBanners.id, imageKey: promoBanners.imageKey })
    .from(promoBanners)
    .where(eq(promoBanners.id, payload.id));

  if (exists.length > 0) {
    const previousKey = exists[0].imageKey;
    await db.update(promoBanners).set(payload).where(eq(promoBanners.id, payload.id));

    if (previousKey && previousKey !== payload.imageKey) {
      await deleteR2Object(previousKey);
    }
  } else {
    await db.insert(promoBanners).values(payload);
  }

  return mapBannerRow(
    {
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as typeof promoBanners.$inferSelect,
    [],
  );
}

export async function setPromoProducts(bannerId: string, productIds: string[]) {
  const db = getDb();
  if (!db) {
    throw new Error("Base de datos no configurada.");
  }

  const uniqueIds = Array.from(new Set(productIds.filter(Boolean)));

  await db.delete(promoBannerProducts).where(eq(promoBannerProducts.bannerId, bannerId));

  if (uniqueIds.length === 0) {
    return;
  }

  await db.insert(promoBannerProducts).values(
    uniqueIds.map((productId, index) => ({
      bannerId,
      productId,
      sortOrder: index,
    })),
  );
}

export async function deletePromoBanner(bannerId: string) {
  const db = getDb();
  if (!db) {
    throw new Error("Base de datos no configurada.");
  }

  const rows = await db
    .select({ imageKey: promoBanners.imageKey })
    .from(promoBanners)
    .where(eq(promoBanners.id, bannerId));

  await db.delete(promoBannerProducts).where(eq(promoBannerProducts.bannerId, bannerId));
  await db.delete(promoBanners).where(eq(promoBanners.id, bannerId));

  if (rows[0]?.imageKey) {
    await deleteR2Object(rows[0].imageKey);
  }
}

async function deleteR2Object(key: string) {
  const client = getR2Client();
  const bucket = getR2Bucket();
  if (!client || !bucket || !key) return;

  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (error) {
    console.error("[promos] failed to delete R2 object", { key, error });
  }
}
