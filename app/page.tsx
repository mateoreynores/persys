import { HugeiconsIcon } from "@hugeicons/react";
import {
  DeliveryTruck01Icon,
  PackageIcon,
  Store01Icon,
  WhatsappBusinessIcon,
} from "@hugeicons/core-free-icons";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { getBusinessWhatsAppNumber } from "@/lib/env";

export default function Home() {
  const whatsappNumber = getBusinessWhatsAppNumber();
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : undefined;

  return (
    <div className="min-h-screen">
      <SiteHeader showCatalogLink={false} showCheckoutCta={false} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="hero-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/70 to-background" />

          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Distribución mayorista
              </p>

              <h1 className="mt-4 text-3xl font-semibold leading-[1.15] text-balance sm:text-4xl lg:text-5xl">
                Productos para tu comercio, directo a tu negocio.
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Persys es una distribuidora mayorista que abastece supermercados, almacenes
                y comercios minoristas con productos de consumo masivo. Trabajamos con
                atención personalizada y entregas coordinadas.
              </p>

              {whatsappHref && (
                <div className="mt-8 flex justify-center">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <HugeiconsIcon icon={WhatsappBusinessIcon} size={18} strokeWidth={2} />
                    Contactanos por WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Qué hacemos */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-lg font-medium">Qué hacemos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Conectamos marcas y productos con comercios que los necesitan.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {([
              {
                icon: PackageIcon,
                title: "Productos de consumo masivo",
                text: "Trabajamos con un catálogo amplio de productos para góndola: alimentos, bebidas, limpieza, higiene y más.",
              },
              {
                icon: Store01Icon,
                title: "Enfocados en comercios",
                text: "Nuestros clientes son supermercados, almacenes, autoservicios y otros comercios minoristas que necesitan abastecimiento confiable.",
              },
              {
                icon: DeliveryTruck01Icon,
                title: "Entrega y seguimiento",
                text: "Coordinamos la entrega de cada pedido y acompañamos el proceso de principio a fin para que tu negocio no se quede sin stock.",
              },
            ] as const).map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/[0.08]">
                    <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} className="text-primary" />
                  </div>
                  <h3 className="mt-4 text-sm font-medium">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cómo trabajamos */}
        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-medium">Cómo trabajamos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Un proceso simple para que puedas enfocarte en tu negocio.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {([
              { step: "01", title: "Consultá nuestro catálogo", text: "Revisá los productos y precios disponibles para tu zona." },
              { step: "02", title: "Hacé tu pedido", text: "Elegí los productos que necesitás y enviá tu pedido con los datos de tu comercio." },
              { step: "03", title: "Confirmamos por WhatsApp", text: "Nuestro equipo se comunica con vos para confirmar disponibilidad, coordinar la entrega y resolver cualquier consulta." },
            ] as const).map((item) => (
              <div key={item.step} className="rounded-lg border border-border p-5">
                <span className="text-xs font-semibold tabular-nums text-muted-foreground/50">{item.step}</span>
                <h3 className="mt-2 text-sm font-medium">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-muted/40 px-6 py-10 text-center sm:px-12">
            <h2 className="text-xl font-semibold sm:text-2xl">¿Tenés un comercio y necesitás abastecerte?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Escribinos por WhatsApp y te armamos una propuesta a medida para tu negocio.
              Atención directa de lunes a sábados.
            </p>
            {whatsappHref && (
              <div className="mt-6 flex justify-center">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <HugeiconsIcon icon={WhatsappBusinessIcon} size={18} strokeWidth={2} />
                  Escribinos
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter showCatalogLinks={false} />
    </div>
  );
}
