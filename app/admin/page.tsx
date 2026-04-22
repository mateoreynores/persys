import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Package01Icon,
  ShoppingCart01Icon,
  Analytics01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getDashboardStats, listOrders, getRuntimeModeLabel } from "@/lib/store/repository";
import { cn } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  pending_whatsapp: "Pendiente WA",
  submitted: "Enviado",
  confirmed: "Confirmado",
  fulfilled: "Cumplido",
  cancelled: "Cancelado",
};

export default async function AdminDashboardPage() {
  const [stats, orders, runtimeMode] = await Promise.all([
    getDashboardStats(),
    listOrders(),
    Promise.resolve(getRuntimeModeLabel()),
  ]);

  const recentOrders = orders.slice(0, 5);
  const pendingOrders = orders.filter(
    (o) => o.status === "pending_whatsapp" || o.status === "submitted",
  );

  return (
    <AdminShell title="Dashboard">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Productos activos",
            value: stats.activeProducts.toString(),
            icon: Package01Icon,
            href: "/admin/catalog",
          },
          {
            label: "Categorías",
            value: stats.activeCategories.toString(),
            icon: Layers01Icon,
            href: "/admin/catalog",
          },
          {
            label: "Pedidos pendientes",
            value: stats.pendingOrders.toString(),
            icon: Clock01Icon,
            href: "/admin/orders?status=pending_whatsapp",
            highlight: stats.pendingOrders > 0,
          },
          {
            label: "Volumen total",
            value: formatCurrency(stats.revenueCents),
            icon: Analytics01Icon,
            href: "/admin/orders",
          },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="group">
            <Card className="transition-shadow group-hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg",
                    "highlight" in item && item.highlight
                      ? "bg-secondary/10 text-secondary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <HugeiconsIcon icon={item.icon} size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-heading text-xl font-semibold tabular-nums leading-tight">
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <HugeiconsIcon
                icon={ShoppingCart01Icon}
                size={14}
                strokeWidth={2}
                className="text-muted-foreground"
              />
              Pedidos recientes
            </CardTitle>
            <Link
              href="/admin/orders"
              className={cn(
                buttonVariants({ variant: "ghost", size: "xs" }),
                "gap-1 text-xs text-muted-foreground",
              )}
            >
              Ver todos
              <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Todavía no hay pedidos.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{order.orderNumber}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{order.customerCompany}</TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {formatCurrency(order.totalCents)}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          aria-label={`Ver pedido ${order.orderNumber}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon-xs" }),
                          )}
                        >
                          <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Sidebar: Pending attention + quick links */}
        <div className="space-y-4">
          {/* Pending attention */}
          {pendingOrders.length > 0 && (
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-secondary" />
                  </span>
                  Requieren atención
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingOrders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{order.customerCompany}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {order.orderNumber} &middot; {order.items.length} producto
                        {order.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium tabular-nums">
                      {formatCurrency(order.totalCents)}
                    </span>
                  </Link>
                ))}
                {pendingOrders.length > 3 && (
                  <Link
                    href="/admin/orders?status=pending_whatsapp"
                    className="block text-center text-xs text-muted-foreground hover:text-foreground"
                  >
                    +{pendingOrders.length - 3} más
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Accesos rápidos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link
                href="/admin/catalog"
                className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                  <HugeiconsIcon
                    icon={Package01Icon}
                    size={14}
                    strokeWidth={2}
                    className="text-primary"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Gestionar catálogo</p>
                  <p className="text-[11px] text-muted-foreground">
                    Productos, categorías y precios
                  </p>
                </div>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                  <HugeiconsIcon
                    icon={ShoppingCart01Icon}
                    size={14}
                    strokeWidth={2}
                    className="text-primary"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Ver pedidos</p>
                  <p className="text-[11px] text-muted-foreground">
                    Historial y seguimiento
                  </p>
                </div>
              </Link>
              <Link
                href="/shop"
                className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={14}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Abrir tienda</p>
                  <p className="text-[11px] text-muted-foreground">
                    Vista pública del catálogo
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
