"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBasketAdd01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export function AddToCartButton(props: {
  productId: string;
  name: string;
  brand: string;
  imageUrl: string;
  unitPriceCents: number;
  salePriceCents: number | null;
}) {
  const cart = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const existing = cart.items.find((i) => i.productId === props.productId);
  const inCart = Boolean(existing);

  function handleAdd() {
    cart.addItem(props, 1);
    setJustAdded(true);

    const qty = (existing?.quantity ?? 0) + 1;
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
          {inCart ? `Agregar otra (${existing!.quantity})` : "Agregar al carrito"}
        </>
      )}
    </Button>
  );
}
