import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

import { getR2Config } from "@/lib/env";

let cachedClient: S3Client | null = null;
let cachedClientAccountId: string | null = null;

export function getR2Client() {
  const config = getR2Config();
  if (!config) {
    return null;
  }

  if (cachedClient && cachedClientAccountId === config.accountId) {
    return cachedClient;
  }

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  cachedClientAccountId = config.accountId;

  return cachedClient;
}

export function getR2Bucket() {
  return getR2Config()?.bucket ?? null;
}

export function buildPublicUrl(key: string) {
  const config = getR2Config();
  if (!config) {
    return "";
  }

  const safeKey = key.replace(/^\/+/, "");
  return `${config.publicBaseUrl}/${safeKey}`;
}

export function keyFromPublicUrl(url: string): string | null {
  const config = getR2Config();
  if (!config || !url) return null;
  if (!url.startsWith(`${config.publicBaseUrl}/`)) return null;
  return url.slice(config.publicBaseUrl.length + 1);
}
