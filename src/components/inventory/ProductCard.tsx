import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/lib/inventory";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { addItem, has, openCart } = useCart();
  const inCart = has(product.id);

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
      className="overflow-hidden card-hover cursor-pointer group transition-all duration-300 hover:shadow-xl"
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
        <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground font-bold text-base md:text-sm px-4 py-2 md:px-3 md:py-1 shadow-md">
          ${product.price} / day
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-display font-semibold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.size && (
          <p className="text-sm text-muted-foreground mt-1">{product.size}</p>
        )}
        {product.ageRange && (
          <p className="text-sm text-muted-foreground">Ages: {product.ageRange}</p>
        )}
        <Button
          type="button"
          onClick={handleAdd}
          className="w-full min-h-[44px] mt-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
        >
          {inCart ? (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              In Cart — View
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-1.5" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
