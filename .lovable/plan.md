
# Replace Hero Video with Water Slide Photo

## Summary
Replace the homepage hero section's video background with the uploaded water slide photo, optimized for mobile viewing.

## Current vs. New

| Element | Current | New |
|---------|---------|-----|
| Background | Video (`/videos/hero-background.mov`) | Static image (water slide lineup) |
| Mobile optimization | Video (heavier load) | Image with mobile-friendly positioning |
| Performance | Higher bandwidth usage | Faster load, better for mobile |

## Implementation Details

### Step 1: Copy Image to Project
- Copy from: `user-uploads://orlando_inflatables_water_slide_line_up_header.webp`
- Copy to: `src/assets/hero-background.webp`

### Step 2: Update HeroSection Component

**File:** `src/components/home/HeroSection.tsx`

**Changes:**
1. Add import for the new hero background image
2. Replace the `<video>` element with an `<img>` element
3. Apply mobile-optimized styling:
   - Use `object-cover` to fill the container
   - Use `object-position` to focus on the water slides (center-top) on mobile, and center on desktop
   - The water slides are in the upper portion of the image, so on mobile we'll position to show the slides prominently

**Updated Background Code:**
```tsx
// Import at top of file
import heroBackground from "@/assets/hero-background.webp";

// Replace video element with:
<img
  src={heroBackground}
  alt=""
  aria-hidden="true"
  className="absolute inset-0 w-full h-full object-cover object-top md:object-center"
/>
```

**Mobile Optimization:**
- `object-top` on mobile ensures the colorful water slides (upper portion) are visible
- `md:object-center` on desktop shows the full balanced composition
- The image naturally has the water slides in the upper 2/3, with green grass below - perfect for cropping on mobile

### Visual Result

**Mobile View:**
- Water slides prominently displayed (focused on top of image)
- Text overlay remains readable with existing dark overlay
- Faster page load compared to video

**Desktop View:**
- Full panoramic view of water slide lineup
- Green grass and blue sky create nice framing
- Same visual impact as before, but with actual product showcase

## Notes
- The existing dark overlay (`bg-black/50`) will still be applied over the image for text readability
- No changes to text content, CTA buttons, or other hero section elements
- The `.webp` format provides excellent compression for fast mobile loading
