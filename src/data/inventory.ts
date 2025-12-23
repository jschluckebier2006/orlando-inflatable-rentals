// Inventory data for all rental products
// Categories: water-slides, bounce-slide-combos, interactive-games, bounce-houses, obstacle-courses, concessions, tables-chairs

export type ProductCategory = 
  | "water-slides" 
  | "bounce-slide-combos" 
  | "interactive-games" 
  | "bounce-houses" 
  | "obstacle-courses" 
  | "concessions" 
  | "tables-chairs";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  image: string;
  // Optional fields for later
  description?: string;
  size?: string;
  capacity?: string;
  ageRange?: string;
  features?: string[];
}

// Import images
import sportsGame from "@/assets/inventory/3-in-1-sports-game.webp";
import aquaPalmsCombo from "@/assets/inventory/4-in-1-aqua-palms-combo.webp";
import economyCombo from "@/assets/inventory/4-in-1-economy-combo.webp";
import greenGushCombo from "@/assets/inventory/7-in-1-green-gush-combo.webp";
import marbleCombo from "@/assets/inventory/7-in-1-marble-combo.webp";
import mysticCastleCombo from "@/assets/inventory/7-in-1-mystic-castle-combo.webp";
import tropicShockSlide from "@/assets/inventory/15ft-tropic-shock-water-slide.webp";
import lavaFallsSlide from "@/assets/inventory/17ft-lava-falls-water-slide.webp";
import tikiPlungeSlide from "@/assets/inventory/18ft-tiki-plunge-water-slide.webp";
import islandDropSlide from "@/assets/inventory/18ft-island-drop-water-slide.webp";
import purpleHurricaneSlide from "@/assets/inventory/18ft-purple-hurricane-water-slide.webp";
import bajaHybridSlide from "@/assets/inventory/20ft-baja-hybrid-water-slide.webp";
import goombaySplashSlide from "@/assets/inventory/20ft-goombay-splash-water-slide.webp";
import paradiseFallsSlide from "@/assets/inventory/20ft-paradise-falls-water-slide.webp";
import toxicSlide from "@/assets/inventory/21ft-toxic-water-slide.webp";
import reggaeRushSlide from "@/assets/inventory/25ft-reggae-rush-water-slide.webp";
import insaneHurricaneSlide from "@/assets/inventory/27ft-insane-hurricane-water-slide.webp";
import backyardObstacle from "@/assets/inventory/30ft-backyard-obstacle-course.webp";
import flashpointObstacle from "@/assets/inventory/46ft-flashpoint-obstacle-course.webp";
import radioactiveRunObstacle from "@/assets/inventory/53ft-radioactive-run-obstacle-course.webp";

export const products: Product[] = [
  // Water Slides
  {
    id: "tropic-shock-15",
    name: "15' Tropic Shock Dual Lane Water Slide",
    slug: "15-tropic-shock-water-slide",
    category: "water-slides",
    price: 259,
    image: tropicShockSlide,
  },
  {
    id: "lava-falls-17",
    name: "17' Lava Falls Dual Lane Water Slide",
    slug: "17-lava-falls-water-slide",
    category: "water-slides",
    price: 299,
    image: lavaFallsSlide,
  },
  {
    id: "tiki-plunge-18",
    name: "18' Tiki Plunge Dual Lane Water Slide",
    slug: "18-tiki-plunge-water-slide",
    category: "water-slides",
    price: 309,
    image: tikiPlungeSlide,
  },
  {
    id: "island-drop-18",
    name: "18' Island Drop Dual Lane Water Slide",
    slug: "18-island-drop-water-slide",
    category: "water-slides",
    price: 319,
    image: islandDropSlide,
  },
  {
    id: "purple-hurricane-18",
    name: "18' Purple Hurricane Single Lane Water Slide",
    slug: "18-purple-hurricane-water-slide",
    category: "water-slides",
    price: 279,
    image: purpleHurricaneSlide,
  },
  {
    id: "baja-hybrid-20",
    name: "20' Baja Hybrid Water Slide",
    slug: "20-baja-hybrid-water-slide",
    category: "water-slides",
    price: 369,
    image: bajaHybridSlide,
  },
  {
    id: "goombay-splash-20",
    name: "20' Goombay Splash Dual Lane Water Slide",
    slug: "20-goombay-splash-water-slide",
    category: "water-slides",
    price: 369,
    image: goombaySplashSlide,
  },
  {
    id: "paradise-falls-20",
    name: "20' Paradise Falls Water Slide",
    slug: "20-paradise-falls-water-slide",
    category: "water-slides",
    price: 369,
    image: paradiseFallsSlide,
  },
  {
    id: "toxic-21",
    name: "21' Toxic Dual Lane Water Slide",
    slug: "21-toxic-water-slide",
    category: "water-slides",
    price: 399,
    image: toxicSlide,
  },
  {
    id: "reggae-rush-25",
    name: "25' Reggae Rush Dual Lane Water Slide",
    slug: "25-reggae-rush-water-slide",
    category: "water-slides",
    price: 559,
    image: reggaeRushSlide,
  },
  {
    id: "insane-hurricane-27",
    name: "27' Insane Hurricane Water Slide",
    slug: "27-insane-hurricane-water-slide",
    category: "water-slides",
    price: 599,
    image: insaneHurricaneSlide,
  },
  
  // Bounce & Slide Combos
  {
    id: "aqua-palms-4in1",
    name: "4-in-1 Aqua Palms Combo",
    slug: "4-in-1-aqua-palms-combo",
    category: "bounce-slide-combos",
    price: 209,
    image: aquaPalmsCombo,
  },
  {
    id: "economy-4in1",
    name: "4-in-1 Economy Combo",
    slug: "4-in-1-economy-combo",
    category: "bounce-slide-combos",
    price: 209,
    image: economyCombo,
  },
  {
    id: "green-gush-7in1",
    name: "7-in-1 Green Gush Combo",
    slug: "7-in-1-green-gush-combo",
    category: "bounce-slide-combos",
    price: 259,
    image: greenGushCombo,
  },
  {
    id: "marble-7in1",
    name: "7-in-1 Marble Combo",
    slug: "7-in-1-marble-combo",
    category: "bounce-slide-combos",
    price: 259,
    image: marbleCombo,
  },
  {
    id: "mystic-castle-7in1",
    name: "7-in-1 Mystic Castle Combo",
    slug: "7-in-1-mystic-castle-combo",
    category: "bounce-slide-combos",
    price: 259,
    image: mysticCastleCombo,
  },
  
  // Interactive Games
  {
    id: "sports-3in1",
    name: "3-in-1 Sports Inflatable Game",
    slug: "3-in-1-sports-game",
    category: "interactive-games",
    price: 189,
    image: sportsGame,
  },
  
  // Obstacle Courses
  {
    id: "backyard-obstacle-30",
    name: "30' Backyard Obstacle Course",
    slug: "30-backyard-obstacle-course",
    category: "obstacle-courses",
    price: 259,
    image: backyardObstacle,
  },
  {
    id: "flashpoint-obstacle-46",
    name: "46' Flashpoint Wet/Dry Obstacle Course",
    slug: "46-flashpoint-obstacle-course",
    category: "obstacle-courses",
    price: 389,
    image: flashpointObstacle,
  },
  {
    id: "radioactive-run-53",
    name: "53' Radioactive Run Dual Lane Obstacle Course",
    slug: "53-radioactive-run-obstacle-course",
    category: "obstacle-courses",
    price: 395,
    image: radioactiveRunObstacle,
  },
];

// Helper functions to filter products by category
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter((product) => product.category === category);
};

export const getWaterSlides = (): Product[] => getProductsByCategory("water-slides");
export const getBounceSlidesCombos = (): Product[] => getProductsByCategory("bounce-slide-combos");
export const getInteractiveGames = (): Product[] => getProductsByCategory("interactive-games");
export const getBounceHouses = (): Product[] => getProductsByCategory("bounce-houses");
export const getObstacleCourses = (): Product[] => getProductsByCategory("obstacle-courses");
export const getConcessions = (): Product[] => getProductsByCategory("concessions");
export const getTablesChairs = (): Product[] => getProductsByCategory("tables-chairs");
