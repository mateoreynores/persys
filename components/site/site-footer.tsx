import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/shop", label: "Catálogo" },
  { href: "/shop/checkout", label: "Checkout" },
];

export function SiteFooter({
  showCatalogLinks = true,
}: {
  showCatalogLinks?: boolean;
}) {
  const visibleLinks = showCatalogLinks
    ? links
    : links.filter((link) => link.href !== "/shop" && link.href !== "/shop/checkout");

  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold tracking-tight">Persys</span>
          <span className="text-xs text-muted-foreground">
            Distribución mayorista B2B
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
