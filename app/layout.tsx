import type { Metadata } from "next";
import { Noto_Sans, Figtree } from "next/font/google";

import { Providers } from "@/components/providers";
import { isClerkConfigured } from "@/lib/env";

import "./globals.css";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const figtreeHeading = Figtree({subsets:['latin'],variable:'--font-heading'});

export const metadata: Metadata = {
  title: "Persys | Distribuidora mayorista para comercios",
  description:
    "Persys es una distribuidora mayorista que abastece supermercados, almacenes y comercios minoristas con productos de consumo masivo.",
  keywords: [
    "distribuidora mayorista",
    "productos para supermercados",
    "abastecimiento comercios",
    "consumo masivo",
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
      className={cn("h-full", "antialiased", "font-sans", notoSans.variable, figtreeHeading.variable)}
    >
      <body className="min-h-full font-sans">
        <Providers clerkEnabled={clerkEnabled}>{children}</Providers>
      </body>
    </html>
  );
}
