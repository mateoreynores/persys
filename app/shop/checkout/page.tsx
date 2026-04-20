import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { CheckoutClient } from "@/components/shop/checkout-client";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CartSheet } from "@/components/shop/cart-sheet";
import { formatCurrency } from "@/lib/format";
import { getStoreSettings } from "@/lib/store/repository";

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <div className="min-h-screen">
      <SiteHeader
        cartSlot={<CartSheet cartMinimumAmountCents={settings.cartMinimumAmountCents} />}
        compact
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={12} strokeWidth={2} />
            Catálogo
          </Link>
          <h1 className="mt-2 text-xl font-semibold sm:text-2xl">Checkout</h1>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground">
            Completá los datos de tu empresa. El pedido se registra y sigue por WhatsApp.
            {settings.cartMinimumAmountCents > 0
              ? ` Pedido minimo ${formatCurrency(settings.cartMinimumAmountCents)}.`
              : ""}
          </p>
        </div>
        <CheckoutClient cartMinimumAmountCents={settings.cartMinimumAmountCents} />
      </main>

      <SiteFooter />
    </div>
  );
}
