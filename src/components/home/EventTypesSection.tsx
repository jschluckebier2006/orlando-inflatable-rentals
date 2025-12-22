import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Cake, 
  School, 
  Church, 
  Building2, 
  GraduationCap 
} from "lucide-react";

const eventTypes = [
  {
    name: "Birthday Parties",
    description: "Make their special day unforgettable",
    href: "/events/birthday-parties",
    icon: Cake,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=250&fit=crop",
  },
  {
    name: "School Events",
    description: "Field days, carnivals, and celebrations",
    href: "/events/school-events",
    icon: School,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=250&fit=crop",
  },
  {
    name: "Church Events",
    description: "Fellowship and community gatherings",
    href: "/events/church-events",
    icon: Church,
    image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&h=250&fit=crop",
  },
  {
    name: "Corporate Events",
    description: "Team building and company picnics",
    href: "/events/corporate-events",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
  },
  {
    name: "Graduation Events",
    description: "Celebrate their achievement in style",
    href: "/events/graduation-events",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=250&fit=crop",
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 text-white mb-1">
                      <event.icon className="h-5 w-5" />
                      <h3 className="font-display text-lg font-semibold">
                        {event.name}
                      </h3>
                    </div>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
