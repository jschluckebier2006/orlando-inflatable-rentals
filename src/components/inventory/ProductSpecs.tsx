import type { ProductSpec } from "@/lib/inventory";

export function ProductSpecs({ specs, className = "" }: { specs?: ProductSpec[]; className?: string }) {
  if (!specs || specs.length === 0) return null;
  return (
    <dl className={`mt-3 text-xs divide-y divide-border border-y border-border ${className}`}>
      {specs.map((s) => (
        <div key={s.label} className="flex items-baseline justify-between gap-3 py-1.5">
          <dt className="text-muted-foreground">{s.label}</dt>
          <dd className="text-right text-foreground font-medium">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** True when the spec list already shows a price, so the card shouldn't repeat it. */
export function specsIncludePrice(specs?: ProductSpec[]) {
  return !!specs?.some((s) => s.label.trim().toLowerCase() === "price");
}