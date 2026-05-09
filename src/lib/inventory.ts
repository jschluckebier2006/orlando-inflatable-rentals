import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import placeholder from "@/assets/inventory/15ft-tropic-shock-water-slide.webp";

export type ProductCategory =
  | "water-slides"
  | "bounce-slide-combos"
  | "interactive-games"
  | "bounce-houses"
  | "obstacle-courses"
  | "concessions"
  | "tables-chairs";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  image: string;
  description?: string;
  size?: string;
  capacity?: string;
  ageRange?: string;
  features?: string[];
}

// Build-time map of bundled webp assets keyed by filename.
const assetModules = import.meta.glob("/src/assets/inventory/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const legacyAssetMap: Record<string, string> = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => [path.split("/").pop()!, url]),
);

/** Set of bundled webp filenames available under src/assets/inventory. */
export const legacyAssetFilenames: Set<string> = new Set(Object.keys(legacyAssetMap));

function resolveImage(item: any, images: any[]): string {
  if (item.primary_image_url) return item.primary_image_url;
  const sorted = images
    .filter((i) => i.item_id === item.id)
    .sort((a, b) => (a.is_primary === b.is_primary ? a.sort_order - b.sort_order : a.is_primary ? -1 : 1));
  if (sorted.length > 0) return sorted[0].url;
  if (item.legacy_image && legacyAssetMap[item.legacy_image]) return legacyAssetMap[item.legacy_image];
  return placeholder;
}

function normalize(item: any, images: any[]): Product {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category as ProductCategory,
    price: Number(item.base_price ?? 0),
    image: resolveImage(item, images),
    description: item.description ?? undefined,
    size: item.dimensions ?? undefined,
    capacity: item.capacity ?? undefined,
    ageRange: item.age_range ?? undefined,
    features: item.features ?? undefined,
  };
}

let cache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;
const subscribers = new Set<(p: Product[]) => void>();

export async function loadInventory(opts: { includeInactive?: boolean; force?: boolean } = {}): Promise<Product[]> {
  if (!opts.force && cache) return opts.includeInactive ? cache : cache.filter((p) => (p as any).__active !== false);
  if (inflight && !opts.force) return inflight;
  inflight = (async () => {
    const [itemsRes, imagesRes] = await Promise.all([
      (supabase.from("inventory_items") as any)
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      (supabase.from("inventory_images") as any).select("*"),
    ]);
    const itemsRaw = (itemsRes.data ?? []) as any[];
    const images = (imagesRes.data ?? []) as any[];
    const products = itemsRaw.map((it) => {
      const p = normalize(it, images) as Product & { __active?: boolean };
      p.__active = it.active !== false;
      return p;
    });
    cache = products;
    inflight = null;
    subscribers.forEach((cb) => cb(products));
    return products;
  })();
  const all = await inflight;
  return opts.includeInactive ? all : all.filter((p) => (p as any).__active !== false);
}

export function refreshInventory() {
  cache = null;
  return loadInventory({ force: true });
}

export function useInventory(opts: { includeInactive?: boolean } = {}) {
  const filterFn = (list: Product[]) =>
    opts.includeInactive ? list : list.filter((p) => (p as any).__active !== false);
  const [products, setProducts] = useState<Product[]>(() => (cache ? filterFn(cache) : []));
  const [loading, setLoading] = useState<boolean>(() => !cache);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const cb = (list: Product[]) => {
      if (active) setProducts(filterFn(list));
    };
    subscribers.add(cb);
    if (!cache) {
      loadInventory({ includeInactive: true })
        .then((list) => active && (setProducts(filterFn(list)), setLoading(false)))
        .catch((e) => active && (setError(e), setLoading(false)));
    } else {
      setLoading(false);
    }
    return () => {
      active = false;
      subscribers.delete(cb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.includeInactive]);

  return { products, loading, error };
}

export function useCategory(category: ProductCategory) {
  const { products, loading, error } = useInventory();
  return { products: products.filter((p) => p.category === category), loading, error };
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "water-slides": "Water Slide",
  "bounce-slide-combos": "Bounce & Slide Combo",
  "interactive-games": "Interactive Game",
  "bounce-houses": "Bounce House",
  "obstacle-courses": "Obstacle Course",
  "concessions": "Concession",
  "tables-chairs": "Tables & Chairs",
};

export const CATEGORY_LINKS: Record<ProductCategory, string> = {
  "water-slides": "/water-slide-rentals",
  "bounce-slide-combos": "/bounce-slide-combo-rentals",
  "interactive-games": "/interactive-game-rentals",
  "bounce-houses": "/bounce-house-rentals",
  "obstacle-courses": "/obstacle-course-rentals",
  "concessions": "/concession-rentals",
  "tables-chairs": "/table-chair-rentals",
};