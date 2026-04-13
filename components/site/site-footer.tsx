import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-[0.24em] text-primary/70 uppercase">
            Persys
          </p>
          <h2 className="font-heading text-2xl font-semibold text-balance">
            Catálogo mayorista, toma de pedidos y gestión comercial en un solo flujo.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            El shop genera el pedido, lo registra para administración y deja la
            confirmación final en WhatsApp, sin sumar complejidad de pagos.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Explorar</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/">Landing</Link>
            <Link href="/shop">Shop B2B</Link>
            <Link href="/shop/checkout">Checkout</Link>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Operación</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/catalog">Catálogo</Link>
            <Link href="/admin/orders">Pedidos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
