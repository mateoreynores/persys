"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/shop", label: "Catálogo" },
  { href: "/admin", label: "Admin" },
];

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Abrir menú" className="md:hidden">
            <HugeiconsIcon icon={Menu01Icon} size={18} strokeWidth={2} />
          </Button>
        }
      />
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>
            <span className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-[11px] font-bold tracking-tight">P</span>
              </span>
              <span className="text-sm font-semibold tracking-tight">Persys</span>
            </span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-[background-color,color] duration-150 ease-out hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
