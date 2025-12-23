import { CategoryCarousel } from "./CategoryCarousel";
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
    <>
      {/* Water Slides */}
      <CategoryCarousel
        title="Water Slide Rentals"
        subtitle="Beat the Florida heat with our thrilling water slides"
        products={getWaterSlides()}
        categoryLink="/water-slide-rentals"
        categoryLabel="Water Slides"
      />

      {/* Bounce & Slide Combos */}
      <div className="section-alt">
        <CategoryCarousel
          title="Bounce & Slide Combo Rentals"
          subtitle="The best of both worlds - bouncing and sliding fun!"
          products={getBounceSlidesCombos()}
          categoryLink="/bounce-slide-combo-rentals"
          categoryLabel="Combos"
        />
      </div>

      {/* Bounce Houses */}
      <CategoryCarousel
        title="Bounce House Rentals"
        subtitle="Classic bouncing fun for birthday parties and events"
        products={getBounceHouses()}
        categoryLink="/bounce-house-rentals"
        categoryLabel="Bounce Houses"
      />

      {/* Obstacle Courses */}
      <div className="section-alt">
        <CategoryCarousel
          title="Obstacle Course Rentals"
          subtitle="Challenge your guests with exciting obstacle courses"
          products={getObstacleCourses()}
          categoryLink="/obstacle-course-rentals"
          categoryLabel="Obstacle Courses"
        />
      </div>

      {/* Interactive Games */}
      <CategoryCarousel
        title="Interactive Game Rentals"
        subtitle="Competitive fun for all ages"
        products={getInteractiveGames()}
        categoryLink="/interactive-game-rentals"
        categoryLabel="Games"
      />

      {/* Concessions */}
      <div className="section-alt">
        <CategoryCarousel
          title="Concession Rentals"
          subtitle="Delicious carnival-style treats for your event"
          products={getConcessions()}
          categoryLink="/concession-rentals"
          categoryLabel="Concessions"
        />
      </div>

      {/* Tables & Chairs */}
      <CategoryCarousel
        title="Table & Chair Rentals"
        subtitle="Complete your party setup with comfortable seating"
        products={getTablesChairs()}
        categoryLink="/table-chair-rentals"
        categoryLabel="Tables & Chairs"
      />
    </>
  );
}
