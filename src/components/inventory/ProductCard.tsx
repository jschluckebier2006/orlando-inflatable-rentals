import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Product } from "@/data/inventory";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      className="overflow-hidden card-hover group transition-all duration-300 hover:shadow-xl"
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
        <a href="tel:4074971840" className="block">
          <Button
            className="w-full mt-3 min-h-[44px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Call Us to Book Now
          </Button>
        </a>
        <Button
          disabled
          className="w-full mt-2 min-h-[44px] bg-muted text-muted-foreground font-semibold cursor-not-allowed opacity-60"
        >
          <Plus className="h-4 w-4 mr-1.5" />Add to Cart — Temporarily Disabled
        </Button>
      </CardContent>
    </Card>
  );
}
