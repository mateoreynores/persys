import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { formatCurrency } from "@/lib/format";
import type { StoreProduct } from "@/lib/store/types";

export function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <Card className="h-full rounded-[2rem] border-border/70 bg-card/90 shadow-lg shadow-black/5">
      <div className="relative h-52 overflow-hidden rounded-t-[2rem]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/65 via-black/10 to-transparent p-4">
          <Badge variant="secondary">{product.categoryName}</Badge>
          {product.salePriceCents ? <Badge>Oferta</Badge> : null}
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-primary/70 uppercase">{product.brand}</p>
            <CardTitle className="mt-1 text-lg">{product.name}</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">{product.sku}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{product.description}</p>
        {product.availabilityNote ? (
          <div className="rounded-2xl bg-accent/40 px-3 py-2 text-xs text-foreground">
            {product.availabilityNote}
          </div>
        ) : null}
        <div className="flex items-end justify-between gap-4">
          <div>
            {product.salePriceCents ? (
              <p className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.priceCents)}
              </p>
            ) : null}
            <p className="font-heading text-3xl font-semibold text-foreground">
              {formatCurrency(product.salePriceCents ?? product.priceCents)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">precio por pack mayorista</p>
        </div>
      </CardContent>

      <CardFooter className="bg-transparent p-4 pt-0">
        <AddToCartButton
          productId={product.id}
          name={product.name}
          sku={product.sku}
          brand={product.brand}
          imageUrl={product.imageUrl}
          unitPriceCents={product.priceCents}
          salePriceCents={product.salePriceCents}
        />
      </CardFooter>
    </Card>
  );
}
