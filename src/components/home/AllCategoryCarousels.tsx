import { CategoryCard } from "./CategoryCard";
import { useInventory, type ProductCategory } from "@/lib/inventory";

// Water slides lead the homepage in warm months (Mar-Oct);
// bounce houses lead the rest of the year. No manual swap needed.
function isWaterSeason() {
  const month = new Date().getMonth(); // 0 = Jan
  return month >= 2 && month <= 9;
}

export function AllCategoryCarousels() {
  const { products } = useInventory();
  const by = (...cats: ProductCategory[]) => products.filter((p) => cats.includes(p.category));
  const byPrice = (list: typeof products) => [...list].sort((a, b) => Number(a.price) - Number(b.price));

  const bounce = (
    <CategoryCard
      key="bounce"
      title="Bounce Houses & Combos"
      products={byPrice(by("bounce-houses", "bounce-slide-combos"))}
      categoryLink="/bounce-house-rentals"
      links={[
        { label: "Bounce houses", to: "/bounce-house-rentals" },
        { label: "Combos", to: "/bounce-slide-combo-rentals" },
      ]}
      maxItems={10}
    />
  );
  const water = (
    <CategoryCard key="water" title="Water Slides" products={by("water-slides")} categoryLink="/water-slide-rentals" />
  );
  const games = (
    <CategoryCard
      key="games"
      title="Games & Obstacle Courses"
      products={by("interactive-games", "obstacle-courses")}
      categoryLink="/interactive-game-rentals"
      links={[
        { label: "Games", to: "/interactive-game-rentals" },
        { label: "Obstacle courses", to: "/obstacle-course-rentals" },
      ]}
    />
  );
  const addOns = (
    <CategoryCard
      key="addons"
      title="Party Add-Ons"
      products={by("concessions", "tables-chairs", "tents")}
      categoryLink="/concession-rentals"
      links={[
        { label: "Concessions", to: "/concession-rentals" },
        { label: "Tables & chairs", to: "/table-chair-rentals" },
        { label: "Tents", to: "/tent-rentals" },
      ]}
      maxItems={10}
    />
  );

  const rows = isWaterSeason() ? [water, bounce, games, addOns] : [bounce, games, water, addOns];

  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{rows}</div>
      </div>
    </section>
  );
}
