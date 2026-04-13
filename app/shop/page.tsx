import Form from "next/form";
import Link from "next/link";

import { CartSheet } from "@/components/shop/cart-sheet";
import { ProductCard } from "@/components/shop/product-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCatalogSnapshot, getRuntimeModeLabel } from "@/lib/store/repository";
import { cn } from "@/lib/utils";

type SearchParamValue = string | string[] | undefined;

function getSingleValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchParamValue>>;
}) {
  const params = await searchParams;
  const query = getSingleValue(params.q) ?? "";
  const category = getSingleValue(params.category) ?? "";
  const [snapshot, runtimeMode] = await Promise.all([
    getCatalogSnapshot({ query, category }),
    Promise.resolve(getRuntimeModeLabel()),
  ]);

  return (
    <div className="min-h-screen">
      <SiteHeader cartSlot={<CartSheet />} compact />

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="surface-panel overflow-hidden px-6 py-8 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-4">
              <Badge variant="secondary">{runtimeMode}</Badge>
              <h1 className="text-4xl font-semibold text-balance sm:text-5xl">
                Catálogo B2B para supermercados y compras recurrentes.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                Filtrá por categoría, revisá promociones activas y armá el carrito. El pedido se
                persiste primero y después sigue por WhatsApp con el resumen listo.
              </p>
            </div>
            <Link href="/shop/checkout" className={cn(buttonVariants({ size: "lg" }))}>
              Ir al checkout
            </Link>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <aside className="surface-panel h-fit p-5">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">Buscar y filtrar</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {snapshot.activeProductCount} productos activos en operación.
                </p>
              </div>

              <Form action="/shop" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="q" className="text-sm font-medium">
                    Buscar
                  </label>
                  <Input
                    id="q"
                    name="q"
                    defaultValue={query}
                    placeholder="Nombre, marca o SKU"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoría
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={category}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none"
                  >
                    <option value="">Todas</option>
                    {snapshot.categories.map((item) => (
                      <option key={item.id} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <Button type="submit" className="w-full">
                    Aplicar filtros
                  </Button>
                  <Link
                    href="/shop"
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  >
                    Limpiar
                  </Link>
                </div>
              </Form>

              <div className="rounded-3xl bg-accent/40 p-4 text-sm">
                Las rebajas visibles ya se aplican al total final. No hay cupones ni medios de pago
                online en esta versión.
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            {snapshot.featuredProducts.length > 0 && !query && !category ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold">Productos destacados</h2>
                  <Badge>Ofertas activas</Badge>
                </div>
                <div className="grid gap-6 xl:grid-cols-3">
                  {snapshot.featuredProducts.map((product) => (
                    <ProductCard key={`featured-${product.id}`} product={product} />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold">Todo el catálogo</h2>
                <span className="text-sm text-muted-foreground">
                  {snapshot.products.length} resultado{snapshot.products.length === 1 ? "" : "s"}
                </span>
              </div>

              {snapshot.products.length === 0 ? (
                <Alert className="rounded-[2rem]">
                  <AlertTitle>No encontramos productos con esos filtros</AlertTitle>
                  <AlertDescription>
                    Probá limpiar la búsqueda o cambiar de categoría para ver más resultados.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {snapshot.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
