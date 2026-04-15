import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, Shield01Icon } from "@hugeicons/core-free-icons";

import { buttonVariants } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/env";
import { cn } from "@/lib/utils";

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const accessDenied = getSingleValue(params.denied) === "1";

  if (!isClerkConfigured()) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 text-center">
        <div className="space-y-3">
          <HugeiconsIcon
            icon={Alert01Icon}
            size={36}
            strokeWidth={1.5}
            className="mx-auto text-muted-foreground/50"
          />
          <h1 className="font-heading text-lg font-medium">Clerk no configurado</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Cargá las variables de Clerk para habilitar el acceso al panel.
          </p>
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center gap-5 px-4 py-16 sm:px-6">
      {accessDenied && (
        <div className="flex max-w-sm items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <HugeiconsIcon icon={Shield01Icon} size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-900">Sin acceso al panel</p>
            <p className="mt-0.5 text-xs leading-relaxed text-amber-700">
              Ingresaste correctamente, pero este usuario no está autorizado.
            </p>
          </div>
        </div>
      )}
      <SignIn
        path="/sign-in"
        routing="path"
        forceRedirectUrl="/admin"
        fallbackRedirectUrl="/admin"
        signUpForceRedirectUrl="/admin"
        signUpFallbackRedirectUrl="/admin"
        withSignUp
      />
    </main>
  );
}
