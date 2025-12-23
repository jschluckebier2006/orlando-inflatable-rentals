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
