import { HugeiconsIcon } from "@hugeicons/react";
import {
  Package01Icon,
  ShoppingCart01Icon,
  Analytics01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { getDashboardStats, getRuntimeModeLabel } from "@/lib/store/repository";

export default async function AdminDashboardPage() {
  const [stats, runtimeMode] = await Promise.all([
    getDashboardStats(),
    Promise.resolve(getRuntimeModeLabel()),
  ]);

  const statCards = [
    {
      label: "Productos activos",
      value: stats.activeProducts.toString(),
      icon: Package01Icon,
    },
    {
      label: "Categorías",
      value: stats.activeCategories.toString(),
      icon: CheckmarkCircle01Icon,
    },
    {
      label: "Pedidos pendientes",
      value: stats.pendingOrders.toString(),
      icon: ShoppingCart01Icon,
    },
    {
      label: "Volumen gestionado",
      value: formatCurrency(stats.revenueCents),
      icon: Analytics01Icon,
    },
  ];

  return (
    <AdminShell title="Dashboard" eyebrow={runtimeMode}>
      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <Card key={item.label} size="sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <HugeiconsIcon icon={item.icon} size={16} strokeWidth={2} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">{item.label}</p>
                <p className="font-heading text-lg font-semibold tabular-nums">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Flujo del pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {[
                "El cliente arma el carrito desde el catálogo y completa datos comerciales.",
                "El checkout recalcula precios y registra la orden en el sistema.",
                "El pedido queda con estado pending_whatsapp hasta confirmar.",
                "El cliente confirma por WhatsApp con el resumen ya armado.",
              ].map((text, index) => (
                <li key={index} className="flex gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  {text}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Incluido en v1</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              {[
                "Catálogo editable con ofertas por producto.",
                "Checkout invitado orientado a compra mayorista.",
                "Sin pagos online, sin stock decremental.",
                "Panel protegido por Clerk.",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    size={14}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-primary-foreground"
                  />
                  {text}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
