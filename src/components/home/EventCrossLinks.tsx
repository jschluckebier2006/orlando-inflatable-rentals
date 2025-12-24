import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Cake, GraduationCap, Church, Building, Award } from "lucide-react";

const eventTypes = [
  {
    name: "Birthday Parties",
    href: "/events/birthday-party-inflatable-rentals-in-orlando",
    icon: Cake,
    description: "Bounce houses & party rentals for kids"
  },
  {
    name: "School Events",
    href: "/events/school-event-inflatable-rentals-in-orlando",
    icon: GraduationCap,
    description: "Field days, carnivals & fundraisers"
  },
  {
    name: "Church Events",
    href: "/events/church-event-inflatable-rentals-in-orlando",
    icon: Church,
    description: "VBS, fall festivals & outreach"
  },
  {
    name: "Corporate Events",
    href: "/events/corporate-event-inflatable-rentals-in-orlando",
    icon: Building,
    description: "Company picnics & team building"
  },
  {
    name: "Graduation Parties",
    href: "/events/graduation-party-water-slide-rentals-in-orlando",
    icon: Award,
    description: "Water slides & celebration rentals"
  }
];

interface EventCrossLinksProps {
  currentEvent: "birthday" | "school" | "church" | "corporate" | "graduation";
}

export function EventCrossLinks({ currentEvent }: EventCrossLinksProps) {
  const currentMap: Record<string, string> = {
    birthday: "/events/birthday-party-inflatable-rentals-in-orlando",
    school: "/events/school-event-inflatable-rentals-in-orlando",
    church: "/events/church-event-inflatable-rentals-in-orlando",
    corporate: "/events/corporate-event-inflatable-rentals-in-orlando",
    graduation: "/events/graduation-party-water-slide-rentals-in-orlando"
  };

  const filteredEvents = eventTypes.filter(
    (event) => event.href !== currentMap[currentEvent]
  );

  return (
    <section className="py-12 bg-muted/30">
      <div className="container-page">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Planning a Different Type of Event?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide inflatable rentals for all types of events in Orlando and East Orange County.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredEvents.map((event) => (
            <Link key={event.name} to={event.href} className="group">
              <Card className="h-full border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <event.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                    {event.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
