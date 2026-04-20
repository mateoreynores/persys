"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";

import { ProductCard } from "@/components/shop/product-card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { PromoBannerWithProducts } from "@/lib/store/types";

export function PromoSheet({
  promo,
  open,
  onOpenChange,
}: {
  promo: PromoBannerWithProducts | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto data-[side=right]:sm:max-w-2xl"
      >
        {promo && (
          <>
            {/* Banner strip */}
            <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted/30">
              {promo.imageUrl && (
                <Image
                  src={promo.imageUrl}
                  alt={promo.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-foreground shadow-sm backdrop-blur">
                <HugeiconsIcon icon={Megaphone01Icon} size={11} strokeWidth={2} />
                Promoción
              </div>
            </div>

            <SheetHeader className="pb-2">
              <SheetTitle className="text-lg sm:text-xl">{promo.title}</SheetTitle>
              {promo.subtitle && (
                <SheetDescription>{promo.subtitle}</SheetDescription>
              )}
            </SheetHeader>

            <div className="border-t border-border/50 px-4 pb-2 pt-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Productos incluidos</p>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {promo.products.length} producto
                  {promo.products.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {promo.products.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Sin productos asociados.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {promo.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
