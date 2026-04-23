import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  Shield01Icon,
  ShoppingCart01Icon,
  Store01Icon,
  WhatsappBusinessIcon,
} from "@hugeicons/core-free-icons";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { getRuntimeModeLabel } from "@/lib/store/repository";

export default function Home() {
  const runtimeMode = getRuntimeModeLabel();

  return (
    <div className="min-h-screen">
      <SiteHeader showCatalogLink={false} showCheckoutCta={false} />

      <main>
        <section className="relative overflow-hidden">
          <div className="hero-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/70 to-background" />

          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {runtimeMode} &middot; Operación comercial verificada
              </p>

              <h1 className="mt-4 text-3xl font-semibold leading-[1.15] text-balance sm:text-4xl lg:text-5xl">
                Marca mayorista lista para verificación en Meta y WhatsApp.
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Persys comunica una identidad comercial clara, atención empresarial por
                WhatsApp Business y una presencia web pensada para respaldo documental,
                confianza y cumplimiento operativo.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-lg font-medium">Señales públicas de confianza</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            La home ya no expone el catálogo ni el acceso administrativo y prioriza una
            presentación institucional del negocio.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {([
              {
                icon: Store01Icon,
                title: "Identidad comercial consistente",
                text: "Persys se presenta como distribuidora mayorista para comercios, con mensaje corporativo y foco B2B claro.",
              },
              {
                icon: Shield01Icon,
                title: "Comercio acotado y legítimo",
                text: "La narrativa pública evita categorías ambiguas y sostiene una operación ligada a bienes físicos y relaciones comerciales verificables.",
              },
              {
                icon: WhatsappBusinessIcon,
                title: "Atención por WhatsApp Business",
                text: "El canal de mensajería queda posicionado como soporte y confirmación comercial, no como acceso público irrestricto.",
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

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {([
              {
                icon: ShoppingCart01Icon,
                title: "Pedidos con contexto comercial",
                text: "El flujo prioriza datos de empresa, contacto y seguimiento para sostener validaciones manuales y operación responsable.",
              },
              {
                icon: Analytics01Icon,
                title: "Trazabilidad operativa",
                text: "La experiencia se ordena para revisión interna y consistencia entre sitio, negocio, mensajería y documentación empresarial.",
              },
              {
                icon: Shield01Icon,
                title: "Acceso administrativo restringido",
                text: "La administración no se enlaza desde la home y queda reservada a ingreso directo con autenticación previa.",
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

        <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-muted/40 px-6 py-10 text-center sm:px-12">
            <h2 className="text-xl font-semibold sm:text-2xl">Acceso administrativo por invitación</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              El entorno privado queda reservado para verificación de negocio y revisión interna.
              No se promueve desde la navegación pública y requiere autenticación para entrar de forma directa.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter showCatalogLinks={false} />
    </div>
  );
}
