import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Castle, 
  Waves, 
  Trophy, 
  Gamepad2, 
  Popcorn, 
  Armchair 
} from "lucide-react";

const categories = [
  {
    name: "Bounce Houses",
    description: "Fun bounce houses for all ages and themes",
    href: "/bounce-house-rentals",
    icon: Castle,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    name: "Water Slides",
    description: "Beat the Florida heat with exciting water slides",
    href: "/water-slide-rentals",
    icon: Waves,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "Obstacle Courses",
    description: "Challenge guests with thrilling obstacle courses",
    href: "/obstacle-course-rentals",
    icon: Trophy,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    name: "Interactive Games",
    description: "Engaging games for competitive fun",
    href: "/interactive-game-rentals",
    icon: Gamepad2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "Concessions",
    description: "Popcorn, snow cones, cotton candy & more",
    href: "/concession-rentals",
    icon: Popcorn,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    name: "Tables & Chairs",
    description: "Comfortable seating for all your guests",
    href: "/table-chair-rentals",
    icon: Armchair,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
  },
];

export function CategoriesSection() {
  return (
    <section className="section-padding">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What We Offer
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From bounce houses to concessions, we have everything you need to make your event a hit!
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.name} to={category.href}>
              <Card className="h-full card-hover border-2 border-transparent hover:border-primary/20">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${category.bgColor} mb-4`}>
                    <category.icon className={`h-7 w-7 ${category.color}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {category.description}
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
