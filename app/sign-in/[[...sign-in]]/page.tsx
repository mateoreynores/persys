import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16 sm:px-6">
        <Alert className="rounded-[2rem]">
          <AlertTitle>Clerk todavía no está configurado</AlertTitle>
          <AlertDescription>
            Cargá `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY` para habilitar el acceso
            al panel administrativo.
          </AlertDescription>
          <div className="mt-4">
            <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
              Volver al inicio
            </Link>
          </div>
        </Alert>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center gap-6 px-4 py-16 sm:px-6">
      {accessDenied ? (
        <Alert className="w-full max-w-xl rounded-[2rem] border-amber-300 bg-amber-50 text-amber-950">
          <AlertTitle>Tu usuario no tiene acceso al panel</AlertTitle>
          <AlertDescription>
            Ingresaste correctamente, pero este panel sólo admite usuarios autorizados. Si querés
            restringir administradores por email o user ID, usá `CLERK_ADMIN_EMAILS` o
            `CLERK_ADMIN_USER_IDS`.
          </AlertDescription>
        </Alert>
      ) : null}
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
