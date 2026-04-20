import { formatCurrency } from "@/lib/format";

export function normalizeMinimumQuantity(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 1 ? value : null;
}

export function normalizeCartMinimumAmountCents(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

export function getProductMinimumQuantityMessage(productName: string, minimumQuantity: number) {
  return `${productName} requiere una compra minima de ${minimumQuantity} ${
    minimumQuantity === 1 ? "unidad" : "unidades"
  }.`;
}

export function getCartMinimumAmountMessage(cartMinimumAmountCents: number) {
  return `El pedido minimo es de ${formatCurrency(cartMinimumAmountCents)}.`;
}

export function getPurchaseValidationMessages(input: {
  items: Array<{
    name: string;
    quantity: number;
    minimumQuantity: number | null | undefined;
  }>;
  totalCents: number;
  cartMinimumAmountCents: number | null | undefined;
}) {
  const messages: string[] = [];
  const cartMinimumAmountCents = normalizeCartMinimumAmountCents(input.cartMinimumAmountCents);

  if (cartMinimumAmountCents > 0 && input.totalCents < cartMinimumAmountCents) {
    messages.push(getCartMinimumAmountMessage(cartMinimumAmountCents));
  }

  for (const item of input.items) {
    const minimumQuantity = normalizeMinimumQuantity(item.minimumQuantity);
    if (minimumQuantity && item.quantity < minimumQuantity) {
      messages.push(getProductMinimumQuantityMessage(item.name, minimumQuantity));
    }
  }

  return messages;
}
