"use client";

import Link from "next/link";

import { UserButton, useAuth } from "@clerk/nextjs";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminUserMenu() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Link href="/sign-in" className={cn(buttonVariants({ variant: "outline" }))}>
          Ingresar
        </Link>
      )}
    </div>
  );
}
