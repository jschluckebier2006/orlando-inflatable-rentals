import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { products, type ProductCategory } from "@/data/inventory";

// Get category display name
const getCategoryLabel = (category: ProductCategory): string => {
  const labels: Record<ProductCategory, string> = {
    "water-slides": "Water Slide",
    "bounce-slide-combos": "Bounce & Slide Combo",
    "interactive-games": "Interactive Game",
    "bounce-houses": "Bounce House",
    "obstacle-courses": "Obstacle Course",
    "concessions": "Concession",
    "tables-chairs": "Tables & Chairs"
  };
  return labels[category];
};

// Get category link
const getCategoryLink = (category: ProductCategory): string => {
  const links: Record<ProductCategory, string> = {
    "water-slides": "/water-slide-rentals",
    "bounce-slide-combos": "/bounce-slide-combo-rentals",
    "interactive-games": "/interactive-game-rentals",
    "bounce-houses": "/bounce-house-rentals",
    "obstacle-courses": "/obstacle-course-rentals",
    "concessions": "/concession-rentals",
    "tables-chairs": "/table-chair-rentals"
  };
  return links[category];
};
export function PopularRentalsSection() {
  // Get a mix of popular items from different categories
  const popularItems = products.filter(p => !["concessions", "tables-chairs"].includes(p.category)).slice(0, 16);
  
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Popular Rentals
            </h2>
            <p className="text-muted-foreground">Our most requested party rentals in East Orlando</p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/rentals">
              View All Rentals <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {popularItems.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Link to={getCategoryLink(product.category)}>
                  <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                          {getCategoryLabel(product.category)}
                        </Badge>
                        <Badge className="absolute bottom-2 right-2 bg-background/90 text-foreground font-bold">
                          ${product.price}
                        </Badge>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>

        <div className="mt-4 text-center text-sm text-muted-foreground md:hidden">
          ← Swipe to see more →
        </div>

        <div className="mt-6 text-center md:hidden">
          <Button asChild variant="outline">
            <Link to="/rentals">
              View All Rentals <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}