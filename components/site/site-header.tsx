import Link from "next/link";

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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
          compact ? "h-16" : "h-18",
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <span className="text-sm font-semibold">P</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-primary/70 uppercase">
              Persys
            </p>
            <p className="text-sm text-muted-foreground">Mayorista B2B</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {cartSlot}
          <Link
            href="/shop/checkout"
            className={cn(buttonVariants({ variant: "default" }), "hidden sm:inline-flex")}
          >
            Hacer pedido
          </Link>
        </div>
      </div>
    </header>
  );
}
