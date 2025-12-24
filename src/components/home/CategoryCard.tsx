import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { type Product } from "@/data/inventory";

interface CategoryCardProps {
  title: string;
  products: Product[];
  categoryLink: string;
}

export function CategoryCard({ title, products, categoryLink }: CategoryCardProps) {
  // Limit to 3 products
  const displayProducts = products.slice(0, 3);
  
  if (displayProducts.length === 0) return null;

  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card shadow-sm">
      {/* Blue Header */}
      <div className="bg-primary px-4 py-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-primary-foreground">
          {title}
        </h3>
        <Link to={categoryLink} aria-label={`View all ${title}`}>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white text-foreground hover:bg-gray-100 font-semibold text-sm"
          >
            See More
          </Button>
        </Link>
      </div>
      
      {/* Scrollable Products */}
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {displayProducts.map((item) => (
            <Link key={item.id} to={categoryLink} className="group flex-shrink-0 w-28">
              <Card className="h-full overflow-hidden border-0 shadow-none hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden bg-muted/30 rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-2 text-center">
                  <h4 className="text-xs font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-sm font-bold text-foreground">${item.price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {/* View More Button */}
          <Link to={categoryLink} className="flex-shrink-0 flex items-center justify-center px-2" aria-label={`View ${title}`}>
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-sm px-4 py-2 rounded-md shadow-md"
            >
              See More →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
