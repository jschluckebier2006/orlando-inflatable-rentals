import { CategoryCard } from "./CategoryCard";
import { useInventory, type ProductCategory } from "@/lib/inventory";

export function AllCategoryCarousels() {
  const { products } = useInventory();
  const by = (c: ProductCategory) => products.filter((p) => p.category === c);
  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Row 1 */}
          <CategoryCard
            title="Water Slide Rentals"
            products={by("water-slides")}
            categoryLink="/water-slide-rentals"
          />
          <CategoryCard
            title="Bounce House Rentals"
            products={by("bounce-houses")}
            categoryLink="/bounce-house-rentals"
          />

          {/* Row 2 */}
          <CategoryCard
            title="Bounce & Slide Combo Rentals"
            products={by("bounce-slide-combos")}
            categoryLink="/bounce-slide-combo-rentals"
          />
          <CategoryCard
            title="Obstacle Course Rentals"
            products={by("obstacle-courses")}
            categoryLink="/obstacle-course-rentals"
          />

          {/* Row 3 */}
          <CategoryCard
            title="Interactive Game Rentals"
            products={by("interactive-games")}
            categoryLink="/interactive-game-rentals"
          />
          <CategoryCard
            title="Concession Rentals"
            products={by("concessions")}
            categoryLink="/concession-rentals"
          />

          {/* Row 4 */}
          <CategoryCard
            title="Table & Chair Rentals"
            products={by("tables-chairs")}
            categoryLink="/table-chair-rentals"
          />
        </div>
      </div>
    </section>
  );
}
