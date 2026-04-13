import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getOrderById } from "@/lib/store/repository";
import { orderStatusValues } from "@/db/schema";
import { cn } from "@/lib/utils";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <AdminShell title={`Pedido ${order.orderNumber}`}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Detalle del pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl border border-border p-4">
                <div>
                  <p className="font-medium">{item.productSnapshotName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.productSnapshotSku} · x{item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  {item.saleUnitPriceCents ? (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatCurrency(item.lineSubtotalCents)}
                    </p>
                  ) : null}
                  <p className="font-semibold">{formatCurrency(item.lineTotalCents)}</p>
                </div>
              </div>
            ))}

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
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Empresa:</span> {order.customerCompany}
              </p>
              <p>
                <span className="font-medium">Contacto:</span> {order.customerName}
              </p>
              <p>
                <span className="font-medium">Teléfono:</span> {order.customerPhone}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.customerEmail}
              </p>
              <p>
                <span className="font-medium">Ciudad:</span> {order.deliveryCity}
              </p>
              {order.taxId ? (
                <p>
                  <span className="font-medium">CUIT:</span> {order.taxId}
                </p>
              ) : null}
              {order.notes ? (
                <p className="rounded-2xl bg-muted p-3 text-muted-foreground">{order.notes}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Estado y trazabilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge>{order.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  actualizado el {formatDateTime(order.updatedAt)}
                </span>
              </div>
              <form action={updateOrderStatusAction} className="space-y-3">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="returnTo" value={`/admin/orders/${order.id}`} />
                <select
                  name="status"
                  defaultValue={order.status}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none"
                >
                  {orderStatusValues.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <button className={cn(buttonVariants({ variant: "default" }), "w-full")}>
                  Guardar estado
                </button>
              </form>
              {order.whatsAppUrl ? (
                <a href={order.whatsAppUrl} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                  Abrir WhatsApp
                </a>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
