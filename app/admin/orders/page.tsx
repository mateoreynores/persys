import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

import { AdminShell } from "@/components/admin/admin-shell";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { listOrders } from "@/lib/store/repository";
import { orderStatusValues } from "@/db/schema";
import { cn } from "@/lib/utils";

type SearchParamValue = string | string[] | undefined;

function getSingleValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

const statusLabels: Record<string, string> = {
  pending_whatsapp: "Pendiente WA",
  submitted: "Enviado",
  confirmed: "Confirmado",
  fulfilled: "Cumplido",
  cancelled: "Cancelado",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchParamValue>>;
}) {
  const params = await searchParams;
  const status = getSingleValue(params.status) ?? "";
  const orders = await listOrders(status || undefined);

  return (
    <AdminShell title="Pedidos">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Listado de pedidos ({orders.length})</CardTitle>
            <form action="/admin/orders" className="flex items-center gap-2">
              <select
                name="status"
                defaultValue={status}
                className="h-8 rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Todos los estados</option>
                {orderStatusValues.map((value) => (
                  <option key={value} value={value}>
                    {statusLabels[value] ?? value}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="outline" size="xs">Filtrar</Button>
              {status && (
                <Link
                  href="/admin/orders"
                  className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "gap-1")}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
                  Limpiar
                </Link>
              )}
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay pedidos{status ? ` con estado "${statusLabels[status] ?? status}"` : ""}.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Actualizar</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{order.customerCompany}</p>
                        <p className="text-xs text-muted-foreground">{order.customerName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(order.totalCents)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "cancelled" ? "destructive" : "default"}>
                        {statusLabels[order.status] ?? order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <form action={updateOrderStatusAction} className="flex items-center gap-1.5">
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="returnTo" value="/admin/orders" />
                        <select
                          name="status"
                          defaultValue={order.status}
                          className="h-7 rounded-md border border-input bg-transparent px-1.5 text-xs outline-none"
                        >
                          {orderStatusValues.map((value) => (
                            <option key={value} value={value}>
                              {statusLabels[value] ?? value}
                            </option>
                          ))}
                        </select>
                        <Button type="submit" variant="outline" size="xs">OK</Button>
                      </form>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon-xs" }))}
                        title="Ver detalle"
                      >
                        <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
