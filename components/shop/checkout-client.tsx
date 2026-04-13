"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircleMore, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";

type FormState = {
  customerCompany: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  taxId: string;
  deliveryCity: string;
  notes: string;
};

export function CheckoutClient() {
  const cart = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    customerCompany: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    taxId: "",
    deliveryCity: "",
    notes: cart.notes,
  });

  if (!cart.isHydrated) {
    return <div className="text-sm text-muted-foreground">Cargando carrito...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Tu carrito está vacío</CardTitle>
          <CardDescription>
            Sumá productos desde el catálogo antes de pasar al checkout.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Datos del pedido</CardTitle>
          <CardDescription>
            El sistema registrará el pedido y luego te abrirá WhatsApp con el resumen listo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              setIsSubmitting(true);
              startTransition(async () => {
                try {
                  const response = await fetch("/api/checkout", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ...form,
                      notes: form.notes || cart.notes,
                      cartItems: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                      })),
                    }),
                  });

                  const payload = (await response.json()) as
                    | { orderId: string; whatsAppUrl: string }
                    | { error: string };

                  if (!response.ok || "error" in payload) {
                    throw new Error(
                      "error" in payload ? payload.error : "No se pudo crear el pedido.",
                    );
                  }

                  cart.clearCart();
                  router.push(`/shop/confirmation/${payload.orderId}`);
                } catch (error) {
                  toast.error(
                    error instanceof Error ? error.message : "No se pudo crear el pedido.",
                  );
                } finally {
                  setIsSubmitting(false);
                }
              });
            }}
          >
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="customerCompany">
                Empresa
              </label>
              <Input
                id="customerCompany"
                value={form.customerCompany}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customerCompany: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="customerName">
                Contacto
              </label>
              <Input
                id="customerName"
                value={form.customerName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customerName: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="customerPhone">
                Teléfono
              </label>
              <Input
                id="customerPhone"
                value={form.customerPhone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customerPhone: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="customerEmail">
                Email
              </label>
              <Input
                id="customerEmail"
                type="email"
                value={form.customerEmail}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customerEmail: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="taxId">
                CUIT
              </label>
              <Input
                id="taxId"
                value={form.taxId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    taxId: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="deliveryCity">
                Ciudad de entrega
              </label>
              <Input
                id="deliveryCity"
                value={form.deliveryCity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    deliveryCity: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="notes">
                Notas
              </label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                placeholder="Indicaciones de entrega, reemplazos aceptados, horarios, etc."
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Registrando pedido
                  </>
                ) : (
                  <>
                    <MessageCircleMore />
                    Registrar pedido y seguir por WhatsApp
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Resumen del pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.sku} · x{item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  {item.salePriceCents ? (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatCurrency(item.unitPriceCents * item.quantity)}
                    </p>
                  ) : null}
                  <p className="text-sm font-semibold">
                    {formatCurrency((item.salePriceCents ?? item.unitPriceCents) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cart.subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Descuento</span>
                <span className="text-emerald-600">
                  -{formatCurrency(cart.discountCents)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total estimado</span>
                <span>{formatCurrency(cart.totalCents)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] bg-primary text-primary-foreground">
          <CardContent className="flex gap-4 p-6">
            <ShieldCheck className="mt-1 size-5 shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold">Sin checkout de pago</p>
              <p className="text-sm text-primary-foreground/80">
                Persys confirma condiciones comerciales y entrega desde WhatsApp, pero el pedido ya
                queda registrado para seguimiento interno.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
