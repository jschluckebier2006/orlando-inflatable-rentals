import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import bounceHouseCategoryImg from "@/assets/bounce-house-category.png";
import bounceSlideComboImg from "@/assets/bounce-slide-combo-category.png";
import waterSlideCategoryImg from "@/assets/water-slide-category.png";
import obstacleCourseImg from "@/assets/obstacle-course-category.png";
import interactiveGamesImg from "@/assets/interactive-games-category.png";
import concessionsImg from "@/assets/concessions-category.png";
import tablesChairsImg from "@/assets/tables-chairs-category.png";

const categories = [
  { name: "Bounce Houses", description: "Fun bounce houses for all ages", href: "/bounce-house-rentals", image: bounceHouseCategoryImg },
  { name: "Bounce & Slide Combos", description: "2-in-1 bounce & slide fun", href: "/bounce-slide-combo-rentals", image: bounceSlideComboImg },
  { name: "Water Slides", description: "Beat the Florida heat", href: "/water-slide-rentals", image: waterSlideCategoryImg },
  { name: "Obstacle Courses", description: "Challenge your guests", href: "/obstacle-course-rentals", image: obstacleCourseImg },
  { name: "Interactive Games", description: "Engaging games for everyone", href: "/interactive-game-rentals", image: interactiveGamesImg },
  { name: "Concessions", description: "Popcorn, snow cones & more", href: "/concession-rentals", image: concessionsImg },
  { name: "Tables & Chairs", description: "Seating for your event", href: "/table-chair-rentals", image: tablesChairsImg },
];

export default function Rentals() {
  return (
    <Layout>
      <SEOHead title="All Party Rentals in Orlando FL" description="Browse our complete selection of bounce houses, water slides, obstacle courses, interactive games, concessions, and table & chair rentals in East Orlando." canonical="/rentals" />
      <BreadcrumbSchema items={[{ name: "All Rentals", href: "/rentals" }]} />
      <section className="section-padding">
        <div className="container-page">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">All Party Rentals</h1>
          <p className="text-muted-foreground text-lg text-center mb-12 max-w-2xl mx-auto">Everything you need for an amazing event in East Orlando!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} to={cat.href}>
                <Card className="h-full card-hover border-2 border-transparent hover:border-primary/20 overflow-hidden">
                  {cat.image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-2">{cat.name}</h2>
                    <p className="text-muted-foreground">{cat.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
