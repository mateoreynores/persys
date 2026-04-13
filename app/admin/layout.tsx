import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isClerkConfigured } from "@/lib/env";
import { requireAdminUser } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isClerkConfigured()) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Alert className="rounded-[2rem]">
          <AlertTitle>Clerk no está configurado</AlertTitle>
          <AlertDescription>
            El panel administrativo queda listo con protección por Clerk, pero necesitás cargar las
            credenciales en el entorno para habilitarlo.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  await requireAdminUser();

  return <>{children}</>;
}
