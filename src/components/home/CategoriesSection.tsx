import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import bounceHouseCategoryImg from "@/assets/bounce-house-category.png";

const categories = [
  {
    name: "Bounce Houses",
    description: "Fun bounce houses for all ages and themes",
    href: "/bounce-house-rentals",
    image: bounceHouseCategoryImg,
  },
  {
    name: "Bounce & Slide Combos",
    description: "2-in-1 fun with bounce houses and slides combined",
    href: "/bounce-slide-combo-rentals",
    image: null, // Add image later
  },
  {
    name: "Water Slides",
    description: "Beat the Florida heat with exciting water slides",
    href: "/water-slide-rentals",
    image: null, // Add image later
  },
  {
    name: "Obstacle Courses",
    description: "Challenge guests with thrilling obstacle courses",
    href: "/obstacle-course-rentals",
    image: null, // Add image later
  },
  {
    name: "Interactive Games",
    description: "Engaging games for competitive fun",
    href: "/interactive-game-rentals",
    image: null, // Add image later
  },
  {
    name: "Concessions",
    description: "Popcorn, snow cones, cotton candy & more",
    href: "/concession-rentals",
    image: null, // Add image later
  },
  {
    name: "Tables & Chairs",
    description: "Comfortable seating for all your guests",
    href: "/table-chair-rentals",
    image: null, // Add image later
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
              <Card className="h-full card-hover border-2 border-transparent hover:border-primary/20 overflow-hidden">
                {category.image && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <CardContent className="p-6">
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
