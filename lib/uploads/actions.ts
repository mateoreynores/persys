"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { requireAdminUser } from "@/lib/admin";
import { createId } from "@/lib/id";
import { buildPublicUrl, getR2Bucket, getR2Client } from "@/lib/r2";

const ALLOWED_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const SIGNED_URL_EXPIRY_SECONDS = 60;

const ALLOWED_SCOPES = ["banner", "product"] as const;
type UploadScope = (typeof ALLOWED_SCOPES)[number];

export type UploadPresignResult =
  | {
      ok: true;
      uploadUrl: string;
      publicUrl: string;
      key: string;
      contentType: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function requestUploadUrlAction(input: {
  contentType: string;
  contentLength: number;
  scope: UploadScope;
}): Promise<UploadPresignResult> {
  await requireAdminUser();

  const scope: UploadScope = ALLOWED_SCOPES.includes(input.scope) ? input.scope : "product";

  const contentType = (input.contentType || "").toLowerCase();
  const extension = ALLOWED_MIME[contentType];
  if (!extension) {
    return {
      ok: false,
      error: "Formato no permitido. Solo PNG, JPG o WebP.",
    };
  }

  if (!Number.isFinite(input.contentLength) || input.contentLength <= 0) {
    return { ok: false, error: "Archivo vacío o inválido." };
  }

  if (input.contentLength > MAX_SIZE_BYTES) {
    return {
      ok: false,
      error: `El archivo supera el máximo de ${Math.round(MAX_SIZE_BYTES / (1024 * 1024))}MB.`,
    };
  }

  const client = getR2Client();
  const bucket = getR2Bucket();
  if (!client || !bucket) {
    return {
      ok: false,
      error: "Storage no configurado. Falta R2 en las variables de entorno.",
    };
  }

  const keyPrefix = scope === "banner" ? "banners" : "products";
  const key = `${keyPrefix}/${createId(scope)}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  try {
    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: SIGNED_URL_EXPIRY_SECONDS,
    });

    return {
      ok: true,
      uploadUrl,
      publicUrl: buildPublicUrl(key),
      key,
      contentType,
    };
  } catch (error) {
    console.error("[uploads] presign failed", error);
    return {
      ok: false,
      error: "No se pudo generar la URL de carga. Probá de nuevo.",
    };
  }
}
