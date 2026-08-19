import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Phone } from "lucide-react";
import type { Product } from "@/lib/inventory";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { ProductSpecs, specsIncludePrice } from "./ProductSpecs";
import { RESERVE_PHONE, RESERVE_PHONE_HREF, trackCallToReserve } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { addItem, has, openCart } = useCart();
  const inCart = has(product.id);
  const phoneOnly = product.bookableOnline === false;
  const hidePrice = specsIncludePrice(product.specs);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart) {
      openCart();
      return;
    }
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} was added to your cart.`,
    });
    openCart();
  };

  return (
    <Card 
      className="overflow-hidden card-hover cursor-pointer group transition-all duration-300 hover:shadow-xl flex flex-col h-full"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden relative bg-muted/30">
        <img 
          src={product.image} 
          alt={product.name} 
          width={600}
          height={600}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <CardContent className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.size && (
          <p className="text-sm text-muted-foreground mt-1">{product.size}</p>
        )}
        {product.ageRange && (
          <p className="text-sm text-muted-foreground">Ages: {product.ageRange}</p>
        )}
        {!hidePrice && (
          <p className="mt-2 text-[22px] font-bold leading-none text-foreground">
            ${product.price} / day
          </p>
        )}
        <ProductSpecs specs={product.specs} />
        <div className="mt-auto pt-3">
          {phoneOnly ? (
            <>
              <Button
                asChild
                className="w-full min-h-[44px] bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              >
                <a
                  href={RESERVE_PHONE_HREF}
                  aria-label="Call Orlando Inflatables at 407-497-1840 to reserve the 20x20 high peak tent"
                  onClick={(e) => {
                    e.stopPropagation();
                    trackCallToReserve(product);
                  }}
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
              onClick={handleAdd}
              className="w-full min-h-[44px] bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
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
      </CardContent>
    </Card>
  );
}
