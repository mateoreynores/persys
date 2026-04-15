import { notFound } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  WhatsappBusinessIcon,
  Building02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

import { AdminShell } from "@/components/admin/admin-shell";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getOrderById } from "@/lib/store/repository";
import { orderStatusValues } from "@/db/schema";
import { cn } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  pending_whatsapp: "Pendiente WA",
  submitted: "Enviado",
  confirmed: "Confirmado",
  fulfilled: "Cumplido",
  cancelled: "Cancelado",
};

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
    <AdminShell title={order.orderNumber}>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={12} strokeWidth={2} />
        Pedidos
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Order items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Productos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.productSnapshotName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.productSnapshotSku ? `${item.productSnapshotSku} · ` : ""}x{item.quantity}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {item.saleUnitPriceCents && (
                    <p className="text-[10px] tabular-nums text-muted-foreground line-through">
                      {formatCurrency(item.lineSubtotalCents)}
                    </p>
                  )}
                  <p className="text-sm tabular-nums">{formatCurrency(item.lineTotalCents)}</p>
                </div>
              </div>
            ))}

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
                <span className="font-heading text-lg tabular-nums">{formatCurrency(order.totalCents)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Customer info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm">
                <HugeiconsIcon icon={Building02Icon} size={14} strokeWidth={2} className="text-muted-foreground" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                <dt className="text-muted-foreground">Empresa</dt>
                <dd className="font-medium">{order.customerCompany}</dd>
                <dt className="text-muted-foreground">Contacto</dt>
                <dd>{order.customerName}</dd>
                <dt className="text-muted-foreground">Teléfono</dt>
                <dd>{order.customerPhone}</dd>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="truncate">{order.customerEmail}</dd>
                <dt className="text-muted-foreground">Ciudad</dt>
                <dd>{order.deliveryCity}</dd>
                {order.taxId && (
                  <>
                    <dt className="text-muted-foreground">CUIT</dt>
                    <dd>{order.taxId}</dd>
                  </>
                )}
              </dl>
              {order.notes && (
                <div className="mt-3 rounded-lg bg-muted/30 p-2.5 text-xs leading-relaxed text-muted-foreground">
                  {order.notes}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm">
                <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={2} className="text-muted-foreground" />
                Estado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    order.status === "cancelled"
                      ? "destructive"
                      : order.status === "pending_whatsapp"
                        ? "secondary"
                        : "default"
                  }
                >
                  {statusLabels[order.status] ?? order.status}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {formatDateTime(order.updatedAt)}
                </span>
              </div>

              <form action={updateOrderStatusAction} className="space-y-2">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="returnTo" value={`/admin/orders/${order.id}`} />
                <select
                  name="status"
                  defaultValue={order.status}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {orderStatusValues.map((value) => (
                    <option key={value} value={value}>
                      {statusLabels[value] ?? value}
                    </option>
                  ))}
                </select>
                <Button type="submit" className="w-full" size="sm">
                  Guardar estado
                </Button>
              </form>

              {order.whatsAppUrl && (
                <a
                  href={order.whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full gap-1.5")}
                >
                  <HugeiconsIcon icon={WhatsappBusinessIcon} size={14} strokeWidth={2} />
                  WhatsApp
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
