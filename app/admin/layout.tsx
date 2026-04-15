import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon } from "@hugeicons/core-free-icons";

import { buttonVariants } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/env";
import { requireAdminUser } from "@/lib/admin";
import { cn } from "@/lib/utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isClerkConfigured()) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4 text-center">
        <div className="space-y-3">
          <HugeiconsIcon
            icon={Alert01Icon}
            size={36}
            strokeWidth={1.5}
            className="mx-auto text-muted-foreground/50"
          />
          <h1 className="font-heading text-lg font-medium">Clerk no está configurado</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            El panel administrativo necesita las credenciales de Clerk para habilitarse.
            Cargá las variables de entorno y redeployá.
          </p>
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  await requireAdminUser();

  return <>{children}</>;
}
