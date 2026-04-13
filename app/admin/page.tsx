import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { getDashboardStats, getRuntimeModeLabel } from "@/lib/store/repository";

export default async function AdminDashboardPage() {
  const [stats, runtimeMode] = await Promise.all([
    getDashboardStats(),
    Promise.resolve(getRuntimeModeLabel()),
  ]);

  return (
    <AdminShell title="Dashboard comercial" eyebrow={`Panel administrativo · ${runtimeMode}`}>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Productos activos", value: stats.activeProducts.toString() },
          { label: "Categorías activas", value: stats.activeCategories.toString() },
          { label: "Pedidos pendientes", value: stats.pendingOrders.toString() },
          { label: "Volumen gestionado", value: formatCurrency(stats.revenueCents) },
        ].map((item) => (
          <Card key={item.label} className="rounded-[2rem]">
            <CardContent className="space-y-3 p-6">
              <Badge variant="secondary">{item.label}</Badge>
              <p className="text-4xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Cómo opera este flujo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>1. El cliente navega el catálogo, arma el carrito y deja sus datos comerciales.</p>
            <p>2. El checkout recalcula precios y promociones desde servidor.</p>
            <p>3. El pedido se guarda con estado `pending_whatsapp`.</p>
            <p>4. El cliente confirma la conversación comercial desde WhatsApp.</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Incluido en v1</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Catálogo editable con ofertas por producto.</p>
            <p>Checkout invitado orientado a compra mayorista.</p>
            <p>Sin pagos online, sin stock decremental y sin pricing por cliente.</p>
            <p>Protección del panel administrativo mediante Clerk.</p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
