import Link from "next/link";
import { MessageCircleMore, PackageCheck } from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
        <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <Alert className="rounded-[2rem]">
            <AlertTitle>No encontramos el pedido</AlertTitle>
            <AlertDescription>
              Verificá el enlace o volvé al catálogo para generar un nuevo pedido.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader compact />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[2rem]">
            <CardHeader>
              <Badge>Pedido registrado</Badge>
              <CardTitle className="mt-4 text-3xl">
                {order.orderNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Creado el {formatDateTime(order.createdAt)} para {order.customerCompany}.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-3xl bg-accent/40 p-4 text-sm leading-6">
                El pedido ya está guardado en el panel. Si el botón de WhatsApp no aparece, igual
                podés copiar el mensaje y enviarlo manualmente.
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.productSnapshotName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.productSnapshotSku} · x{item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.lineTotalCents)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotalCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descuento</span>
                  <span className="text-emerald-600">
                    -{formatCurrency(order.discountCents)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalCents)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[2rem] bg-primary text-primary-foreground">
              <CardContent className="space-y-4 p-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/10">
                  <PackageCheck className="size-6" />
                </div>
                <div>
                  <p className="text-xl font-semibold">Siguiente paso</p>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/85">
                    Confirmá este pedido con el equipo comercial por WhatsApp para coordinar
                    disponibilidad final y entrega.
                  </p>
                </div>
                {order.whatsAppUrl ? (
                  <a
                    href={order.whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full")}
                  >
                    <MessageCircleMore />
                    Abrir WhatsApp
                  </a>
                ) : (
                  <Alert className="bg-primary-foreground/10 text-primary-foreground">
                    <AlertTitle>Falta `BUSINESS_WHATSAPP_NUMBER`</AlertTitle>
                    <AlertDescription>
                      El pedido quedó guardado, pero todavía no hay un número de WhatsApp
                      configurado.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[2rem]">
              <CardHeader>
                <CardTitle>Mensaje preparado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="overflow-x-auto rounded-3xl bg-muted p-4 text-sm whitespace-pre-wrap">
                  {order.whatsAppMessage}
                </pre>
                <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
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
