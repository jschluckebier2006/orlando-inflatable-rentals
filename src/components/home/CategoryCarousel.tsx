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
import { type Product } from "@/data/inventory";

interface CategoryCarouselProps {
  title: string;
  subtitle: string;
  products: Product[];
  categoryLink: string;
  categoryLabel: string;
}

export function CategoryCarousel({ 
  title, 
  subtitle, 
  products, 
  categoryLink,
  categoryLabel 
}: CategoryCarouselProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <Link to={categoryLink}>
            <Button variant="outline" className="btn-bounce">
              View All {categoryLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Products Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {products.map((item) => (
              <CarouselItem key={item.id} className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                <Link to={categoryLink}>
                  <Card className="h-full overflow-hidden card-hover group">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground font-bold text-xs">
                        ${item.price}
                      </Badge>
                    </div>
                    <CardContent className="p-2">
                      <h3 className="font-display text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
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
        <div className="flex justify-center mt-4 md:hidden">
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
