import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  WhatsappBusinessIcon,
  PackageDeliveredIcon,
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";

import { CopyMessageButton } from "@/components/shop/copy-message-button";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getOrderById } from "@/lib/store/repository";
import { cn } from "@/lib/utils";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    return (
      <div className="min-h-screen">
        <SiteHeader compact />
        <main className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4 text-center">
          <div className="space-y-3">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted/60">
              <HugeiconsIcon
                icon={Alert01Icon}
                size={28}
                strokeWidth={1.5}
                className="text-muted-foreground/50"
              />
            </div>
            <h1 className="font-heading text-lg font-medium">No encontramos el pedido</h1>
            <p className="text-sm text-muted-foreground">
              Verificá el enlace o volvé al catálogo para generar un nuevo pedido.
            </p>
            <Link href="/shop" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Ir al catálogo
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader compact />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Success banner */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} strokeWidth={2} className="shrink-0 text-emerald-600" />
          <p className="text-sm text-emerald-900">
            Pedido registrado. Confirmá por WhatsApp para continuar.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Order details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary" className="text-[10px]">Registrado</Badge>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </span>
              </div>
              <CardTitle className="mt-1 text-xl">{order.orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {order.customerCompany}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Line items */}
              <div className="space-y-1.5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.productSnapshotName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.productSnapshotSku} &middot; x{item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm tabular-nums">
                      {formatCurrency(item.lineTotalCents)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 border-t border-border/30 pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(order.subtotalCents)}</span>
                </div>
                {order.discountCents > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Descuento</span>
                    <span className="tabular-nums text-emerald-600">
                      &minus;{formatCurrency(order.discountCents)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border/30 pt-2 font-medium">
                  <span>Total</span>
                  <span className="font-heading text-lg tabular-nums">
                    {formatCurrency(order.totalCents)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right sidebar */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Next step CTA */}
            <Card className="border-foreground/10 bg-foreground text-background">
              <CardContent className="space-y-4 p-5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-background/10">
                  <HugeiconsIcon icon={PackageDeliveredIcon} size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="font-heading text-base font-medium">Siguiente paso</p>
                  <p className="mt-1 text-sm leading-relaxed text-background/60">
                    Confirmá el pedido con el equipo comercial por WhatsApp para coordinar
                    disponibilidad y entrega.
                  </p>
                </div>
                {order.whatsAppUrl ? (
                  <a
                    href={order.whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "w-full gap-2",
                    )}
                  >
                    <HugeiconsIcon icon={WhatsappBusinessIcon} size={18} strokeWidth={2} />
                    Abrir WhatsApp
                  </a>
                ) : (
                  <div className="rounded-lg bg-background/10 p-3 text-sm">
                    <p className="font-medium">Falta configurar WhatsApp</p>
                    <p className="mt-1 text-xs text-background/50">
                      El pedido quedó guardado. Configurá <code className="text-background/70">BUSINESS_WHATSAPP_NUMBER</code> para habilitar el botón.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prepared message */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm">Mensaje preparado</CardTitle>
                  <CopyMessageButton text={order.whatsAppMessage ?? ""} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <pre className="max-h-36 overflow-y-auto rounded-lg bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {order.whatsAppMessage}
                </pre>
                <Link
                  href="/shop"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full gap-1.5")}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
                  Volver al catálogo
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
