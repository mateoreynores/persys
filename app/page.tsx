import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Store01Icon,
  WhatsappBusinessIcon,
  Analytics01Icon,
  Image01Icon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFeaturedLandingProducts, getRuntimeModeLabel } from "@/lib/store/repository";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function Home() {
  const [featuredProducts, runtimeMode] = await Promise.all([
    getFeaturedLandingProducts(),
    Promise.resolve(getRuntimeModeLabel()),
  ]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="hero-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/70 to-background" />

          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {runtimeMode} &middot; Catálogo + Admin
              </p>

              <h1 className="mt-4 text-3xl font-semibold leading-[1.15] text-balance sm:text-4xl lg:text-5xl">
                Pedidos mayoristas, directo a WhatsApp.
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                Catálogo B2B con carrito persistente. Tus clientes arman el pedido,
                vos lo confirmás por WhatsApp. Sin pagos online.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}>
                  Ver catálogo
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
                </Link>
                <Link href="/admin" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                  Panel admin
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-lg font-medium">Cómo funciona</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tres pasos para gestionar pedidos mayoristas.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {([
              {
                icon: Store01Icon,
                title: "Tu cliente navega el catálogo",
                text: "Filtros por categoría, precios visibles, ofertas activas y carrito que se mantiene entre visitas.",
              },
              {
                icon: ShoppingCart01Icon,
                title: "Deja su pedido con datos comerciales",
                text: "Empresa, CUIT, contacto y notas. La orden queda registrada en tu panel al instante.",
              },
              {
                icon: WhatsappBusinessIcon,
                title: "Confirmás por WhatsApp",
                text: "Un mensaje armado con el detalle del pedido. Coordinás disponibilidad y entrega directo.",
              },
            ] as const).map((item, index) => (
              <Card key={item.title} className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/[0.07]">
                      <HugeiconsIcon icon={item.icon} size={16} strokeWidth={2} className="text-primary" />
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-medium">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured products */}
        {featuredProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-lg font-medium">Productos destacados</h2>
              <Link
                href="/shop"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden gap-1 text-muted-foreground sm:inline-flex")}
              >
                Ver todos
                <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2} />
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden py-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="image-placeholder h-full w-full">
                        <HugeiconsIcon icon={Image01Icon} size={36} strokeWidth={1.2} />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                      {product.categoryName}
                    </p>
                    <h3 className="mt-1.5 text-sm font-medium leading-snug">{product.name}</h3>
                    {product.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-end justify-between border-t border-border/30 pt-3">
                      <div>
                        {product.salePriceCents && (
                          <p className="text-[11px] tabular-nums text-muted-foreground line-through">
                            {formatCurrency(product.priceCents)}
                          </p>
                        )}
                        <p className="font-heading text-lg font-semibold tabular-nums">
                          {formatCurrency(product.salePriceCents ?? product.priceCents)}
                        </p>
                      </div>
                      <Link href="/shop" className={cn(buttonVariants({ size: "sm" }), "gap-1")}>
                        Comprar
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-muted/40 px-6 py-10 text-center sm:px-12">
            <h2 className="text-xl font-semibold sm:text-2xl">Empezá a operar hoy</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Cargá tu catálogo, configurá el número de WhatsApp y compartí el link con tus clientes.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}>
                Ver catálogo
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
              </Link>
              <Link href="/admin" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Ir al panel
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
