import Link from "next/link";

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
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Nueva categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveCategoryAction} className="space-y-4">
              <input type="hidden" name="returnTo" value="/admin/catalog" />
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="category-name">
                  Nombre
                </label>
                <Input id="category-name" name="name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="category-description">
                  Descripción
                </label>
                <Textarea id="category-description" name="description" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="category-sort">
                    Orden
                  </label>
                  <Input id="category-sort" name="sortOrder" type="number" defaultValue="0" />
                </div>
                <label className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm">
                  <input type="checkbox" name="isActive" defaultChecked />
                  Activa
                </label>
              </div>
              <Button type="submit">Guardar categoría</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Nuevo producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveProductAction} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="returnTo" value="/admin/catalog" />
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-category">
                  Categoría
                </label>
                <select
                  id="product-category"
                  name="categoryId"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none"
                  required
                >
                  <option value="">Seleccionar</option>
                  {catalog.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-name">
                  Nombre
                </label>
                <Input id="product-name" name="name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="product-sku">
                  SKU
                </label>
                <Input id="product-sku" name="sku" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="product-brand">
                  Marca
                </label>
                <Input id="product-brand" name="brand" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-description">
                  Descripción
                </label>
                <Textarea id="product-description" name="description" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-image">
                  URL de imagen
                </label>
                <Input id="product-image" name="imageUrl" type="url" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="product-price">
                  Precio
                </label>
                <Input id="product-price" name="price" placeholder="3240,00" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="product-sale-price">
                  Precio oferta
                </label>
                <Input id="product-sale-price" name="salePrice" placeholder="2990,00" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="product-note">
                  Nota de disponibilidad
                </label>
                <Input id="product-note" name="availabilityNote" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="product-sort">
                  Orden
                </label>
                <Input id="product-sort" name="sortOrder" type="number" defaultValue="0" />
              </div>
              <div className="grid gap-2">
                <label className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm">
                  <input type="checkbox" name="isFeatured" />
                  Destacado
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm">
                  <input type="checkbox" name="isActive" defaultChecked />
                  Activo
                </label>
              </div>
              <div className="md:col-span-2">
                <Button type="submit">Guardar producto</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead />
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
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Editar
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalog.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand} · {product.sku}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>
                      <div>
                        {product.salePriceCents ? (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatCurrency(product.priceCents)}
                          </p>
                        ) : null}
                        <p>{formatCurrency(product.salePriceCents ?? product.priceCents)}</p>
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
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Editar
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
