import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Listado de pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/admin/orders" className="mb-6 flex flex-wrap gap-3">
            <select
              name="status"
              defaultValue={status}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none"
            >
              <option value="">Todos los estados</option>
              {orderStatusValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button className={cn(buttonVariants({ variant: "outline" }))}>Filtrar</button>
            <Link href="/admin/orders" className={cn(buttonVariants({ variant: "ghost" }))}>
              Limpiar
            </Link>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Actualizar</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{order.customerCompany}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalCents)}</TableCell>
                  <TableCell>
                    <Badge>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <form action={updateOrderStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="hidden" name="returnTo" value="/admin/orders" />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none"
                      >
                        {orderStatusValues.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                      <button className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                        Guardar
                      </button>
                    </form>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Ver detalle
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
