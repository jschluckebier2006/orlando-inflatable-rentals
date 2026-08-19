import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Phone } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Product } from "@/lib/inventory";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { ProductSpecs, specsIncludePrice } from "@/components/inventory/ProductSpecs";
import { RESERVE_PHONE, RESERVE_PHONE_HREF, trackCallToReserve } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const { addItem, has, openCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  if (!product) return null;
  const inCart = has(product.id);
  const phoneOnly = product.bookableOnline === false;
  const hidePrice = specsIncludePrice(product.specs);
  const gallery = product.images?.length ? product.images : [product.image];

  const handleBook = () => {
    if (inCart) {
      onOpenChange(false);
      openCart();
      return;
    }
    addItem(product);
    toast({ title: "Added to cart", description: `${product.name} was added to your cart.` });
    onOpenChange(false);
    openCart();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Product details for {product.name}</DialogDescription>
        </VisuallyHidden>
        <div className="p-5">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted/30">
            <img
              src={gallery[activeImage] ?? product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View photo ${i + 1} of ${product.name}`}
                  className={cn(
                    "h-14 w-14 flex-shrink-0 rounded-md overflow-hidden border bg-muted/30",
                    i === activeImage ? "border-primary ring-1 ring-primary" : "border-border"
                  )}
                >
                  <img src={src} alt="" className="w-full h-full object-contain" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-4">
            <h3 className="font-display font-bold text-foreground text-xl leading-tight">
              {product.name}
            </h3>
            {product.size && (
              <p className="text-sm text-muted-foreground mt-1">{product.size}</p>
            )}
            {product.ageRange && (
              <p className="text-sm text-muted-foreground">Ages: {product.ageRange}</p>
            )}
            {product.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}
            {!hidePrice && (
              <p className="mt-3 text-2xl font-bold leading-none text-foreground">
                ${product.price} / day
              </p>
            )}
            <ProductSpecs specs={product.specs} />
            {phoneOnly && (
              <p className="mt-2 text-xs text-muted-foreground">
                Tent only. Tables and chairs available as add-ons.
              </p>
            )}
            {phoneOnly ? (
              <>
                <Button
                  asChild
                  className="w-full min-h-[44px] mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                >
                  <a
                    href={RESERVE_PHONE_HREF}
                    aria-label="Call Orlando Inflatables at 407-497-1840 to reserve the 20x20 high peak tent"
                    onClick={() => trackCallToReserve(product)}
                  >
                    <Phone className="h-4 w-4 mr-1.5" />
                    Call to Reserve
                  </a>
                </Button>
                <p className="mt-1.5 text-xs text-muted-foreground text-center">{RESERVE_PHONE}</p>
              </>
            ) : (
              <Button
                type="button"
                onClick={handleBook}
                className="w-full min-h-[44px] mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              >
                {inCart ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5" />
                    In Cart — View
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-1.5" />
                    Book Now
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}