import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/inventory";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      className="overflow-hidden card-hover cursor-pointer group transition-all duration-300 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground font-bold text-sm px-3 py-1">
          ${product.price}
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
      </CardContent>
    </Card>
  );
}
