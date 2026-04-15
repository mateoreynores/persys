import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Package01Icon,
  ShoppingCart01Icon,
  Store01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: DashboardSquare01Icon },
  { href: "/admin/catalog", label: "Catálogo", icon: Package01Icon },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart01Icon },
];

export function AdminShell({
  children,
  title,
  eyebrow,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
                <HugeiconsIcon icon={SparklesIcon} size={12} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold tracking-tight">Persys</span>
            </Link>
            {eyebrow && (
              <>
                <span className="hidden text-xs text-muted-foreground/40 sm:inline">/</span>
                <span className="hidden text-[11px] text-muted-foreground sm:inline">{eyebrow}</span>
              </>
            )}
          </div>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <HugeiconsIcon icon={item.icon} size={13} strokeWidth={2} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden gap-1.5 text-xs sm:inline-flex",
              )}
            >
              <HugeiconsIcon icon={Store01Icon} size={13} strokeWidth={2} />
              Shop
            </Link>
            <AdminUserMenu />
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
