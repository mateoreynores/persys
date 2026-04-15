"use client";

import { startTransition, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  WhatsappBusinessIcon,
  Loading01Icon,
  Shield01Icon,
  ShoppingCart01Icon,
  ArrowRight01Icon,
  Image01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type FormState = {
  customerCompany: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  taxId: string;
  deliveryCity: string;
  notes: string;
};

function FieldGroup({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-sm font-medium" htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-destructive/70">*</span>}
        </label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

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

  const updateField = useCallback(
    (field: keyof FormState) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((current) => ({ ...current, [field]: event.target.value })),
    [],
  );

  const isFormValid = useMemo(() => {
    return (
      form.customerCompany.trim().length >= 2 &&
      form.customerName.trim().length >= 2 &&
      form.customerPhone.trim().length >= 6 &&
      form.customerEmail.includes("@") &&
      form.deliveryCity.trim().length >= 2
    );
  }, [form]);

  if (!cart.isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <HugeiconsIcon icon={Loading01Icon} size={20} strokeWidth={2} className="animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Cargando carrito...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60">
          <HugeiconsIcon icon={ShoppingCart01Icon} size={28} strokeWidth={1.4} className="text-muted-foreground/50" />
        </div>
        <div>
          <p className="font-heading text-lg font-medium">Carrito vacío</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Agregá productos desde el catálogo para poder continuar.
          </p>
        </div>
        <Link href="/shop" className={cn(buttonVariants(), "gap-1.5")}>
          Ir al catálogo
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Datos comerciales</CardTitle>
          <CardDescription>
            Completá los datos de tu empresa. El pedido se registra y se continúa por WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();

              if (!isFormValid) {
                toast.error("Revisá los campos obligatorios", {
                  description: "Empresa, contacto, teléfono, email y ciudad son requeridos.",
                });
                return;
              }

              setIsSubmitting(true);
              startTransition(async () => {
                try {
                  const response = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
                    throw new Error("error" in payload ? payload.error : "Error al registrar el pedido.");
                  }

                  toast.success("Pedido registrado", {
                    description: "Redirigiendo a la confirmación...",
                  });

                  cart.clearCart();
                  router.push(`/shop/confirmation/${payload.orderId}`);
                } catch (error) {
                  toast.error("No se pudo registrar el pedido", {
                    description: error instanceof Error ? error.message : "Intentá de nuevo en unos segundos.",
                  });
                } finally {
                  setIsSubmitting(false);
                }
              });
            }}
          >
            <FieldGroup label="Empresa" htmlFor="customerCompany" required className="md:col-span-2">
              <Input
                id="customerCompany"
                placeholder="Razón social o nombre del negocio"
                value={form.customerCompany}
                onChange={updateField("customerCompany")}
                required
                disabled={isSubmitting}
              />
            </FieldGroup>

            <FieldGroup label="Contacto" htmlFor="customerName" required>
              <Input
                id="customerName"
                placeholder="Nombre y apellido"
                value={form.customerName}
                onChange={updateField("customerName")}
                required
                disabled={isSubmitting}
              />
            </FieldGroup>

            <FieldGroup label="Teléfono" htmlFor="customerPhone" required hint="Con código de área">
              <Input
                id="customerPhone"
                type="tel"
                placeholder="+54 11 1234-5678"
                value={form.customerPhone}
                onChange={updateField("customerPhone")}
                required
                disabled={isSubmitting}
              />
            </FieldGroup>

            <FieldGroup label="Email" htmlFor="customerEmail" required>
              <Input
                id="customerEmail"
                type="email"
                placeholder="compras@empresa.com"
                value={form.customerEmail}
                onChange={updateField("customerEmail")}
                required
                disabled={isSubmitting}
              />
            </FieldGroup>

            <FieldGroup label="CUIT" htmlFor="taxId" hint="Opcional">
              <Input
                id="taxId"
                placeholder="20-12345678-9"
                value={form.taxId}
                onChange={updateField("taxId")}
                disabled={isSubmitting}
              />
            </FieldGroup>

            <FieldGroup label="Ciudad de entrega" htmlFor="deliveryCity" required className="md:col-span-2">
              <Input
                id="deliveryCity"
                placeholder="Localidad y provincia"
                value={form.deliveryCity}
                onChange={updateField("deliveryCity")}
                required
                disabled={isSubmitting}
              />
            </FieldGroup>

            <FieldGroup label="Notas" htmlFor="notes" hint="Opcional" className="md:col-span-2">
              <Textarea
                id="notes"
                value={form.notes}
                onChange={updateField("notes")}
                placeholder="Horarios de recepción, reemplazos aceptados, indicaciones de entrega..."
                className="min-h-20 resize-none"
                disabled={isSubmitting}
              />
            </FieldGroup>

            <div className="md:col-span-2">
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <>
                    <HugeiconsIcon icon={Loading01Icon} size={16} strokeWidth={2} className="animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={WhatsappBusinessIcon} size={16} strokeWidth={2} />
                    Confirmar pedido
                  </>
                )}
              </Button>
              {!isFormValid && form.customerCompany.length > 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <HugeiconsIcon icon={Alert01Icon} size={12} strokeWidth={2} />
                  Completá todos los campos obligatorios para continuar.
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resumen</CardTitle>
              <span className="text-xs tabular-nums text-muted-foreground">
                {cart.itemCount} {cart.itemCount === 1 ? "producto" : "productos"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-2.5">
                {/* Mini thumbnail */}
                <div className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted/40">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="image-placeholder h-full w-full">
                      <HugeiconsIcon icon={Image01Icon} size={12} strokeWidth={1.4} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">x{item.quantity}</p>
                </div>
                <p className="shrink-0 text-sm tabular-nums">
                  {formatCurrency((item.salePriceCents ?? item.unitPriceCents) * item.quantity)}
                </p>
              </div>
            ))}

            <div className="space-y-1 border-t border-border/30 pt-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(cart.subtotalCents)}</span>
              </div>
              {cart.discountCents > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ahorro</span>
                  <span className="tabular-nums text-emerald-600">
                    &minus;{formatCurrency(cart.discountCents)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border/30 pt-2 font-medium">
                <span>Total</span>
                <span className="font-heading text-lg tabular-nums">
                  {formatCurrency(cart.totalCents)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/[0.04] p-3.5">
          <HugeiconsIcon
            icon={Shield01Icon}
            size={16}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-primary"
          />
          <div>
            <p className="text-sm font-medium">Sin pago online</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Las condiciones se confirman por WhatsApp. El pedido queda registrado en el panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
