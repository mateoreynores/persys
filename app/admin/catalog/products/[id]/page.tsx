import { notFound } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Image01Icon } from "@hugeicons/core-free-icons";

import { AdminShell } from "@/components/admin/admin-shell";
import { saveProductAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { centsToInputValue } from "@/lib/format";
import { getAdminCatalogSnapshot, getProductById } from "@/lib/store/repository";
import { cn } from "@/lib/utils";

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
      <Link
        href="/admin/catalog"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4 gap-1 text-muted-foreground")}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
        Volver al catálogo
      </Link>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Configuración de producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveProductAction} className="grid gap-3 md:grid-cols-2">
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="returnTo" value={`/admin/catalog/products/${product.id}`} />

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="categoryId">Categoría</label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={product.categoryId}
                className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {catalog.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="name">Nombre</label>
              <Input id="name" name="name" defaultValue={product.name} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="sku">SKU</label>
              <Input id="sku" name="sku" defaultValue={product.sku} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="brand">Marca</label>
              <Input id="brand" name="brand" defaultValue={product.brand} required />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="description">Descripción</label>
              <Textarea id="description" name="description" defaultValue={product.description} required className="min-h-16 resize-none" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="imageUrl">
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Image01Icon} size={14} strokeWidth={2} className="text-muted-foreground" />
                  URL de imagen
                </span>
              </label>
              <Input id="imageUrl" name="imageUrl" defaultValue={product.imageUrl} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="price">Precio</label>
              <Input id="price" name="price" defaultValue={centsToInputValue(product.priceCents)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="salePrice">Precio oferta</label>
              <Input id="salePrice" name="salePrice" defaultValue={centsToInputValue(product.salePriceCents)} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="availabilityNote">Nota de disponibilidad</label>
              <Input id="availabilityNote" name="availabilityNote" defaultValue={product.availabilityNote ?? ""} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="sortOrder">Orden</label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={String(product.sortOrder)} />
            </div>
            <div className="grid gap-2">
              <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className="accent-primary" />
                Destacado
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked={product.isActive} className="accent-primary" />
                Activo
              </label>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" size="sm">Guardar cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
