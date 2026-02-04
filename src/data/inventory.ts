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
import firestormFallsSlide from "@/assets/inventory/24ft-firestorm-falls-water-slide.webp";
import reggaeRushSlide from "@/assets/inventory/25ft-reggae-rush-water-slide.webp";
import insaneHurricaneSlide from "@/assets/inventory/27ft-insane-hurricane-water-slide.webp";
import backyardObstacle from "@/assets/inventory/30ft-backyard-obstacle-course.webp";
import flashpointObstacle from "@/assets/inventory/46ft-flashpoint-obstacle-course.webp";
import radioactiveRunObstacle from "@/assets/inventory/53ft-radioactive-run-obstacle-course.webp";
// New imports
import bubbleMachine from "@/assets/inventory/bubble-machine.webp";
import dunkTank from "@/assets/inventory/carnival-dunk-tank.webp";
import cottonCandyMachine from "@/assets/inventory/cotton-candy-machine.webp";
import dinosaurRaptorBounce from "@/assets/inventory/dinosaur-raptor-bounce-house.webp";
import disneyPrincessBounce from "@/assets/inventory/disney-princess-bounce-house.webp";
import whiteFoldingChair from "@/assets/inventory/white-folding-chair.webp";
import fullCourtPressGame from "@/assets/inventory/full-court-press-game.webp";
import lavaRaptorCombo from "@/assets/inventory/lava-raptor-combo.webp";
import popcornMachine from "@/assets/inventory/popcorn-machine.webp";
import kidsPicnicTable from "@/assets/inventory/kids-picnic-table.webp";
// Final batch imports
import powerGenerator from "@/assets/inventory/power-generator.webp";
import primaryColorBounce from "@/assets/inventory/primary-color-bounce-house.webp";
import snoKoneMachine from "@/assets/inventory/sno-kone-machine.webp";
import southBeachCombo from "@/assets/inventory/south-beach-combo.webp";
import summerSplashSlide from "@/assets/inventory/summer-splash-water-slide.webp";
import whiteFoldingTable from "@/assets/inventory/white-folding-table.webp";
import tropicalCrushCombo from "@/assets/inventory/tropical-crush-combo.webp";
import wreckingBallGame from "@/assets/inventory/wrecking-ball-game.webp";
import unicornCombo from "@/assets/inventory/unicorn-7-in-1-combo.webp";

export const products: Product[] = [
  // Water Slides
  {
    id: "tropic-shock-15",
    name: "15' Tropic Shock Dual Lane Water Slide",
    slug: "15-tropic-shock-water-slide",
    category: "water-slides",
    price: 259,
    image: tropicShockSlide,
    size: "30'L x 17'W x 15'H",
  },
  {
    id: "lava-falls-17",
    name: "17' Lava Falls Dual Lane Water Slide",
    slug: "17-lava-falls-water-slide",
    category: "water-slides",
    price: 299,
    image: lavaFallsSlide,
    size: "32'L x 16'W x 17'H",
  },
  {
    id: "tiki-plunge-18",
    name: "18' Tiki Plunge Dual Lane Water Slide",
    slug: "18-tiki-plunge-water-slide",
    category: "water-slides",
    price: 309,
    image: tikiPlungeSlide,
    size: "32'L x 16'W x 18'H",
  },
  {
    id: "island-drop-18",
    name: "18' Island Drop Dual Lane Water Slide",
    slug: "18-island-drop-water-slide",
    category: "water-slides",
    price: 319,
    image: islandDropSlide,
    size: "32'L x 16'W x 18'H",
  },
  {
    id: "purple-hurricane-18",
    name: "18' Purple Hurricane Single Lane Water Slide",
    slug: "18-purple-hurricane-water-slide",
    category: "water-slides",
    price: 279,
    image: purpleHurricaneSlide,
    size: "32'L x 13'W x 18'H",
  },
  {
    id: "baja-hybrid-20",
    name: "20' Baja Hybrid Water Slide",
    slug: "20-baja-hybrid-water-slide",
    category: "water-slides",
    price: 369,
    image: bajaHybridSlide,
    size: "38'L x 17'W x 20'H",
  },
  {
    id: "goombay-splash-20",
    name: "20' Goombay Splash Dual Lane Water Slide",
    slug: "20-goombay-splash-water-slide",
    category: "water-slides",
    price: 369,
    image: goombaySplashSlide,
    size: "38'L x 18'W x 20'H",
  },
  {
    id: "paradise-falls-20",
    name: "20' Paradise Falls Water Slide",
    slug: "20-paradise-falls-water-slide",
    category: "water-slides",
    price: 369,
    image: paradiseFallsSlide,
    size: "38'L x 17'W x 20'H",
  },
  {
    id: "toxic-21",
    name: "21' Toxic Dual Lane Water Slide",
    slug: "21-toxic-water-slide",
    category: "water-slides",
    price: 399,
    image: toxicSlide,
    size: "38'L x 18'W x 21'H",
  },
  {
    id: "firestorm-falls-24",
    name: "24' Firestorm Falls Dual Lane Water Slide",
    slug: "24-firestorm-falls-water-slide",
    category: "water-slides",
    price: 509,
    image: firestormFallsSlide,
    size: "63'L x 23'W x 24'H",
  },
  {
    id: "reggae-rush-25",
    name: "25' Reggae Rush Dual Lane Water Slide",
    slug: "25-reggae-rush-water-slide",
    category: "water-slides",
    price: 559,
    image: reggaeRushSlide,
    size: "70'L x 20'W x 25'H",
  },
  {
    id: "insane-hurricane-27",
    name: "27' Insane Hurricane Water Slide",
    slug: "27-insane-hurricane-water-slide",
    category: "water-slides",
    price: 599,
    image: insaneHurricaneSlide,
    size: "70'L x 20'W x 27'H",
  },
  
  // Bounce & Slide Combos
  {
    id: "aqua-palms-4in1",
    name: "4-in-1 Aqua Palms Combo",
    slug: "4-in-1-aqua-palms-combo",
    category: "bounce-slide-combos",
    price: 209,
    image: aquaPalmsCombo,
    size: "30'L x 14'W x 14'H",
  },
  {
    id: "economy-4in1",
    name: "4-in-1 Economy Combo",
    slug: "4-in-1-economy-combo",
    category: "bounce-slide-combos",
    price: 209,
    image: economyCombo,
    size: "30'L x 14'W x 14'H",
  },
  {
    id: "green-gush-7in1",
    name: "7-in-1 Green Gush Combo",
    slug: "7-in-1-green-gush-combo",
    category: "bounce-slide-combos",
    price: 259,
    image: greenGushCombo,
    size: "32'L x 15'W x 15'H",
  },
  {
    id: "marble-7in1",
    name: "7-in-1 Marble Combo",
    slug: "7-in-1-marble-combo",
    category: "bounce-slide-combos",
    price: 259,
    image: marbleCombo,
    size: "32'L x 15'W x 15'H",
  },
  {
    id: "mystic-castle-7in1",
    name: "7-in-1 Mystic Castle Combo",
    slug: "7-in-1-mystic-castle-combo",
    category: "bounce-slide-combos",
    price: 259,
    image: mysticCastleCombo,
    size: "32'L x 15'W x 15'H",
  },
  
  // Interactive Games
  {
    id: "sports-3in1",
    name: "3-in-1 Sports Inflatable Game",
    slug: "3-in-1-sports-game",
    category: "interactive-games",
    price: 189,
    image: sportsGame,
    size: "12'L x 12'W x 8'H",
  },
  
  // Obstacle Courses
  {
    id: "backyard-obstacle-30",
    name: "30' Backyard Obstacle Course",
    slug: "30-backyard-obstacle-course",
    category: "obstacle-courses",
    price: 259,
    image: backyardObstacle,
    size: "30'L x 12'W x 12'H",
  },
  {
    id: "flashpoint-obstacle-46",
    name: "46' Flashpoint Wet/Dry Obstacle Course",
    slug: "46-flashpoint-obstacle-course",
    category: "obstacle-courses",
    price: 389,
    image: flashpointObstacle,
    size: "46'L x 12'W x 14'H",
  },
  {
    id: "radioactive-run-53",
    name: "53' Radioactive Run Dual Lane Obstacle Course",
    slug: "53-radioactive-run-obstacle-course",
    category: "obstacle-courses",
    price: 395,
    image: radioactiveRunObstacle,
    size: "53'L x 24'W x 16'H",
  },
  
  // Bounce Houses
  {
    id: "dinosaur-raptor-bounce",
    name: "Dinosaur Raptor Bounce House",
    slug: "dinosaur-raptor-bounce-house",
    category: "bounce-houses",
    price: 149,
    image: dinosaurRaptorBounce,
    size: "15'L x 15'W x 15'H",
  },
  {
    id: "disney-princess-bounce",
    name: "Disney Princess Bounce House",
    slug: "disney-princess-bounce-house",
    category: "bounce-houses",
    price: 139,
    image: disneyPrincessBounce,
    size: "13'L x 13'W x 13'H",
  },
  
  // Interactive Games (additional)
  {
    id: "carnival-dunk-tank",
    name: "Carnival Dunk Tank",
    slug: "carnival-dunk-tank",
    category: "interactive-games",
    price: 229,
    image: dunkTank,
    size: "8'L x 8'W x 8'H",
  },
  {
    id: "full-court-press",
    name: "Full Court Press Basketball Game",
    slug: "full-court-press-game",
    category: "interactive-games",
    price: 199,
    image: fullCourtPressGame,
    size: "14'L x 12'W x 10'H",
  },
  
  // Bounce & Slide Combos (additional)
  {
    id: "lava-raptor-combo",
    name: "Lava Raptor 4-in-1 Wet/Dry Combo",
    slug: "lava-raptor-combo",
    category: "bounce-slide-combos",
    price: 219,
    image: lavaRaptorCombo,
    size: "30'L x 14'W x 14'H",
  },
  {
    id: "unicorn-7in1",
    name: "Unicorn 7-in-1 Combo",
    slug: "unicorn-7-in-1-combo",
    category: "bounce-slide-combos",
    price: 209,
    image: unicornCombo,
    size: "32'L x 15'W x 15'H",
  },
  
  // Concessions
  {
    id: "bubble-machine",
    name: "Bubble Machine",
    slug: "bubble-machine",
    category: "concessions",
    price: 25,
    image: bubbleMachine,
    size: "Tabletop Unit",
  },
  {
    id: "cotton-candy-machine",
    name: "Cotton Candy Machine",
    slug: "cotton-candy-machine",
    category: "concessions",
    price: 65,
    image: cottonCandyMachine,
    size: "20\"W x 20\"D x 36\"H",
  },
  {
    id: "popcorn-machine",
    name: "Popcorn Machine",
    slug: "popcorn-machine",
    category: "concessions",
    price: 65,
    image: popcornMachine,
    size: "20\"W x 18\"D x 30\"H",
  },
  
  // Tables & Chairs
  {
    id: "white-folding-chair",
    name: "White Folding Chair",
    slug: "white-folding-chair",
    category: "tables-chairs",
    price: 1.75,
    image: whiteFoldingChair,
    size: "18\"W x 20\"D x 32\"H",
  },
  {
    id: "kids-picnic-table",
    name: "Kids' Picnic Table",
    slug: "kids-picnic-table",
    category: "tables-chairs",
    price: 10,
    image: kidsPicnicTable,
    size: "4'L x 3'W x 22\"H",
  },
  {
    id: "white-folding-table",
    name: "White Folding Table",
    slug: "white-folding-table",
    category: "tables-chairs",
    price: 7,
    image: whiteFoldingTable,
    size: "6'L x 30\"W x 30\"H",
  },
  
  // Final batch - Water Slides
  {
    id: "summer-splash-water-slide",
    name: "Summer Splash Water Slide",
    slug: "summer-splash-water-slide",
    category: "water-slides",
    price: 239,
    image: summerSplashSlide,
    size: "30'L x 16'W x 14'H",
  },
  
  // Final batch - Bounce Houses
  {
    id: "primary-color-bounce",
    name: "Primary Color Bounce House",
    slug: "primary-color-bounce-house",
    category: "bounce-houses",
    price: 139,
    image: primaryColorBounce,
    size: "13'L x 13'W x 13'H",
  },
  
  // Final batch - Bounce/Slide Combos
  {
    id: "south-beach-combo",
    name: "South Beach 7-in-1 Combo",
    slug: "south-beach-combo",
    category: "bounce-slide-combos",
    price: 269,
    image: southBeachCombo,
    size: "32'L x 15'W x 15'H",
  },
  {
    id: "tropical-crush-combo",
    name: "Tropical Crush 7-in-1 Combo",
    slug: "tropical-crush-combo",
    category: "bounce-slide-combos",
    price: 269,
    image: tropicalCrushCombo,
    size: "32'L x 15'W x 15'H",
  },
  
  // Final batch - Interactive Games
  {
    id: "wrecking-ball-game",
    name: "Wrecking Ball Game",
    slug: "wrecking-ball-game",
    category: "interactive-games",
    price: 249,
    image: wreckingBallGame,
    size: "29'L x 29'W x 17'H",
  },
  
  // Final batch - Concessions
  {
    id: "sno-kone-machine",
    name: "Sno-Kone Machine",
    slug: "sno-kone-machine",
    category: "concessions",
    price: 65,
    image: snoKoneMachine,
    size: "18\"W x 18\"D x 24\"H",
  },
  {
    id: "power-generator",
    name: "Power Generator",
    slug: "power-generator",
    category: "concessions",
    price: 125,
    image: powerGenerator,
    size: "24\"L x 20\"W x 22\"H",
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
