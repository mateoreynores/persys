import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { saveProductAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { centsToInputValue } from "@/lib/format";
import { getAdminCatalogSnapshot, getProductById } from "@/lib/store/repository";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, catalog] = await Promise.all([getProductById(id), getAdminCatalogSnapshot()]);

  if (!product) {
    notFound();
  }

  return (
    <AdminShell title={`Editar producto · ${product.name}`}>
      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Configuración de producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveProductAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="returnTo" value={`/admin/catalog/products/${product.id}`} />
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="categoryId">
                Categoría
              </label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={product.categoryId}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none"
              >
                {catalog.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="name">
                Nombre
              </label>
              <Input id="name" name="name" defaultValue={product.name} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="sku">
                SKU
              </label>
              <Input id="sku" name="sku" defaultValue={product.sku} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="brand">
                Marca
              </label>
              <Input id="brand" name="brand" defaultValue={product.brand} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="description">
                Descripción
              </label>
              <Textarea id="description" name="description" defaultValue={product.description} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="imageUrl">
                URL de imagen
              </label>
              <Input id="imageUrl" name="imageUrl" defaultValue={product.imageUrl} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="price">
                Precio
              </label>
              <Input id="price" name="price" defaultValue={centsToInputValue(product.priceCents)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="salePrice">
                Precio oferta
              </label>
              <Input id="salePrice" name="salePrice" defaultValue={centsToInputValue(product.salePriceCents)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="availabilityNote">
                Nota de disponibilidad
              </label>
              <Input
                id="availabilityNote"
                name="availabilityNote"
                defaultValue={product.availabilityNote ?? ""}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="sortOrder">
                Orden
              </label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={String(product.sortOrder)}
              />
            </div>
            <div className="grid gap-2">
              <label className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm">
                <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} />
                Destacado
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
                Activo
              </label>
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Guardar cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
