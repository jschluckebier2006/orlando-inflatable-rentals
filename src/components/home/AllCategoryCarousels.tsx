import { CategoryCard } from "./CategoryCard";
import {
  getWaterSlides,
  getBounceSlidesCombos,
  getBounceHouses,
  getObstacleCourses,
  getInteractiveGames,
  getConcessions,
  getTablesChairs,
} from "@/data/inventory";

export function AllCategoryCarousels() {
  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Row 1 */}
          <CategoryCard
            title="Water Slide Rentals"
            products={getWaterSlides()}
            categoryLink="/water-slide-rentals"
          />
          <CategoryCard
            title="Bounce House Rentals"
            products={getBounceHouses()}
            categoryLink="/bounce-house-rentals"
          />

          {/* Row 2 */}
          <CategoryCard
            title="Bounce & Slide Combo Rentals"
            products={getBounceSlidesCombos()}
            categoryLink="/bounce-slide-combo-rentals"
          />
          <CategoryCard
            title="Obstacle Course Rentals"
            products={getObstacleCourses()}
            categoryLink="/obstacle-course-rentals"
          />

          {/* Row 3 */}
          <CategoryCard
            title="Interactive Game Rentals"
            products={getInteractiveGames()}
            categoryLink="/interactive-game-rentals"
          />
          <CategoryCard
            title="Concession Rentals"
            products={getConcessions()}
            categoryLink="/concession-rentals"
          />

          {/* Row 4 */}
          <CategoryCard
            title="Table & Chair Rentals"
            products={getTablesChairs()}
            categoryLink="/table-chair-rentals"
          />
        </div>
      </div>
    </section>
  );
}
