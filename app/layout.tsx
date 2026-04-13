import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { Providers } from "@/components/providers";
import { isClerkConfigured } from "@/lib/env";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Persys | Catálogo B2B y administración comercial",
  description:
    "Landing, catálogo B2B, checkout por WhatsApp y panel administrativo para pedidos y catálogo de Persys.",
  keywords: [
    "distribuidora",
    "mayorista",
    "supermercados",
    "shop b2b",
    "panel pedidos",
    "Persys",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkEnabled = isClerkConfigured();

  return (
    <html
      lang="es"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <Providers clerkEnabled={clerkEnabled}>{children}</Providers>
      </body>
    </html>
  );
}
