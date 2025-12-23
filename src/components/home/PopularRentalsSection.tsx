import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";
const popularRentals = [
  {
    name: "Castle Combo Bounce House",
    category: "Bounce House",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    rating: 5,
    reviews: 24,
    href: "/bounce-house-rentals",
  },
  {
    name: "Tropical Water Slide",
    category: "Water Slide",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    rating: 5,
    reviews: 31,
    href: "/water-slide-rentals",
  },
  {
    name: "40ft Obstacle Challenge",
    category: "Obstacle Course",
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=300&fit=crop",
    rating: 5,
    reviews: 18,
    href: "/obstacle-course-rentals",
  },
  {
    name: "Interactive Sports Arena",
    category: "Interactive Game",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
    rating: 4,
    reviews: 15,
    href: "/interactive-game-rentals",
  },
];

export function PopularRentalsSection() {
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

        {/* Rentals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRentals.map((rental) => (
            <Link key={rental.name} to={rental.href}>
              <Card className="h-full overflow-hidden card-hover group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={rental.image}
                    alt={rental.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/90">
                    {rental.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-1">
                    {rental.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rental.rating
                            ? "text-accent fill-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({rental.reviews})
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
