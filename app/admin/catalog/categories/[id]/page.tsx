import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { saveCategoryAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCategoryById } from "@/lib/store/repository";

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
      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Configuración de categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveCategoryAction} className="space-y-4">
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="returnTo" value={`/admin/catalog/categories/${category.id}`} />
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Nombre
              </label>
              <Input id="name" name="name" defaultValue={category.name} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="description">
                Descripción
              </label>
              <Textarea id="description" name="description" defaultValue={category.description ?? ""} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="sortOrder">
                  Orden
                </label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={String(category.sortOrder)}
                />
              </div>
              <label className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked={category.isActive} />
                Activa
              </label>
            </div>
            <Button type="submit">Guardar cambios</Button>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
