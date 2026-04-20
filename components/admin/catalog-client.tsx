"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Edit01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { saveCategoryAction, saveProductAction } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, centsToInputValue } from "@/lib/format";
import type { StoreCategory, StoreProduct } from "@/lib/store/types";

type ProductDialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; product: StoreProduct };

type CategoryDialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; category: StoreCategory };

export function CatalogClient({
  categories,
  products,
}: {
  categories: StoreCategory[];
  products: StoreProduct[];
}) {
  const router = useRouter();
  const [productDialog, setProductDialog] = useState<ProductDialogState>({ mode: "closed" });
  const [categoryDialog, setCategoryDialog] = useState<CategoryDialogState>({ mode: "closed" });
  const [isPending, startTransition] = useTransition();

  function handleProductSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await saveProductAction(formData);
        setProductDialog({ mode: "closed" });
        toast.success(
          formData.get("id") ? "Producto actualizado" : "Producto creado",
        );
        router.refresh();
      } catch {
        toast.error("Error al guardar el producto");
      }
    });
  }

  function handleCategorySubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await saveCategoryAction(formData);
        setCategoryDialog({ mode: "closed" });
        toast.success(
          formData.get("id") ? "Categoría actualizada" : "Categoría creada",
        );
        router.refresh();
      } catch {
        toast.error("Error al guardar la categoría");
      }
    });
  }

  const editingProduct = productDialog.mode === "edit" ? productDialog.product : null;
  const editingCategory = categoryDialog.mode === "edit" ? categoryDialog.category : null;

  return (
    <>
      {/* Products section */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>Productos ({products.length})</CardTitle>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setProductDialog({ mode: "create" })}
          >
            <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2} />
            Agregar producto
          </Button>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay productos todavía. Creá el primero.
            </p>
          ) : (
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
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
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
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Editar"
                        onClick={() => setProductDialog({ mode: "edit", product })}
                      >
                        <HugeiconsIcon icon={Edit01Icon} size={14} strokeWidth={2} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Categories section */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>Categorías ({categories.length})</CardTitle>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setCategoryDialog({ mode: "create" })}
          >
            <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2} />
            Agregar categoría
          </Button>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay categorías todavía. Creá la primera.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[16rem] truncate text-sm text-muted-foreground">
                      {category.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "outline"}>
                        {category.isActive ? "Activa" : "Archivada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Editar"
                        onClick={() => setCategoryDialog({ mode: "edit", category })}
                      >
                        <HugeiconsIcon icon={Edit01Icon} size={14} strokeWidth={2} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product dialog (create / edit) */}
      <Dialog
        open={productDialog.mode !== "closed"}
        onOpenChange={(open) => {
          if (!open) setProductDialog({ mode: "closed" });
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? `Editar producto · ${editingProduct.name}` : "Nuevo producto"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Modificá los campos y guardá los cambios."
                : "Completá los datos del producto."}
            </DialogDescription>
          </DialogHeader>
          <form action={handleProductSubmit} className="grid gap-3 md:grid-cols-2">
            {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="dlg-product-category">
                Categoría
              </label>
              <select
                id="dlg-product-category"
                name="categoryId"
                defaultValue={editingProduct?.categoryId ?? ""}
                className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              >
                <option value="">Seleccionar</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="dlg-product-name">
                Nombre
              </label>
              <Input
                id="dlg-product-name"
                name="name"
                defaultValue={editingProduct?.name ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="dlg-product-brand">
                Marca
              </label>
              <Input
                id="dlg-product-brand"
                name="brand"
                defaultValue={editingProduct?.brand ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="dlg-product-description">
                Descripción
              </label>
              <Textarea
                id="dlg-product-description"
                name="description"
                defaultValue={editingProduct?.description ?? ""}
                required
                className="min-h-16 resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                name="imageUrl"
                scope="product"
                defaultValue={editingProduct?.imageUrl}
                required
                label="Imagen del producto"
                aspectClass="aspect-[4/3]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="dlg-product-price">
                Precio
              </label>
              <Input
                id="dlg-product-price"
                name="price"
                placeholder="3240,00"
                defaultValue={editingProduct ? centsToInputValue(editingProduct.priceCents) : ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="dlg-product-sale-price">
                Precio oferta
              </label>
              <Input
                id="dlg-product-sale-price"
                name="salePrice"
                placeholder="2990,00"
                defaultValue={
                  editingProduct ? centsToInputValue(editingProduct.salePriceCents) : ""
                }
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="dlg-product-note">
                Nota de disponibilidad
              </label>
              <Input
                id="dlg-product-note"
                name="availabilityNote"
                defaultValue={editingProduct?.availabilityNote ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="dlg-product-sort">
                Orden
              </label>
              <Input
                id="dlg-product-sort"
                name="sortOrder"
                type="number"
                defaultValue={String(editingProduct?.sortOrder ?? 0)}
              />
            </div>
            <div className="grid gap-2">
              <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={editingProduct?.isFeatured ?? false}
                  className="accent-primary"
                />
                Destacado
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingProduct?.isActive ?? true}
                  className="accent-primary"
                />
                Activo
              </label>
            </div>
            <DialogFooter className="md:col-span-2">
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar producto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category dialog (create / edit) */}
      <Dialog
        open={categoryDialog.mode !== "closed"}
        onOpenChange={(open) => {
          if (!open) setCategoryDialog({ mode: "closed" });
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? `Editar categoría · ${editingCategory.name}`
                : "Nueva categoría"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Modificá los campos y guardá los cambios."
                : "Completá los datos de la categoría."}
            </DialogDescription>
          </DialogHeader>
          <form action={handleCategorySubmit} className="space-y-3">
            {editingCategory && <input type="hidden" name="id" value={editingCategory.id} />}

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="dlg-category-name">
                Nombre
              </label>
              <Input
                id="dlg-category-name"
                name="name"
                defaultValue={editingCategory?.name ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="dlg-category-description">
                Descripción
              </label>
              <Textarea
                id="dlg-category-description"
                name="description"
                defaultValue={editingCategory?.description ?? ""}
                className="min-h-16 resize-none"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="dlg-category-sort">
                  Orden
                </label>
                <Input
                  id="dlg-category-sort"
                  name="sortOrder"
                  type="number"
                  defaultValue={String(editingCategory?.sortOrder ?? 0)}
                />
              </div>
              <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingCategory?.isActive ?? true}
                  className="accent-primary"
                />
                Activa
              </label>
            </div>
            <DialogFooter>
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar categoría"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
