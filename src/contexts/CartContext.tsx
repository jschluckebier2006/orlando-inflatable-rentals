import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "@/data/inventory";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (p: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  openCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  openCheckout: () => void;
  isCheckoutOpen: boolean;
  setCheckoutOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "oi-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.length,
    total: items.reduce((s, i) => s + Number(i.price || 0), 0),
    addItem: (p) => setItems((cur) =>
      cur.some((i) => i.id === p.id) ? cur : [...cur, { id: p.id, name: p.name, price: p.price, image: p.image }]
    ),
    removeItem: (id) => setItems((cur) => cur.filter((i) => i.id !== id)),
    clear: () => setItems([]),
    has: (id) => items.some((i) => i.id === id),
    openCart: () => setCartOpen(true),
    isCartOpen, setCartOpen,
    openCheckout: () => { setCartOpen(false); setCheckoutOpen(true); },
    isCheckoutOpen, setCheckoutOpen,
  }), [items, isCartOpen, isCheckoutOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
