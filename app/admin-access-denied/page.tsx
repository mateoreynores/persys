import Link from "next/link";

import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminAccessDeniedPage() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-4xl items-center px-4 py-16 sm:px-6">
      <Alert className="rounded-[2rem] border-amber-300 bg-amber-50 p-8 text-amber-950">
        <AlertTitle>Acceso administrativo denegado</AlertTitle>
        <AlertDescription className="mt-3 space-y-4 text-sm leading-7">
          <p>
            Tu sesión de Clerk está activa, pero este usuario no figura dentro del allowlist
            administrativo.
          </p>
          <p>
            Si querés habilitar acceso por configuración, definí `CLERK_ADMIN_EMAILS` o
            `CLERK_ADMIN_USER_IDS` y redeployá la app.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
              Volver al inicio
            </Link>
            <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }))}>
              Ir al catálogo
            </Link>
            <AdminUserMenu />
          </div>
        </AlertDescription>
      </Alert>
    </main>
  );
}
