import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { products, type ProductCategory } from "@/data/inventory";

// Get category display name
const getCategoryLabel = (category: ProductCategory): string => {
  const labels: Record<ProductCategory, string> = {
    "water-slides": "Water Slide",
    "bounce-slide-combos": "Bounce & Slide Combo",
    "interactive-games": "Interactive Game",
    "bounce-houses": "Bounce House",
    "obstacle-courses": "Obstacle Course",
    "concessions": "Concession",
    "tables-chairs": "Tables & Chairs"
  };
  return labels[category];
};

// Get category link
const getCategoryLink = (category: ProductCategory): string => {
  const links: Record<ProductCategory, string> = {
    "water-slides": "/water-slide-rentals",
    "bounce-slide-combos": "/bounce-slide-combo-rentals",
    "interactive-games": "/interactive-game-rentals",
    "bounce-houses": "/bounce-house-rentals",
    "obstacle-courses": "/obstacle-course-rentals",
    "concessions": "/concession-rentals",
    "tables-chairs": "/table-chair-rentals"
  };
  return links[category];
};
export function PopularRentalsSection() {
  // Get a mix of popular items from different categories
  const popularItems = products.filter(p => !["concessions", "tables-chairs"].includes(p.category)).slice(0, 16);
  return;
}