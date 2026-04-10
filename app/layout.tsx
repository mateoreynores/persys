import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Persys — Distribuidora Mayorista",
  description:
    "Persys es una distribuidora mayorista de productos para supermercados en Argentina. Más de 10 años de experiencia, más de 2.000 productos.",
  keywords: ["distribuidora", "mayorista", "supermercados", "Argentina", "Persys"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("h-full", "antialiased", inter.className, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
