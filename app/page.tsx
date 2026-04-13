import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, ChartNoAxesColumn, MessageCircleMore, Store } from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
      <main className="flex-1">
        <section className="hero-grid overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="space-y-8">
              <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs uppercase">
                {runtimeMode} · shop B2B + admin
              </Badge>
              <div className="space-y-6">
                <h1 className="max-w-4xl text-5xl font-semibold text-balance sm:text-6xl lg:text-7xl">
                  Distribución mayorista con pedido listo para WhatsApp y control interno.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Persys ahora combina landing, catálogo comercial, carrito editable y un panel para
                  gestionar productos, descuentos de oferta y pedidos sin sumar complejidad de pago.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className={cn(buttonVariants({ variant: "default", size: "lg" }))}>
                  Ir al catálogo
                  <ArrowRight />
                </Link>
                <Link href="/admin" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                  Abrir panel
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: "+2.000", label: "productos listos para operar" },
                  { value: "B2B", label: "checkout enfocado en compras mayoristas" },
                  { value: "WA", label: "confirmación comercial desde WhatsApp" },
                ].map((item) => (
                  <div key={item.label} className="surface-panel p-5">
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel relative overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(69,96,198,0.14),_transparent_32%)]" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <Badge>Operación conectada</Badge>
                  <span className="text-xs text-muted-foreground">Sin pasarela de pago</span>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      icon: Store,
                      title: "Shop comercial",
                      text: "Catálogo filtrable con precios visibles, destacados y carrito persistente.",
                    },
                    {
                      icon: MessageCircleMore,
                      title: "Checkout híbrido",
                      text: "La orden se registra y luego continúa por WhatsApp con el resumen listo.",
                    },
                    {
                      icon: ChartNoAxesColumn,
                      title: "Panel operativo",
                      text: "Pedidos y catálogo administrados desde una sola interfaz protegida.",
                    },
                  ].map((item) => (
                    <Card key={item.title} className="rounded-[1.5rem] border-border/60 bg-background/85">
                      <CardContent className="flex gap-4 p-5">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <item.icon className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <Badge variant="secondary">Muestras del catálogo</Badge>
              <h2 className="mt-4 text-3xl font-semibold">Productos destacados listos para vender</h2>
            </div>
            <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }), "hidden sm:inline-flex")}>
              Ver catálogo completo
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="rounded-[2rem] overflow-hidden">
                <div className="relative h-52 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary/70">{product.categoryName}</p>
                    <CardTitle className="mt-2 text-xl">{product.name}</CardTitle>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.salePriceCents ? (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.priceCents)}
                        </p>
                      ) : null}
                      <p className="text-2xl font-semibold">
                        {formatCurrency(product.salePriceCents ?? product.priceCents)}
                      </p>
                    </div>
                    <Link href="/shop" className={cn(buttonVariants({ variant: "default" }))}>
                      Comprar
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Pensado para compras B2B",
                text: "Empresa, contacto, CUIT, ciudad de entrega y notas quedan asociados al pedido.",
              },
              {
                icon: MessageCircleMore,
                title: "WhatsApp como último paso",
                text: "El cliente no paga online: confirma comercialmente por mensaje, con el pedido ya registrado.",
              },
              {
                icon: ChartNoAxesColumn,
                title: "Gestión comercial interna",
                text: "Pedidos con estados, descuentos por oferta y catálogo editable desde admin.",
              },
            ].map((item) => (
              <Card key={item.title} className="rounded-[2rem]">
                <CardContent className="space-y-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
