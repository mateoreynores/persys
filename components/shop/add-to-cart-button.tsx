"use client";

import { useRef, useState } from "react";
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
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const existing = cart.items.find((i) => i.productId === props.productId);
  const inCart = Boolean(existing);
  const minimumQuantity = normalizeMinimumQuantity(props.minimumQuantity);

  function handleAdd() {
    const quantityToAdd = existing ? 1 : minimumQuantity ?? 1;
    cart.addItem(props, quantityToAdd);

    setTransitioning(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setJustAdded(true);
        setTransitioning(false);
      }, 150);
    });

    const qty = (existing?.quantity ?? 0) + quantityToAdd;
    toast.success(`${props.name} agregado`, {
      description: `${qty} ${qty === 1 ? "unidad" : "unidades"} en el carrito`,
    });

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <Button
      onClick={handleAdd}
      variant={justAdded ? "default" : "outline"}
      className="w-full gap-2 transition-[background-color,border-color,color,box-shadow] duration-200 ease-out"
      disabled={justAdded}
    >
      <span
        className="inline-flex items-center gap-2 transition-[filter,opacity] duration-150 ease-out"
        style={transitioning ? { filter: "blur(4px)", opacity: 0.6 } : undefined}
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
      </span>
    </Button>
  );
}
