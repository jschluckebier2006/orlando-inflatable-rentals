import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Castle, Waves, Trophy, Gamepad2, Popcorn, Armchair } from "lucide-react";

const categories = [
  { name: "Bounce Houses", description: "Fun bounce houses for all ages", href: "/bounce-house-rentals", icon: Castle, color: "text-primary", bgColor: "bg-primary/10" },
  { name: "Water Slides", description: "Beat the Florida heat", href: "/water-slide-rentals", icon: Waves, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { name: "Obstacle Courses", description: "Challenge your guests", href: "/obstacle-course-rentals", icon: Trophy, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { name: "Interactive Games", description: "Engaging games for everyone", href: "/interactive-game-rentals", icon: Gamepad2, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { name: "Concessions", description: "Popcorn, snow cones & more", href: "/concession-rentals", icon: Popcorn, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  { name: "Tables & Chairs", description: "Seating for your event", href: "/table-chair-rentals", icon: Armchair, color: "text-green-600", bgColor: "bg-green-600/10" },
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
                <Card className="h-full card-hover border-2 border-transparent hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${cat.bgColor} mb-4`}>
                      <cat.icon className={`h-7 w-7 ${cat.color}`} />
                    </div>
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
