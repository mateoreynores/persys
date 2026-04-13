"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export function AddToCartButton(props: {
  productId: string;
  name: string;
  sku: string;
  brand: string;
  imageUrl: string;
  unitPriceCents: number;
  salePriceCents: number | null;
}) {
  const cart = useCart();

  return (
    <Button
      onClick={() => {
        cart.addItem(props, 1);
        toast.success(`${props.name} agregado al carrito.`);
      }}
      className="w-full"
    >
      <ShoppingCart />
      Agregar
    </Button>
  );
}
