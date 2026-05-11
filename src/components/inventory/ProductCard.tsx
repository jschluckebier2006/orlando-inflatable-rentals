import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/inventory";
import { useCart } from "@/contexts/CartContext";

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
    } else {
      addItem(product);
      openCart();
    }
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
          onClick={handleAdd}
          className="w-full mt-3 min-h-[44px] bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
        >
          {inCart ? (
            <><Check className="h-4 w-4 mr-1.5" />Added — View Cart</>
          ) : (
            <><Plus className="h-4 w-4 mr-1.5" />Add to Cart</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
