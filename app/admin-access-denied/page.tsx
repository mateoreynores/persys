import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Shield01Icon } from "@hugeicons/core-free-icons";

import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminAccessDeniedPage() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center px-4 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100">
          <HugeiconsIcon icon={Shield01Icon} size={24} strokeWidth={1.5} className="text-amber-700" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-medium">Acceso denegado</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tu sesión está activa pero este usuario no tiene permisos administrativos.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Configurá{" "}
            <code className="rounded bg-muted px-1 text-xs">CLERK_ADMIN_EMAILS</code> o{" "}
            <code className="rounded bg-muted px-1 text-xs">CLERK_ADMIN_USER_IDS</code> y redeployá.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link href="/" className={cn(buttonVariants({ size: "sm" }))}>
            Volver al inicio
          </Link>
          <Link href="/shop" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Ir al catálogo
          </Link>
          <AdminUserMenu />
        </div>
      </div>
    </main>
  );
}
