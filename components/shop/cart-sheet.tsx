"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart01Icon,
  Delete01Icon,
  MinusSignIcon,
  PlusSignIcon,
  ArrowRight01Icon,
  ShoppingBasket01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

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
import {
  getPurchaseValidationMessages,
  normalizeMinimumQuantity,
} from "@/lib/store/purchase-rules";
import { cn } from "@/lib/utils";

export function CartSheet({ cartMinimumAmountCents = 0 }: { cartMinimumAmountCents?: number }) {
  const cart = useCart();
  const validationMessages = useMemo(
    () =>
      getPurchaseValidationMessages({
        items: cart.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          minimumQuantity: item.minimumQuantity,
        })),
        totalCents: cart.totalCents,
        cartMinimumAmountCents,
      }),
    [cart.items, cart.totalCents, cartMinimumAmountCents],
  );

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="relative gap-1.5">
            <HugeiconsIcon icon={ShoppingCart01Icon} size={15} strokeWidth={2} />
            <span className="hidden sm:inline">Carrito</span>
            {cart.isHydrated && cart.itemCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium tabular-nums text-background">
                {cart.itemCount}
              </span>
            )}
          </Button>
        }
      />
      <SheetContent side="right" className="flex w-full max-w-lg flex-col overflow-hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={ShoppingBasket01Icon} size={18} strokeWidth={2} />
            Carrito
            {cart.items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            Revisá los productos, ajustá cantidades y continuá al checkout.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-2">
          {cart.items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60">
                <HugeiconsIcon
                  icon={ShoppingCart01Icon}
                  size={28}
                  strokeWidth={1.4}
                  className="text-muted-foreground/50"
                />
              </div>
              <div>
                <p className="font-medium">Carrito vacío</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explorá el catálogo para empezar.
                </p>
              </div>
              <Link
                href="/shop"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-1 gap-1.5")}
              >
                Ver catálogo
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {cart.items.map((item, index) => {
                  const unit = item.salePriceCents ?? item.unitPriceCents;
                  const hasImage = Boolean(item.imageUrl);
                  const minimumQuantity = normalizeMinimumQuantity(item.minimumQuantity) ?? 1;
                  return (
                    <article
                      key={item.productId}
                      className="flex gap-3 rounded-xl border border-border/50 bg-card p-2.5 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                      style={{ animationDelay: `${index * 50}ms`, animationDuration: "300ms" }}
                    >
                      {/* Thumbnail */}
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted/40">
                        {hasImage ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="image-placeholder h-full w-full">
                            <HugeiconsIcon icon={Image01Icon} size={16} strokeWidth={1.4} />
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium leading-tight">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {item.brand}
                            </p>
                            {item.minimumQuantity && (
                              <p className="text-[11px] text-amber-700">
                                Minimo: {item.minimumQuantity} u.
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => {
                              cart.removeItem(item.productId);
                              toast(`${item.name} eliminado del carrito`);
                            }}
                            aria-label={`Quitar ${item.name}`}
                            className="shrink-0 text-muted-foreground/60 hover:text-destructive"
                          >
                            <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={2} />
                          </Button>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center rounded-md border border-border/50 bg-background">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() =>
                                cart.updateQuantity(item.productId, item.quantity - 1)
                              }
                              disabled={item.quantity <= minimumQuantity}
                              aria-label="Restar"
                              className="disabled:opacity-30"
                            >
                              <HugeiconsIcon icon={MinusSignIcon} size={11} strokeWidth={2.5} />
                            </Button>
                            <span className="min-w-6 text-center text-xs font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() =>
                                cart.updateQuantity(item.productId, item.quantity + 1)
                              }
                              disabled={item.quantity >= 999}
                              aria-label="Sumar"
                              className="disabled:opacity-30"
                            >
                              <HugeiconsIcon icon={PlusSignIcon} size={11} strokeWidth={2.5} />
                            </Button>
                          </div>

                          <div className="text-right">
                            {item.salePriceCents && (
                              <p className="text-[10px] tabular-nums text-muted-foreground line-through">
                                {formatCurrency(item.unitPriceCents * item.quantity)}
                              </p>
                            )}
                            <p className="text-sm font-medium tabular-nums">
                              {formatCurrency(unit * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground" htmlFor="cart-notes">
                  Notas comerciales
                </label>
                <Textarea
                  id="cart-notes"
                  value={cart.notes}
                  onChange={(event) => cart.setNotes(event.target.value)}
                  placeholder="Priorizar entrega, reemplazos permitidos, horarios\u2026"
                  className="min-h-14 resize-none text-sm"
                />
              </div>

              {/* Totals */}
              <div className="rounded-xl bg-muted/40 p-3">
                {cartMinimumAmountCents > 0 && (
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pedido minimo</span>
                    <span className="tabular-nums">
                      {formatCurrency(cartMinimumAmountCents)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(cart.subtotalCents)}</span>
                </div>
                {cart.discountCents > 0 && (
                  <div className="mt-0.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ahorro por ofertas</span>
                    <span className="tabular-nums text-emerald-600">
                      &minus;{formatCurrency(cart.discountCents)}
                    </span>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between border-t border-border/30 pt-2 font-medium">
                  <span>Total</span>
                  <span className="font-heading text-lg tabular-nums">
                    {formatCurrency(cart.totalCents)}
                  </span>
                </div>
              </div>
              {validationMessages.length > 0 && (
                <div aria-live="polite" className="rounded-xl border border-amber-300/70 bg-amber-50/80 p-3 text-xs text-amber-950">
                  {validationMessages.map((message) => (
                    <p key={message}>{message}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {cart.items.length > 0 && (
          <SheetFooter>
            <div className="grid gap-2">
              <Link
                href="/shop/checkout"
                className={cn(buttonVariants({ size: "lg" }), "w-full gap-1.5")}
              >
                Ir al checkout
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const count = cart.itemCount;
                  cart.clearCart();
                  toast(`${count} ${count === 1 ? "producto eliminado" : "productos eliminados"}`);
                }}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Vaciar carrito
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
