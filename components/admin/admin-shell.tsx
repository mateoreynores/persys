import Link from "next/link";

import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminShell({
  children,
  title,
  eyebrow = "Panel administrativo",
}: {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 rounded-[2rem] border border-border bg-background p-6 shadow-xl shadow-black/5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="secondary">{eyebrow}</Badge>
            <h1 className="mt-3 font-heading text-3xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gestión de catálogo, pedidos y operación comercial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <Link href="/admin" className={cn(buttonVariants({ variant: "outline" }))}>
                Dashboard
              </Link>
              <Link href="/admin/catalog" className={cn(buttonVariants({ variant: "outline" }))}>
                Catálogo
              </Link>
              <Link href="/admin/orders" className={cn(buttonVariants({ variant: "outline" }))}>
                Pedidos
              </Link>
              <Link href="/shop" className={cn(buttonVariants({ variant: "default" }))}>
                Ver shop
              </Link>
            </div>
            <AdminUserMenu />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
