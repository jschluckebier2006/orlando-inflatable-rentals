import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "@/data/inventory";
import { DURATION_MULTIPLIERS, type DurationType } from "@/lib/pricing";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  /** Sum of base prices (per day, before duration multiplier). */
  baseTotal: number;
  /** Sum of charged prices for the selected duration. */
  total: number;
  duration: DurationType;
  setDuration: (d: DurationType) => void;
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
const DURATION_KEY = "oi-cart-duration-v1";

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
  const [duration, setDuration] = useState<DurationType>(() => {
    if (typeof window === "undefined") return "7hour";
    const v = localStorage.getItem(DURATION_KEY);
    return v === "overnight" || v === "weekend" ? v : "7hour";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try { localStorage.setItem(DURATION_KEY, duration); } catch {}
  }, [duration]);

  const value = useMemo<CartContextValue>(() => {
    const baseTotal = items.reduce((s, i) => s + Number(i.price || 0), 0);
    const total = Math.round(baseTotal * DURATION_MULTIPLIERS[duration] * 100) / 100;
    return ({
    items,
    count: items.length,
    baseTotal,
    total,
    duration,
    setDuration,
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
  });
  }, [items, duration, isCartOpen, isCheckoutOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
