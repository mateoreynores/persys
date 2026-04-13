export function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
}

export function createOrderNumber() {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(
    now.getUTCDate(),
  ).padStart(2, "0")}`;
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();

  return `PERSYS-${stamp}-${suffix}`;
}
