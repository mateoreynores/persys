import { headers } from "next/headers";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  Package01Icon,
  Shield01Icon,
  Store01Icon,
  WhatsappBusinessIcon,
} from "@hugeicons/core-free-icons";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusinessWhatsAppNumber } from "@/lib/env";
import { getRuntimeModeLabel } from "@/lib/store/repository";

function formatWhatsAppNumber(value: string) {
  if (!value) {
    return "Pendiente de configurar";
  }

  if (value.length < 11) {
    return `+${value}`;
  }

  const country = value.slice(0, value.length - 10);
  const area = value.slice(-10, -6);
  const middle = value.slice(-6, -3);
  const last = value.slice(-3);

  return `+${country} ${area} ${middle} ${last}`.trim();
}

export default async function AdminDashboardPage() {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    "pendiente-de-configurar";
  const protocol =
    headerStore.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const websiteUrl = `${protocol}://${host}`;
  const runtimeMode = getRuntimeModeLabel();
  const whatsappNumber = getBusinessWhatsAppNumber();

  return (
    <AdminShell title="Meta Business Verification" eyebrow="Private">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/70">
          <CardHeader className="gap-4 border-b border-border/60 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Ruta privada</Badge>
              <Badge variant="outline">{runtimeMode}</Badge>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">Persys como marca comercial verificable</CardTitle>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Este espacio reemplaza el panel operativo público y concentra la información
                útil para verificación empresarial en Meta y WhatsApp Business: identidad
                comercial clara, canales consistentes y alcance de venta controlado.
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            {([
              {
                icon: Store01Icon,
                title: "Actividad comercial",
                text: "Persys se presenta como distribuidora mayorista para supermercados, autoservicios y comercios de cercanía.",
              },
              {
                icon: Shield01Icon,
                title: "Alcance permitido",
                text: "La comunicación debe mantenerse en bienes físicos y lícitos, evitando servicios y categorías restringidas o prohibidas por Meta.",
              },
              {
                icon: WhatsappBusinessIcon,
                title: "WhatsApp Business",
                text: `Línea empresarial: ${formatWhatsAppNumber(whatsappNumber)}.`,
              },
              {
                icon: Analytics01Icon,
                title: "Dominio verificable",
                text: `Sitio activo bajo ${websiteUrl}, alineado al portfolio empresarial y útil para comprobación de titularidad.`,
              },
            ] as const).map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/60 bg-background p-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/[0.08]">
                  <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} className="text-primary" />
                </div>
                <h2 className="mt-4 text-sm font-medium">{item.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <HugeiconsIcon icon={Package01Icon} size={15} strokeWidth={1.9} className="text-muted-foreground" />
                Checklist para Meta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                1. Nombre visible, razón social y dominio deben coincidir con la información
                cargada en Meta Business Portfolio.
              </p>
              <p>
                2. El sitio debe describir una operación real, con alcance B2B claro y sin
                promocionar bienes o servicios que generen observaciones de comercio.
              </p>
              <p>
                3. El número de WhatsApp debe pertenecer al negocio y sostener el mismo
                contexto comercial que muestra el dominio.
              </p>
              <p>
                4. El acceso administrativo queda oculto de la navegación pública y solo
                entra por URL directa con autenticación Clerk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <HugeiconsIcon icon={Shield01Icon} size={15} strokeWidth={1.9} className="text-muted-foreground" />
                Evidencia recomendada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Nombre legal del negocio y datos de contacto empresariales.</p>
              <p>Dirección comercial, teléfono y sitio web verificable.</p>
              <p>Documentación societaria o fiscal que respalde la titularidad.</p>
              <p>Descripción clara de productos, soporte y alcance comercial.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
