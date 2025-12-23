import { siteImages } from "@/components/home/ContentImages";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "bounce-house-rental-pricing-orlando-2025",
    title: "How Much is a Bounce House Rental in Orlando, Florida (2025 Pricing Guide)",
    excerpt: "Bounce house rentals cost $139-$149 for full-day rentals in Orlando, Florida. Orlando Inflatable Rentals LLC provides 6-8 hour rental periods with free delivery, setup, and breakdown included.",
    image: siteImages.kidsGroupBounce1,
    category: "Pricing & Guides"
  },
  {
    slug: "corporate-team-building-with-inflatables",
    title: "Corporate Team Building with Inflatables: Beyond Kids' Parties",
    excerpt: "Corporate team building with inflatables redefines workplace events in Orlando and Central Florida. Businesses use oversized obstacle courses, inflatable games, and slides to foster teamwork.",
    image: siteImages.slideTunnel1,
    category: "Corporate Events"
  },
  {
    slug: "toddler-party-safety-bounce-house-rules",
    title: "Orlando Toddler Party Safety: Bounce House Rules Every Parent Needs",
    excerpt: "Orlando toddler party safety demands strict, evidence-based bounce house rules customized for young children. Clear protocols reduce incidents and create a safer play environment.",
    image: siteImages.toddlerBounce1,
    category: "Safety Tips"
  },
  {
    slug: "top-3-bounce-house-themes-orlando",
    title: "Top 3 Bounce House Themes in Orlando for Kids' Birthday Parties",
    excerpt: "The top 3 bounce house themes in Orlando for kids' birthday parties are Disney Princess, Dinosaur Raptor, and Primary Color bounce houses, delivering themed fun and safe entertainment.",
    image: siteImages.kidsSmilingBounce1,
    category: "Party Ideas"
  },
  {
    slug: "elevate-celebration-bounce-house-rental",
    title: "Elevate Your Next Celebration with the Joy of a Bounce House Rental",
    excerpt: "Hosting a special event can be a whirlwind of planning and preparation, but one element that can truly elevate the experience is the addition of a bounce house rental.",
    image: siteImages.girlsJumping1,
    category: "Party Ideas"
  },
  {
    slug: "bounce-house-rentals-near-me",
    title: "Top Inflatable Bounce House Rentals Near Me",
    excerpt: "There are plenty of top inflatable bounce house rentals near me that can make any event or party rental special. From small backyard gatherings to large corporate events.",
    image: siteImages.kidsBouncHouse1,
    category: "Rental Guide"
  },
  {
    slug: "founding-of-christmas-florida",
    title: "The Founding of Christmas, Florida (1830s-1850s)",
    excerpt: "The origins of Christmas, Florida can be traced back to the Second Seminole War in the 1830s. In December 1837, the U.S. Army established Fort Christmas.",
    image: siteImages.kidsSlide1,
    category: "Local History"
  }
];
