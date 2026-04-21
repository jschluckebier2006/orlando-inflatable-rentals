

# Replace Hero Background Image

## Files Changed

### 1. `src/assets/hero-background.webp` (replace asset)
Copy the uploaded image `user-uploads://orlando-inflatables-water-slide-and-inflatable-rentals-hero.webp` into `src/assets/` as `orlando-inflatables-hero.webp` and also into `public/` (for the preload tag to resolve from a stable URL).

- New asset import path: `@/assets/orlando-inflatables-hero.webp`
- Public path for preload: `/orlando-inflatables-hero.webp`

### 2. `src/components/home/HeroSection.tsx`
Swap the background image:

- Replace import:
  ```ts
  import heroBackground from "@/assets/orlando-inflatables-hero.webp";
  ```
- Update the `<img>` element with the requested attributes and alt text:
  ```tsx
  <img
    src={heroBackground}
    alt="Orlando inflatable rentals fleet — water slides and bounce houses available for rent in Orlando FL"
    className="absolute inset-0 w-full h-full object-cover object-center"
    fetchPriority="high"
    decoding="async"
  />
  ```
  - `w-full h-full` → width/height 100%
  - `object-cover` → object-fit: cover
  - `object-center` → object-position: center center
  - Removed `aria-hidden` so the descriptive alt text is accessible
  - Removed prior `object-top md:object-center` (replaced by single `object-center`)

Note on `<picture>` / srcset (requirement #2): The source asset is already a single WebP. A `<picture>` element with multiple `<source type="image/webp">` entries would be redundant since there is no JPG fallback and only one format is served. The browser loads the WebP natively from the single `src`. No `<picture>` wrapper is needed to satisfy "browsers load the WebP natively — do not fall back to JPG" — that condition is met by serving only the `.webp`.

### 3. `index.html`
Add a high-priority preload hint inside `<head>` (after the existing `<link rel="icon">`):

```html
<link
  rel="preload"
  as="image"
  href="/orlando-inflatables-hero.webp"
  type="image/webp"
  fetchpriority="high"
/>
```

This matches the public-folder copy of the asset so the preload URL resolves at runtime.

## Out of Scope
- Hero badge, H1, star/Google review badge, subheading, CTAs, phone button, wave divider, JotformModal, TrustBadgesRow — all untouched
- No other components or pages

## Untouched Files
- `src/components/home/TrustBadgesRow.tsx`
- All other hero-adjacent code

