import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "@/components/site/mobile-nav";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/shop", label: "Catálogo" },
];

export function SiteHeader({
  cartSlot,
  compact = false,
  showCatalogLink = true,
  showCheckoutCta = true,
}: {
  cartSlot?: React.ReactNode;
  compact?: boolean;
  showCatalogLink?: boolean;
  showCheckoutCta?: boolean;
}) {
  const visibleLinks = showCatalogLink ? links : links.filter((item) => item.href !== "/shop");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
          compact ? "h-14" : "h-14",
        )}
      >
        <div className="flex items-center gap-2">
          <MobileNav showCatalogLink={showCatalogLink} />
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-[11px] font-bold tracking-tight">P</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">Persys</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-0.5 md:flex">
          {visibleLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition-[background-color,color] duration-150 ease-out hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {cartSlot}
          {showCheckoutCta && (
            <Link
              href="/shop/checkout"
              className={cn(buttonVariants({ size: "sm" }), "hidden gap-1.5 sm:inline-flex")}
            >
              Hacer pedido
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
