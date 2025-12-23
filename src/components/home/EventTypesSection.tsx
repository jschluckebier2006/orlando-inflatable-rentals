import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  School, 
  Church, 
  Building2, 
  GraduationCap 
} from "lucide-react";
import birthdayPartiesImage from "@/assets/birthday-parties-category.png";
import schoolEventsImage from "@/assets/school-events-category.png";
import churchEventsImage from "@/assets/church-events-category.png";
import corporateEventsImage from "@/assets/corporate-events-category.png";

const eventTypes = [
  {
    name: "Birthday Parties",
    description: "",
    href: "/events/birthday-parties",
    icon: null,
    image: birthdayPartiesImage,
    hasOverlayText: false,
  },
  {
    name: "School Events",
    description: "",
    href: "/events/school-events",
    icon: null,
    image: schoolEventsImage,
    hasOverlayText: false,
  },
  {
    name: "Church Events",
    description: "",
    href: "/events/church-events",
    icon: null,
    image: churchEventsImage,
    hasOverlayText: false,
  },
  {
    name: "Corporate Events",
    description: "",
    href: "/events/corporate-events",
    icon: null,
    image: corporateEventsImage,
    hasOverlayText: false,
  },
  {
    name: "Graduation Events",
    description: "Celebrate their achievement in style",
    href: "/events/graduation-events",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=250&fit=crop",
    hasOverlayText: true,
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
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {event.hasOverlayText && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 text-white mb-1">
                          {event.icon && <event.icon className="h-5 w-5" />}
                          <h3 className="font-display text-lg font-semibold">
                            {event.name}
                          </h3>
                        </div>
                        <p className="text-white/80 text-sm line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
