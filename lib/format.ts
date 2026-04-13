export function formatCurrency(amountInCents: number, currencyCode = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);
}

export function formatDateTime(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseCurrencyInput(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const amount = Number.parseFloat(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return Math.round(amount * 100);
}

export function centsToInputValue(value: number | null | undefined) {
  if (typeof value !== "number") {
    return "";
  }

  return (value / 100).toFixed(2).replace(".", ",");
}
