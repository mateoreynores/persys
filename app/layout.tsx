import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="es" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
