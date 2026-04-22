"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Edit01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import {
  saveCategoryAction,
  saveProductAction,
  saveStoreSettingsAction,
} from "@/app/admin/actions";
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
import type { StoreCategory, StoreProduct, StoreSettings } from "@/lib/store/types";

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
  settings,
}: {
  categories: StoreCategory[];
  products: StoreProduct[];
  settings: StoreSettings;
}) {
  const router = useRouter();
  const [productDialog, setProductDialog] = useState<ProductDialogState>({ mode: "closed" });
  const [categoryDialog, setCategoryDialog] = useState<CategoryDialogState>({ mode: "closed" });
  const [isPending, startTransition] = useTransition();
  const [isSavingSettings, startSavingSettings] = useTransition();

  function handleSettingsSubmit(formData: FormData) {
    startSavingSettings(async () => {
      try {
        await saveStoreSettingsAction(formData);
        toast.success("Configuracion guardada");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al guardar la configuracion");
      }
    });
  }

  function handleProductSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await saveProductAction(formData);
        setProductDialog({ mode: "closed" });
        toast.success(
          formData.get("id") ? "Producto actualizado" : "Producto creado",
        );
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al guardar el producto");
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
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al guardar la categoria");
      }
    });
  }

  const editingProduct = productDialog.mode === "edit" ? productDialog.product : null;
  const editingCategory = categoryDialog.mode === "edit" ? categoryDialog.category : null;

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Condiciones de compra</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={handleSettingsSubmit}
            className="grid gap-4 md:grid-cols-[minmax(0,20rem)_auto] md:items-end"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="cart-minimum-amount">
                Pedido minimo
              </label>
              <Input
                id="cart-minimum-amount"
                name="cartMinimumAmount"
                placeholder="0,00"
                defaultValue={centsToInputValue(settings.cartMinimumAmountCents)}
              />
              <p className="text-xs text-muted-foreground">
                Monto minimo total para confirmar una compra. Dejalo en blanco o en 0 para no exigir minimo.
              </p>
            </div>
            <div>
              <Button type="submit" size="sm" disabled={isSavingSettings}>
                {isSavingSettings ? "Guardando\u2026" : "Guardar configuracion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
                  <TableHead>Min. compra</TableHead>
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
                    <TableCell className="text-sm text-muted-foreground">
                      {product.minimumQuantity ? `${product.minimumQuantity} u.` : "Sin minimo"}
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
        <DialogContent className="flex max-h-[min(85dvh,880px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
          <div className="shrink-0 border-b border-border/40 px-6 pt-6 pb-4">
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
          </div>
          <form
            action={handleProductSubmit}
            className="flex min-h-0 flex-1 flex-col gap-0"
          >
            {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">
              <div className="grid gap-3 md:grid-cols-2">
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
                    className="mx-auto w-full max-w-56"
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
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="dlg-product-minimum-quantity">
                    Cantidad minima
                  </label>
                  <Input
                    id="dlg-product-minimum-quantity"
                    name="minimumQuantity"
                    type="number"
                    min={0}
                    placeholder="Sin minimo"
                    defaultValue={String(editingProduct?.minimumQuantity ?? "")}
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
              </div>
            </div>
            <div className="shrink-0 border-t border-border/40 bg-popover px-6 py-4">
              <DialogFooter>
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? "Guardando\u2026" : "Guardar producto"}
                </Button>
              </DialogFooter>
            </div>
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
                {isPending ? "Guardando\u2026" : "Guardar categoría"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
