import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Product } from "@/lib/inventory";
import { ProductDetailModal } from "@/components/product/ProductDetailModal";

interface RowLink {
  label: string;
  to: string;
}

interface CategoryCardProps {
  title: string;
  products: Product[];
  categoryLink: string;
  /** "View all" links shown at the end of the row (used by combined rows) */
  links?: RowLink[];
  /** Max products shown in the row */
  maxItems?: number;
}

const WET_DRY = /\s*\((wet\s*\/\s*dry|wet or dry)\)/i;

// Short label for the small homepage cards: "(Wet/Dry)" becomes a badge on the photo
function cardLabel(name: string) {
  return { short: name.replace(WET_DRY, "").trim(), wetDry: WET_DRY.test(name) };
}

export function CategoryCard({ title, products, categoryLink, links, maxItems = 8 }: CategoryCardProps) {
  const displayProducts = products.slice(0, maxItems);
  const [selected, setSelected] = useState<Product | null>(null);
  const endLinks = links && links.length > 0 ? links : [{ label: "View all", to: categoryLink }];

  if (displayProducts.length === 0) return null;

  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card shadow-sm">
      {/* Blue Header */}
      <div className="bg-primary px-4 py-3 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-primary-foreground leading-tight">{title}</h3>
        <Link
          to={categoryLink}
          aria-label={`View all ${title}`}
          className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-primary-foreground/90 hover:text-primary-foreground hover:underline underline-offset-4"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Scrollable Products */}
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-3" style={{ minWidth: "max-content" }}>
          {displayProducts.map((item) => {
            const { short, wetDry } = cardLabel(item.name);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="group flex-shrink-0 w-32 text-left"
                aria-label={`View ${item.name}`}
              >
                <Card className="h-full overflow-hidden border-0 shadow-none hover:shadow-md transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-muted/30 rounded-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={200}
                      height={200}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    {wetDry && (
                      <span className="absolute top-1 left-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
                        Wet/Dry
                      </span>
                    )}
                  </div>
                  <CardContent className="p-2 text-center">
                    <h4 className="text-xs font-medium text-foreground line-clamp-3 mb-1 group-hover:text-primary transition-colors">
                      {short}
                    </h4>
                    <p className="text-sm font-bold text-foreground">
                      ${item.price}
                      <span className="text-xs font-normal text-muted-foreground">/day</span>
                    </p>
                  </CardContent>
                </Card>
              </button>
            );
          })}

          {/* View all links at the end of the row */}
          <div className="flex-shrink-0 flex flex-col justify-center gap-2 px-2">
            {endLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                aria-label={`View all ${l.label === "View all" ? title : l.label}`}
                className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-md transition-all duration-300 hover:bg-secondary/80 hover:shadow-lg"
              >
                {l.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <ProductDetailModal
        product={selected}
        open={selected !== null}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      />
    </div>
  );
}
