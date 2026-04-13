"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const cart = useCart();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="lg" className="relative">
            <ShoppingCart />
            Carrito
            {cart.isHydrated && cart.itemCount > 0 ? (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {cart.itemCount}
              </span>
            ) : null}
          </Button>
        }
      />
      <SheetContent side="right" className="w-full max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Carrito mayorista</SheetTitle>
          <SheetDescription>
            Ajustá cantidades, revisá descuentos activos y dejá una nota para el pedido.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 px-4 pb-4">
          {cart.items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Todavía no agregaste productos.
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.map((item) => {
                const unit = item.salePriceCents ?? item.unitPriceCents;

                return (
                  <article
                    key={item.productId}
                    className="rounded-3xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.brand} · {item.sku}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => cart.removeItem(item.productId)}
                        aria-label={`Quitar ${item.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Restar ${item.name}`}
                        >
                          <Minus />
                        </Button>
                        <span className="min-w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Sumar ${item.name}`}
                        >
                          <Plus />
                        </Button>
                      </div>

                      <div className="text-right">
                        {item.salePriceCents ? (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatCurrency(item.unitPriceCents)}
                          </p>
                        ) : null}
                        <p className="text-sm font-semibold">{formatCurrency(unit * item.quantity)}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium" htmlFor="cart-notes">
              Notas para el equipo comercial
            </label>
            <Textarea
              id="cart-notes"
              value={cart.notes}
              onChange={(event) => cart.setNotes(event.target.value)}
              placeholder="Ejemplo: priorizar entrega, reemplazos permitidos, horarios de recepción."
            />
          </div>

          <div className="rounded-3xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(cart.subtotalCents)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Descuento por promociones</span>
              <span className="text-emerald-600">
                -{formatCurrency(cart.discountCents)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total estimado</span>
              <span>{formatCurrency(cart.totalCents)}</span>
            </div>
          </div>
        </div>

        <SheetFooter>
          <div className="grid gap-2">
            <Link
              href="/shop/checkout"
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
            >
              Continuar al checkout
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => cart.clearCart()}
              disabled={cart.items.length === 0}
            >
              Vaciar carrito
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
