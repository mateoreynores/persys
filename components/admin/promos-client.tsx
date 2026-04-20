"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Edit01Icon,
  Delete02Icon,
  Search01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import {
  deletePromoBannerAction,
  savePromoBannerAction,
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
import { formatCurrency } from "@/lib/format";
import type { PromoBannerWithProducts, StoreProduct } from "@/lib/store/types";

type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; banner: PromoBannerWithProducts };

export function PromosClient({
  promos,
  products,
  storageReady,
}: {
  promos: PromoBannerWithProducts[];
  products: StoreProduct[];
  storageReady: boolean;
}) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await savePromoBannerAction(formData);
        setDialog({ mode: "closed" });
        toast.success(formData.get("id") ? "Promoción actualizada" : "Promoción creada");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(error instanceof Error ? error.message : "Error al guardar la promoción");
      }
    });
  }

  function handleDelete(bannerId: string, title: string) {
    if (!confirm(`¿Eliminar la promoción "${title}"?`)) return;
    const formData = new FormData();
    formData.set("id", bannerId);
    startTransition(async () => {
      try {
        await deletePromoBannerAction(formData);
        toast.success("Promoción eliminada");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("No se pudo eliminar");
      }
    });
  }

  const editing = dialog.mode === "edit" ? dialog.banner : null;

  return (
    <>
      {!storageReady && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            size={14}
            strokeWidth={2}
            className="mt-0.5 shrink-0"
          />
          <div>
            <p className="font-medium">Storage no configurado</p>
            <p className="mt-0.5 text-amber-700/80 dark:text-amber-400/80">
              Faltan variables R2_* en el entorno. Hasta configurarlas no se pueden subir imágenes.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Promociones ({promos.length})</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Banners del carrusel del shop. Al hacer click, el cliente ve los productos
              seleccionados para esta promo.
            </p>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setDialog({ mode: "create" })}
            disabled={!storageReady}
          >
            <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2} />
            Nueva promoción
          </Button>
        </CardHeader>
        <CardContent>
          {promos.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Todavía no hay promociones. Creá la primera para destacar en el shop.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Imagen</TableHead>
                  <TableHead>Promoción</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {promos.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="relative aspect-[16/9] w-28 overflow-hidden rounded-md border border-border/50 bg-muted/30">
                        {banner.imageUrl && (
                          <Image
                            src={banner.imageUrl}
                            alt={banner.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{banner.title}</p>
                        {banner.subtitle && (
                          <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {banner.products.length}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">{banner.sortOrder}</TableCell>
                    <TableCell>
                      <Badge variant={banner.isActive ? "default" : "outline"}>
                        {banner.isActive ? "Activa" : "Archivada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          title="Editar"
                          onClick={() => setDialog({ mode: "edit", banner })}
                        >
                          <HugeiconsIcon icon={Edit01Icon} size={14} strokeWidth={2} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          title="Eliminar"
                          onClick={() => handleDelete(banner.id, banner.title)}
                          disabled={isPending}
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={2} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialog.mode !== "closed"}
        onOpenChange={(open) => {
          if (!open) setDialog({ mode: "closed" });
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar promoción · ${editing.title}` : "Nueva promoción"}
            </DialogTitle>
            <DialogDescription>
              Subí el banner y elegí los productos que se muestran cuando el cliente hace click.
            </DialogDescription>
          </DialogHeader>
          <PromoForm
            key={editing?.id ?? "new"}
            editing={editing}
            products={products}
            isPending={isPending}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function PromoForm({
  editing,
  products,
  isPending,
  onSubmit,
}: {
  editing: PromoBannerWithProducts | null;
  products: StoreProduct[];
  isPending: boolean;
  onSubmit: (formData: FormData) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(editing?.productIds ?? []),
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((product) =>
      [product.name, product.brand, product.categoryName, product.description]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [products, query]);

  function toggle(productId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }

  return (
    <form action={onSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr]">
      {editing && <input type="hidden" name="id" value={editing.id} />}
      {Array.from(selected).map((productId) => (
        <input key={productId} type="hidden" name="productIds" value={productId} />
      ))}

      <div className="space-y-3 md:col-span-2">
        <ImageUpload
          name="imageUrl"
          keyName="imageKey"
          scope="banner"
          defaultValue={editing?.imageUrl}
          defaultKey={editing?.imageKey}
          required
          label="Banner (PNG, JPG o WebP · recomendado 1920×600)"
          aspectClass="aspect-[16/5]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="dlg-promo-title">
          Título
        </label>
        <Input
          id="dlg-promo-title"
          name="title"
          defaultValue={editing?.title ?? ""}
          placeholder="Liquidación de invierno"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="dlg-promo-cta">
          Texto del botón
        </label>
        <Input
          id="dlg-promo-cta"
          name="ctaLabel"
          defaultValue={editing?.ctaLabel ?? "Ver promoción"}
          placeholder="Ver promoción"
        />
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <label className="text-sm font-medium" htmlFor="dlg-promo-subtitle">
          Subtítulo (opcional)
        </label>
        <Textarea
          id="dlg-promo-subtitle"
          name="subtitle"
          defaultValue={editing?.subtitle ?? ""}
          placeholder="Hasta 30% off en toda la línea industrial"
          className="min-h-14 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="dlg-promo-sort">
          Orden
        </label>
        <Input
          id="dlg-promo-sort"
          name="sortOrder"
          type="number"
          defaultValue={String(editing?.sortOrder ?? 0)}
        />
      </div>

      <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={editing?.isActive ?? true}
          className="accent-primary"
        />
        Activa en el shop
      </label>

      <div className="space-y-2 md:col-span-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Productos relacionados{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ({selected.size} seleccionados)
            </span>
          </label>
          <div className="relative w-48">
            <HugeiconsIcon
              icon={Search01Icon}
              size={13}
              strokeWidth={2}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar producto"
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto rounded-lg border border-border/60">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No hay productos que coincidan.
            </p>
          ) : (
            <ul className="divide-y divide-border/50">
              {filtered.map((product) => {
                const checked = selected.has(product.id);
                return (
                  <li key={product.id}>
                    <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-muted/40">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(product.id)}
                        className="accent-primary"
                      />
                      <div className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted/40">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {product.brand} · {product.categoryName}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {formatCurrency(product.salePriceCents ?? product.priceCents)}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <DialogFooter className="md:col-span-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar promoción"}
        </Button>
      </DialogFooter>
    </form>
  );
}
