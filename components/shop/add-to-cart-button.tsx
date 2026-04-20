"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBasketAdd01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { normalizeMinimumQuantity } from "@/lib/store/purchase-rules";

export function AddToCartButton(props: {
  productId: string;
  name: string;
  brand: string;
  imageUrl: string;
  unitPriceCents: number;
  salePriceCents: number | null;
  minimumQuantity: number | null;
}) {
  const cart = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const existing = cart.items.find((i) => i.productId === props.productId);
  const inCart = Boolean(existing);
  const minimumQuantity = normalizeMinimumQuantity(props.minimumQuantity);

  function handleAdd() {
    const quantityToAdd = existing ? 1 : minimumQuantity ?? 1;
    cart.addItem(props, quantityToAdd);
    setJustAdded(true);

    const qty = (existing?.quantity ?? 0) + quantityToAdd;
    toast.success(`${props.name} agregado`, {
      description: `${qty} ${qty === 1 ? "unidad" : "unidades"} en el carrito`,
    });

    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <Button
      onClick={handleAdd}
      variant={justAdded ? "default" : "outline"}
      className="w-full gap-2 transition-all"
      disabled={justAdded}
    >
      {justAdded ? (
        <>
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} strokeWidth={2} />
          Agregado
        </>
      ) : (
        <>
          <HugeiconsIcon icon={ShoppingBasketAdd01Icon} size={16} strokeWidth={2} />
          {inCart
            ? `Agregar otra (${existing!.quantity})`
            : minimumQuantity
              ? `Agregar minimo (${minimumQuantity})`
              : "Agregar al carrito"}
        </>
      )}
    </Button>
  );
}
