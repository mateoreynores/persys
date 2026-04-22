import Form from "next/form";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  FilterIcon,
  Cancel01Icon,
  ArrowRight01Icon,
  PackageIcon,
} from "@hugeicons/core-free-icons";

import { CartSheet } from "@/components/shop/cart-sheet";
import { ProductCard } from "@/components/shop/product-card";
import { PromoCarousel } from "@/components/shop/promo-carousel";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { listActivePromos } from "@/lib/store/promos";
import {
  getCatalogSnapshot,
  getRuntimeModeLabel,
  getStoreSettings,
} from "@/lib/store/repository";
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
  const [snapshot, promos, runtimeMode, settings] = await Promise.all([
    getCatalogSnapshot({ query, category }),
    listActivePromos(),
    Promise.resolve(getRuntimeModeLabel()),
    getStoreSettings(),
  ]);

  const hasFilters = Boolean(query || category);
  const showPromos = !hasFilters && promos.length > 0;

  return (
    <div className="min-h-screen">
      <SiteHeader
        cartSlot={<CartSheet cartMinimumAmountCents={settings.cartMinimumAmountCents} />}
        compact
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Promo carousel */}
        {showPromos && (
          <div className="mb-8">
            <PromoCarousel promos={promos} />
          </div>
        )}

        {/* Page header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-semibold sm:text-2xl">Catálogo</h1>
                <span className="text-[11px] text-muted-foreground">{runtimeMode}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {snapshot.activeProductCount} productos activos
                {settings.cartMinimumAmountCents > 0
                  ? ` · Pedido minimo ${formatCurrency(settings.cartMinimumAmountCents)}`
                  : ""}
              </p>
            </div>
            <Link
              href="/shop/checkout"
              className={cn(buttonVariants({ size: "sm" }), "hidden gap-1.5 lg:inline-flex")}
            >
              Ir al checkout
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
          {/* Sidebar filters */}
          <aside className="h-fit">
            <div className="surface-panel p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <HugeiconsIcon icon={FilterIcon} size={14} strokeWidth={2} className="text-muted-foreground" />
                Filtros
              </div>

              <Form action="/shop" className="mt-3.5 space-y-3">
                <div className="space-y-1">
                  <label htmlFor="q" className="text-[11px] font-medium text-muted-foreground">
                    Buscar
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={13}
                      strokeWidth={2}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                    />
                    <Input
                      id="q"
                      name="q"
                      defaultValue={query}
                      placeholder="Nombre o marca"
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="category" className="text-[11px] font-medium text-muted-foreground">
                    Categoría
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={category}
                    className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Todas</option>
                    {snapshot.categories.map((item) => (
                      <option key={item.id} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2 pt-0.5">
                  <Button type="submit" size="sm" className="w-full">
                    Aplicar
                  </Button>
                  {hasFilters && (
                    <Link
                      href="/shop"
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full gap-1 text-xs")}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
                      Limpiar filtros
                    </Link>
                  )}
                </div>
              </Form>
            </div>
          </aside>

          {/* Product grid */}
          <div className="space-y-8">
            {/* Featured section */}
            {snapshot.featuredProducts.length > 0 && !hasFilters && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-medium">Destacados</h2>
                  <Badge variant="secondary" className="text-[10px]">
                    {snapshot.featuredProducts.length} oferta{snapshot.featuredProducts.length === 1 ? "" : "s"}
                  </Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {snapshot.featuredProducts.map((product) => (
                    <ProductCard key={`featured-${product.id}`} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Full catalog */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium">
                  {hasFilters ? "Resultados" : "Todo el catálogo"}
                </h2>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {snapshot.products.length} producto{snapshot.products.length === 1 ? "" : "s"}
                </span>
              </div>

              {snapshot.products.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 py-16 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60">
                    <HugeiconsIcon
                      icon={PackageIcon}
                      size={28}
                      strokeWidth={1.2}
                      className="text-muted-foreground/40"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sin resultados</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Probá limpiar la búsqueda o cambiar de categoría.
                    </p>
                  </div>
                  {hasFilters && (
                    <Link href="/shop" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-1")}>
                      Limpiar filtros
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {snapshot.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
