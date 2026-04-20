import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { DiscountTag01Icon, Image01Icon } from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { formatCurrency } from "@/lib/format";
import { normalizeMinimumQuantity } from "@/lib/store/purchase-rules";
import type { StoreProduct } from "@/lib/store/types";

export function ProductCard({ product }: { product: StoreProduct }) {
  const hasImage = Boolean(product.imageUrl);
  const hasSale = Boolean(product.salePriceCents);
  const minimumQuantity = normalizeMinimumQuantity(product.minimumQuantity);

  return (
    <Card className="group/card flex h-full flex-col overflow-hidden py-0 transition-shadow duration-300 hover:shadow-md hover:shadow-black/[0.04]">
      {/* Image / placeholder */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
        {hasImage ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 will-change-transform group-hover/card:scale-[1.03]"
          />
        ) : (
          <div className="image-placeholder h-full w-full">
            <HugeiconsIcon icon={Image01Icon} size={40} strokeWidth={1.2} />
          </div>
        )}

        {/* Badges */}
        {(hasSale || product.categoryName) && (
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/40 to-transparent p-3 pt-8">
            <span className="text-[11px] font-medium text-white/90">
              {product.categoryName}
            </span>
            {hasSale && (
              <Badge className="gap-1 text-[10px]">
                <HugeiconsIcon icon={DiscountTag01Icon} size={11} strokeWidth={2} />
                Oferta
              </Badge>
            )}
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {product.brand}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>

        {/* Description */}
        {product.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        {/* Availability */}
        {product.availabilityNote && (
          <div className="rounded-md bg-primary/[0.05] px-2.5 py-1.5 text-[11px] leading-snug text-foreground/70">
            {product.availabilityNote}
          </div>
        )}
        {minimumQuantity && (
          <div className="rounded-md bg-amber-500/10 px-2.5 py-1.5 text-[11px] leading-snug text-amber-900/80">
            Compra minima: {minimumQuantity} {minimumQuantity === 1 ? "unidad" : "unidades"}
          </div>
        )}

        <div className="mt-auto" />

        {/* Pricing */}
        <div className="flex items-end justify-between gap-3 border-t border-border/30 pt-3">
          <div>
            {hasSale && (
              <p className="text-[11px] tabular-nums text-muted-foreground line-through">
                {formatCurrency(product.priceCents)}
              </p>
            )}
            <p className="font-heading text-xl font-semibold tabular-nums leading-none">
              {formatCurrency(product.salePriceCents ?? product.priceCents)}
            </p>
          </div>
          <p className="pb-0.5 text-[10px] text-muted-foreground">por pack</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <AddToCartButton
          productId={product.id}
          name={product.name}
          brand={product.brand}
          imageUrl={product.imageUrl}
          unitPriceCents={product.priceCents}
          salePriceCents={product.salePriceCents}
          minimumQuantity={product.minimumQuantity}
        />
      </CardFooter>
    </Card>
  );
}
