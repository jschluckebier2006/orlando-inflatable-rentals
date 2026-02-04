
# Add 24' Firestorm Falls Dual Lane Water Slide to Inventory

## Summary
Add the new "24' Firestorm Falls Dual Lane Water Slide" to your water slide inventory. You've provided all the details and uploaded the product image.

## Product Details

| Field | Value |
|-------|-------|
| **Name** | 24' Firestorm Falls Dual Lane Water Slide |
| **ID** | `firestorm-falls-24` |
| **Slug** | `24-firestorm-falls-water-slide` |
| **Category** | `water-slides` |
| **Price** | $509 |
| **Size** | 63'L x 23'W x 24'H |

## Implementation Steps

### 1. Copy Product Image
Copy the uploaded image to the inventory assets folder:
- From: `user-uploads://Firestorm_Falls_24_Dual_Lane_Water_Slide.webp`
- To: `src/assets/inventory/24ft-firestorm-falls-water-slide.webp`

### 2. Update Inventory Data
Modify `src/data/inventory.ts`:

**Add import statement** (with other water slide imports):
```typescript
import firestormFallsSlide from "@/assets/inventory/24ft-firestorm-falls-water-slide.webp";
```

**Add product entry** in the Water Slides section (positioned between the 21' Toxic and 25' Reggae Rush based on height):
```typescript
{
  id: "firestorm-falls-24",
  name: "24' Firestorm Falls Dual Lane Water Slide",
  slug: "24-firestorm-falls-water-slide",
  category: "water-slides",
  price: 509,
  image: firestormFallsSlide,
  size: "63'L x 23'W x 24'H",
},
```

## Result
Once implemented, the Firestorm Falls water slide will automatically appear on:
- The Water Slide Rentals page (where you are now)
- The homepage water slides carousel
- Any city-specific water slide pages

This will be your second-tallest water slide (after the 27' Insane Hurricane) and a great mid-premium option between the 21' Toxic ($399) and the 25' Reggae Rush ($559).
