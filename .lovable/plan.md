
# Add Unicorn Combo to Inventory

## Summary
Add a new "Unicorn 7-in-1 Combo" bounce and slide combo to the inventory at the $209 price point.

## What You Need to Do First
**Upload the product image:**
1. Get your product image for the Unicorn Combo
2. Convert it to `.webp` format (you can use free tools like squoosh.app)
3. Name the file: `unicorn-7-in-1-combo.webp`
4. Upload it to the `src/assets/inventory/` folder in your project

## What I'll Implement

### 1. Add Image Import
Add an import statement at the top of `src/data/inventory.ts`:
```typescript
import unicornCombo from "@/assets/inventory/unicorn-7-in-1-combo.webp";
```

### 2. Add Product Entry
Add the new combo to the products array in the Bounce & Slide Combos section:

| Field | Value |
|-------|-------|
| **ID** | `unicorn-7in1` |
| **Name** | Unicorn 7-in-1 Combo |
| **Slug** | `unicorn-7-in-1-combo` |
| **Category** | `bounce-slide-combos` |
| **Price** | $209 |
| **Size** | 32'L x 15'W x 15'H (standard 7-in-1 dimensions) |

## Result
Once implemented, the Unicorn Combo will automatically appear on:
- The Bounce & Slide Combo Rentals page (where you are now)
- The homepage category carousel
- Any other pages that display combo products

## Next Step
**Please upload the image first**, then approve this plan to add the product entry!
