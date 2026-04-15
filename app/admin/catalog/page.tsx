import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit01Icon, Image01Icon } from "@hugeicons/core-free-icons";

import { AdminShell } from "@/components/admin/admin-shell";
import { saveCategoryAction, saveProductAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import { getAdminCatalogSnapshot } from "@/lib/store/repository";
import { cn } from "@/lib/utils";

export default async function AdminCatalogPage() {
  const catalog = await getAdminCatalogSnapshot();

  return (
    <AdminShell title="Catálogo y precios">
      {/* Creation forms */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* New Category */}
        <Card>
          <CardHeader>
            <CardTitle>Nueva categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveCategoryAction} className="space-y-3">
              <input type="hidden" name="returnTo" value="/admin/catalog" />
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="category-name">Nombre</label>
                <Input id="category-name" name="name" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="category-description">Descripción</label>
                <Textarea id="category-description" name="description" className="min-h-16 resize-none" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="category-sort">Orden</label>
                  <Input id="category-sort" name="sortOrder" type="number" defaultValue="0" />
                </div>
                <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                  <input type="checkbox" name="isActive" defaultChecked className="accent-primary" />
                  Activa
                </label>
              </div>
              <Button type="submit" size="sm">Guardar categoría</Button>
            </form>
          </CardContent>
        </Card>

        {/* New Product */}
        <Card>
          <CardHeader>
            <CardTitle>Nuevo producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveProductAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="returnTo" value="/admin/catalog" />
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-category">Categoría</label>
                <select
                  id="product-category"
                  name="categoryId"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  required
                >
                  <option value="">Seleccionar</option>
                  {catalog.categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-name">Nombre</label>
                <Input id="product-name" name="name" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="product-sku">SKU</label>
                <Input id="product-sku" name="sku" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="product-brand">Marca</label>
                <Input id="product-brand" name="brand" required />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-description">Descripción</label>
                <Textarea id="product-description" name="description" required className="min-h-16 resize-none" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-image">
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Image01Icon} size={14} strokeWidth={2} className="text-muted-foreground" />
                    URL de imagen
                  </span>
                </label>
                <Input id="product-image" name="imageUrl" type="url" placeholder="https://..." required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="product-price">Precio</label>
                <Input id="product-price" name="price" placeholder="3240,00" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="product-sale-price">Precio oferta</label>
                <Input id="product-sale-price" name="salePrice" placeholder="2990,00" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-note">Nota de disponibilidad</label>
                <Input id="product-note" name="availabilityNote" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="product-sort">Orden</label>
                <Input id="product-sort" name="sortOrder" type="number" defaultValue="0" />
              </div>
              <div className="grid gap-2">
                <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                  <input type="checkbox" name="isFeatured" className="accent-primary" />
                  Destacado
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                  <input type="checkbox" name="isActive" defaultChecked className="accent-primary" />
                  Activo
                </label>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" size="sm">Guardar producto</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Data tables */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        {/* Categories table */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías ({catalog.categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalog.categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "outline"}>
                        {category.isActive ? "Activa" : "Archivada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/catalog/categories/${category.id}`}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon-xs" }))}
                        title="Editar"
                      >
                        <HugeiconsIcon icon={Edit01Icon} size={14} strokeWidth={2} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Products table */}
        <Card>
          <CardHeader>
            <CardTitle>Productos ({catalog.products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalog.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand} &middot; {product.sku}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{product.categoryName}</TableCell>
                    <TableCell>
                      <div>
                        {product.salePriceCents && (
                          <p className="text-xs tabular-nums text-muted-foreground line-through">
                            {formatCurrency(product.priceCents)}
                          </p>
                        )}
                        <p className="tabular-nums">
                          {formatCurrency(product.salePriceCents ?? product.priceCents)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "outline"}>
                        {product.isActive ? "Activo" : "Archivado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/catalog/products/${product.id}`}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon-xs" }))}
                        title="Editar"
                      >
                        <HugeiconsIcon icon={Edit01Icon} size={14} strokeWidth={2} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
