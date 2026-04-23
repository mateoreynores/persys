import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader({
  cartSlot,
  compact = false,
}: {
  cartSlot?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
          compact ? "h-14" : "h-14",
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-[11px] font-bold tracking-tight">P</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">Persys</span>
        </Link>

        <div className="flex items-center gap-2">
          {cartSlot}
          <Link
            href="/shop/checkout"
            className={cn(buttonVariants({ size: "sm" }), "hidden gap-1.5 sm:inline-flex")}
          >
            Hacer pedido
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  );
}
