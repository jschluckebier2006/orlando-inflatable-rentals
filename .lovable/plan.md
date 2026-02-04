
# Replace 24' Firestorm Falls Product Image

## Summary
Replace the current product image for the 24' Firestorm Falls Dual Lane Water Slide with the new uploaded photo.

## Current Setup

The product in `src/data/inventory.ts` references:
```typescript
import firestormFallsSlide from "@/assets/inventory/24ft-firestorm-falls-water-slide.webp";
```

## Implementation

### Step 1: Replace Product Image
Copy the new uploaded image to overwrite the existing file:
- **From:** `user-uploads://24_firestorm_falls_dual_lane_water_slide.webp`
- **To:** `src/assets/inventory/24ft-firestorm-falls-water-slide.webp`

No code changes are needed - the import path remains the same, so the new image will automatically display everywhere the product appears.

## Result
After replacing the image file, the new photo will automatically appear on:
- Water Slide Rentals page (where you are now)
- Homepage water slides carousel
- Any city-specific water slide pages

The new image shows a better angle of the Firestorm Falls water slide with the full length visible including the splash pool.
