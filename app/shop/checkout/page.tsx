import { CheckoutClient } from "@/components/shop/checkout-client";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CartSheet } from "@/components/shop/cart-sheet";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader cartSlot={<CartSheet />} compact />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-semibold">Checkout comercial</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Registramos el pedido con los datos de tu empresa y luego te enviamos al canal de
            WhatsApp para la confirmación final.
          </p>
        </div>
        <CheckoutClient />
      </main>
      <SiteFooter />
    </div>
  );
}
