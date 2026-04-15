import { notFound } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { AdminShell } from "@/components/admin/admin-shell";
import { saveCategoryAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCategoryById } from "@/lib/store/repository";
import { cn } from "@/lib/utils";

export default async function AdminCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <AdminShell title={`Editar categoría · ${category.name}`}>
      <Link
        href="/admin/catalog"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4 gap-1 text-muted-foreground")}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
        Volver al catálogo
      </Link>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Configuración de categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveCategoryAction} className="space-y-3">
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="returnTo" value={`/admin/catalog/categories/${category.id}`} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="name">Nombre</label>
              <Input id="name" name="name" defaultValue={category.name} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="description">Descripción</label>
              <Textarea id="description" name="description" defaultValue={category.description ?? ""} className="min-h-16 resize-none" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="sortOrder">Orden</label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={String(category.sortOrder)} />
              </div>
              <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked={category.isActive} className="accent-primary" />
                Activa
              </label>
            </div>
            <Button type="submit" size="sm">Guardar cambios</Button>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
