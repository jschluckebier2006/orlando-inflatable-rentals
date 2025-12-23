import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
    "tables-chairs": "Tables & Chairs",
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
    "tables-chairs": "/table-chair-rentals",
  };
  return links[category];
};

export function PopularRentalsSection() {
  // Get a mix of popular items from different categories
  const popularItems = products.filter(p => 
    !["concessions", "tables-chairs"].includes(p.category)
  ).slice(0, 16);

  return (
    <section className="section-padding section-alt">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Popular Rentals
            </h2>
            <p className="text-muted-foreground text-lg">
              Our most requested party equipment in East Orlando
            </p>
          </div>
          <Link to="/rentals">
            <Button variant="outline" className="btn-bounce">
              View All Rentals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Rentals Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {popularItems.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Link to={getCategoryLink(item.category)}>
                  <Card className="h-full overflow-hidden card-hover group">
                    <div className="relative aspect-square overflow-hidden bg-muted/30">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary/90">
                        {getCategoryLabel(item.category)}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground font-bold">
                        ${item.price}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-background border-border shadow-lg hover:bg-primary hover:text-primary-foreground" />
          <CarouselNext className="hidden md:flex -right-4 bg-background border-border shadow-lg hover:bg-primary hover:text-primary-foreground" />
        </Carousel>

        {/* Mobile scroll hint */}
        <div className="flex justify-center mt-6 md:hidden">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Swipe to see more
            <ChevronRight className="h-4 w-4" />
          </p>
        </div>
      </div>
    </section>
  );
}
