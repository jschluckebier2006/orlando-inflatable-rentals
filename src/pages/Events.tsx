import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Cake, School, Church, Building2, GraduationCap } from "lucide-react";
import birthdayPartiesImage from "@/assets/birthday-parties-category.webp";
import schoolEventsImage from "@/assets/school-events-category.webp";
import churchEventsImage from "@/assets/church-events-category.webp";
import corporateEventsImage from "@/assets/corporate-events-category.webp";
import graduationEventsImage from "@/assets/graduation-events-category.webp";

const events = [
  { name: "Birthday Parties", href: "/events/birthday-party-inflatable-rentals-in-orlando", icon: Cake, image: birthdayPartiesImage },
  { name: "School Events", href: "/events/school-event-inflatable-rentals-in-orlando", icon: School, image: schoolEventsImage },
  { name: "Church Events", href: "/events/church-event-inflatable-rentals-in-orlando", icon: Church, image: churchEventsImage },
  { name: "Corporate Events", href: "/events/corporate-event-inflatable-rentals-in-orlando", icon: Building2, image: corporateEventsImage },
  { name: "Graduation Events", href: "/events/graduation-party-water-slide-rentals-in-orlando", icon: GraduationCap, image: graduationEventsImage },
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
