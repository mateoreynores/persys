"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

import { CartProvider } from "@/components/cart/cart-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({
  children,
  clerkEnabled,
}: {
  children: React.ReactNode;
  clerkEnabled: boolean;
}) {
  const content = (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <CartProvider>
        {children}
        <Toaster richColors position="top-right" />
      </CartProvider>
    </ThemeProvider>
  );

  if (!clerkEnabled) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}
