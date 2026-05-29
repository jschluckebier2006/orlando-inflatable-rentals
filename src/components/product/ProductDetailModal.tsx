import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Product } from "@/lib/inventory";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const { addItem, has, openCart } = useCart();
  if (!product) return null;
  const inCart = has(product.id);

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
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
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
            <p className="mt-3 text-2xl font-bold leading-none text-foreground">
              ${product.price} / day
            </p>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}