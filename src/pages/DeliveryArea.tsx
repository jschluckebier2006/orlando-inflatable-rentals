import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const areas = [
  { name: "Alafaya", slug: "alafaya" }, { name: "Avalon Park", slug: "avalon-park" }, { name: "Azalea Park", slug: "azalea-park" },
  { name: "Bithlo", slug: "bithlo" }, { name: "Christmas", slug: "christmas" }, { name: "Chuluota", slug: "chuluota" },
  { name: "Eastwood", slug: "eastwood" }, { name: "Stoneybrook", slug: "stoneybrook" }, { name: "Waterford Lakes", slug: "waterford-lakes" }, { name: "Wedgefield", slug: "wedgefield" },
];

export default function DeliveryArea() {
  return (
    <Layout>
      <SEOHead title="Delivery Areas - East Orlando & Orange County" description="Orlando Inflatables delivers bounce houses, water slides, and party rentals to Alafaya, Avalon Park, Waterford Lakes, and more East Orlando communities." canonical="/delivery-area" />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }]} />
      <section className="section-padding">
        <div className="container-page">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">Our Delivery Areas</h1>
          <p className="text-muted-foreground text-lg text-center mb-12 max-w-2xl mx-auto">We proudly serve East Orlando, Orange County, and Central Florida with free delivery!</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {areas.map((area) => (
              <Link key={area.slug} to={`/delivery-area/${area.slug}`} className="group flex items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition-all">
                <MapPin className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{area.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ReviewsSection />
    </Layout>
  );
}
