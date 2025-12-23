import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

const deliveryAreas = [
  { name: "Alafaya", slug: "alafaya" },
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Azalea Park", slug: "azalea-park" },
  { name: "Bithlo", slug: "bithlo" },
  { name: "Christmas", slug: "christmas" },
  { name: "Chuluota", slug: "chuluota" },
  { name: "Eastwood", slug: "eastwood" },
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Wedgefield", slug: "wedgefield" },
];

export function DeliveryAreasSection() {
  return (
    <section className="section-padding">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            We Deliver to Your Area
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Proudly serving East Orlando, Orange County, and Central Florida communities with free delivery!
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {deliveryAreas.map((area) => (
            <Link
              key={area.slug}
              to={`/water-slide-and-bounce-house-rental-${area.slug}`}
              className="group flex items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all duration-300"
            >
              <MapPin className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {area.name}
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/delivery-area">
            <Button variant="outline" size="lg" className="btn-bounce">
              View All Delivery Areas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
