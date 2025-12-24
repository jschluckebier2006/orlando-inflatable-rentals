import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import birthdayPartiesImage from "@/assets/birthday-parties-category.webp";
import schoolEventsImage from "@/assets/school-events-category.webp";
import churchEventsImage from "@/assets/church-events-category.webp";
import corporateEventsImage from "@/assets/corporate-events-category.webp";
import graduationEventsImage from "@/assets/graduation-events-category.webp";

const eventTypes = [
  {
    name: "Birthday Parties",
    href: "/events/birthday-party-inflatable-rentals-in-orlando",
    image: birthdayPartiesImage,
  },
  {
    name: "School Events",
    href: "/events/school-event-inflatable-rentals-in-orlando",
    image: schoolEventsImage,
  },
  {
    name: "Church Events",
    href: "/events/church-event-inflatable-rentals-in-orlando",
    image: churchEventsImage,
  },
  {
    name: "Corporate Events",
    href: "/events/corporate-event-inflatable-rentals-in-orlando",
    image: corporateEventsImage,
  },
  {
    name: "Graduation Events",
    href: "/events/graduation-party-water-slide-rentals-in-orlando",
    image: graduationEventsImage,
  },
];

export function EventTypesSection() {
  return (
    <section className="section-padding section-alt">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Perfect for Any Event
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From backyard birthday parties to large school carnivals, we've got you covered!
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {eventTypes.map((event) => (
            <Link key={event.name} to={event.href}>
              <Card className="h-full overflow-hidden card-hover group">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
