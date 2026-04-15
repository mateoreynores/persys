"use client";

import { createContext, useEffect, useState, useSyncExternalStore } from "react";

type CartItem = {
  productId: string;
  name: string;
  brand: string;
  imageUrl: string;
  unitPriceCents: number;
  salePriceCents: number | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  notes: string;
  isHydrated: boolean;
  itemCount: number;
  subtotalCents: number;
  totalCents: number;
  discountCents: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "persys-cart-v1";
const subscribe = () => () => undefined;

export const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart() {
  if (typeof window === "undefined") {
    return { items: [] as CartItem[], notes: "" };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { items: [] as CartItem[], notes: "" };
  }

  try {
    const parsed = JSON.parse(stored) as { items?: CartItem[]; notes?: string };
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
    };
  } catch {
    return { items: [] as CartItem[], notes: "" };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart().items);
  const [notes, setNotes] = useState(() => readStoredCart().notes);
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, notes }));
  }, [isHydrated, items, notes]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotalCents = items.reduce(
    (total, item) => total + item.unitPriceCents * item.quantity,
    0,
  );
  const totalCents = items.reduce((total, item) => {
    const effectivePrice = item.salePriceCents ?? item.unitPriceCents;
    return total + effectivePrice * item.quantity;
  }, 0);

  const value: CartContextValue = {
    items,
    notes,
    isHydrated,
    itemCount,
    subtotalCents,
    totalCents,
    discountCents: subtotalCents - totalCents,
    addItem(item, quantity = 1) {
      setItems((current) => {
        const existing = current.find((entry) => entry.productId === item.productId);
        if (existing) {
          return current.map((entry) =>
            entry.productId === item.productId
              ? { ...entry, quantity: Math.min(entry.quantity + quantity, 999) }
              : entry,
          );
        }

        return [...current, { ...item, quantity }];
      });
    },
    removeItem(productId) {
      setItems((current) => current.filter((item) => item.productId !== productId));
    },
    updateQuantity(productId, quantity) {
      if (quantity <= 0) {
        setItems((current) => current.filter((item) => item.productId !== productId));
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.productId === productId ? { ...item, quantity: Math.min(quantity, 999) } : item,
        ),
      );
    },
    setNotes(nextNotes) {
      setNotes(nextNotes);
    },
    clearCart() {
      setItems([]);
      setNotes("");
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
