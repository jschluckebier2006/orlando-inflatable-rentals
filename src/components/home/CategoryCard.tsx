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
  // Show up to 5 products
  const displayProducts = products.slice(0, 5);
  
  if (displayProducts.length === 0) return null;

  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card shadow-sm">
      {/* Blue Header */}
      <div className="bg-primary px-4 py-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-primary-foreground">
          {title}
        </h3>
        <Link to={categoryLink}>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white text-foreground hover:bg-gray-100 font-semibold text-sm"
          >
            See All
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
          
          {/* See More Card */}
          <Link to={categoryLink} className="flex-shrink-0 w-28 group">
            <div className="h-full flex flex-col items-center justify-center aspect-square bg-muted/50 rounded-md hover:bg-primary/10 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary">See More</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
