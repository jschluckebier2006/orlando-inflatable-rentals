import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import bounceHouseCategoryImg from "@/assets/bounce-house-category.webp";
import bounceSlideComboImg from "@/assets/bounce-slide-combo-category.webp";
import waterSlideCategoryImg from "@/assets/water-slide-category.webp";
import obstacleCourseImg from "@/assets/obstacle-course-category.webp";
import interactiveGamesImg from "@/assets/interactive-games-category.webp";
import concessionsImg from "@/assets/concessions-category.webp";
import tablesChairsImg from "@/assets/tables-chairs-category.webp";

const categories = [
  {
    name: "Bounce Houses",
    href: "/bounce-house-rentals",
    image: bounceHouseCategoryImg
  },
  {
    name: "Bounce & Slide Combos",
    href: "/bounce-slide-combo-rentals",
    image: bounceSlideComboImg
  },
  {
    name: "Water & Dry Slides",
    href: "/water-slide-rentals",
    image: waterSlideCategoryImg
  },
  {
    name: "Obstacle Courses",
    href: "/obstacle-course-rentals",
    image: obstacleCourseImg
  },
  {
    name: "Interactive Games",
    href: "/interactive-game-rentals",
    image: interactiveGamesImg
  },
  {
    name: "Concessions",
    href: "/concession-rentals",
    image: concessionsImg
  },
  {
    name: "Tables & Chairs",
    href: "/table-chair-rentals",
    image: tablesChairsImg
  }
];

export function EventCategoriesGrid() {
  return (
    <section className="py-12">
      <div className="container-page">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Browse Our Rental Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect entertainment for your event from our wide selection of inflatables and party equipment.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.name} to={category.href} className="group">
              <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <div className="aspect-[4/3] overflow-hidden bg-muted/30">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-3 text-center">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
