import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Cake, School, Church, Building2, GraduationCap } from "lucide-react";

const events = [
  { name: "Birthday Parties", href: "/events/birthday-parties", icon: Cake, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=250&fit=crop" },
  { name: "School Events", href: "/events/school-events", icon: School, image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=250&fit=crop" },
  { name: "Church Events", href: "/events/church-events", icon: Church, image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&h=250&fit=crop" },
  { name: "Corporate Events", href: "/events/corporate-events", icon: Building2, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop" },
  { name: "Graduation Events", href: "/events/graduation-events", icon: GraduationCap, image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=250&fit=crop" },
];

export default function Events() {
  return (
    <Layout>
      <SEOHead title="Event Types We Serve in Orlando FL" description="Orlando Inflatables provides party rentals for birthday parties, school events, church gatherings, corporate events, and graduation celebrations." canonical="/events" />
      <BreadcrumbSchema items={[{ name: "Events", href: "/events" }]} />
      <section className="section-padding">
        <div className="container-page">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">Events We Serve</h1>
          <p className="text-muted-foreground text-lg text-center mb-12 max-w-2xl mx-auto">From backyard birthday parties to large school carnivals, we've got you covered!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {events.map((event) => (
              <Link key={event.name} to={event.href}>
                <Card className="h-full overflow-hidden card-hover group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2 text-white">
                      <event.icon className="h-5 w-5" />
                      <h2 className="font-display text-lg font-semibold">{event.name}</h2>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ReviewsSection />
    </Layout>
  );
}
