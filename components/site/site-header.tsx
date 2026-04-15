import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/shop", label: "Catálogo" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader({
  cartSlot,
  compact = false,
}: {
  cartSlot?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-xl backdrop-saturate-150">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
          compact ? "h-14" : "h-14",
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
            <HugeiconsIcon icon={SparklesIcon} size={12} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">Persys</span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

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
