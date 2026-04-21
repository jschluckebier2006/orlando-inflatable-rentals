
# Replace Default Testimonials with 4 Verified Google Reviews

## Summary
Replace the 4 placeholder reviews (Sarah M., Michael T., Jennifer K., David R.) shown on the homepage and other non-city pages with 4 real, verified Google reviews. Update the card design to include an event-type tag and a "Verified Google Review" badge. City-specific reviews and section structure remain untouched.

## Changes

**File:** `src/components/home/ReviewsSection.tsx`

### 1. Update `Review` interface
Add `eventType` field; replace `location`/`date` usage on default cards with event type + verified badge. Keep `location`/`date` optional so existing `cityReviews` data continues to work without changes.

```ts
interface Review {
  name: string;
  rating: number;
  text: string;
  eventType?: string;   // NEW — used by default reviews
  location?: string;    // kept optional for city reviews
  date?: string;        // kept optional for city reviews
}
```

### 2. Replace `defaultReviews` array
Replace the 4 fake entries with the 4 verified Google reviews:

```ts
const defaultReviews: Review[] = [
  { name: "Vishal P.", rating: 5, eventType: "Daughter's Birthday Party",
    text: "Great to deal with from start to finish! I got the 27' slide and man it is BIG! Thank you guys for making my daughter's birthday exciting." },
  { name: "JJ C.", rating: 5, eventType: "Kids Party",
    text: "We got the hurricane water slide. The kids had a blast, Chandler was very professional and on time. I recommend this company!" },
  { name: "Ben P.", rating: 5, eventType: "Backyard Party",
    text: "We rented the Crimson Wave 24' high water slide — BEST party addition ever, enjoyed by both kids and adults. I don't know how we're going to top it next year! These guys are super professional and helpful. Highly recommend." },
  { name: "Adam K.", rating: 5, eventType: "Inflatable Rental",
    text: "I had a great experience with them. Booking was very simple and easy to talk to them on the phone. Chandler was great on delivery and pick up." },
];
```

### 3. Update section header (default state only)
Change H2 from "What Our Customers Say" to **"What Orlando Families Are Saying"** when no `cityName` is provided. City-specific header (e.g. "What Our Waterford Lakes Customers Say") preserved.

Subline (default): "Real reviews from real customers across Orlando, Winter Park, Kissimmee, and surrounding areas."

### 4. Update card design
Each card renders:
- Quote icon (existing)
- Full review text (existing)
- 5 gold stars (existing)
- **Bold reviewer name** (existing — `Vishal P.`, `JJ C.`, etc.)
- **Event-type tag** as a subtle pill below the name (e.g. `bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5`) — only renders if `eventType` exists
- For city reviews (where `eventType` is absent), fall back to the existing `location • date` line so nothing breaks
- **"✓ Verified Google Review"** badge at the bottom of every card — small green/success-toned pill (`bg-success/10 text-success`) with a checkmark icon

Sketch:
```tsx
<div className="mt-3 inline-flex items-center gap-1 text-xs font-medium bg-success/10 text-success rounded-full px-2 py-1">
  <Check className="h-3 w-3" /> Verified Google Review
</div>
```

### 5. Grid layout
Keep existing `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` so all 4 reviews fit on one row at desktop and stack cleanly on mobile.

## Out of Scope
- City-specific reviews in `cityReviews` (untouched — they still drive city pages)
- Hero section, booking modal, rating badge in hero, CTAs
- `AggregateRatingSchema` / `LocalBusinessSchema` (review count of 63 already handled there)
- Any other page or section

## Files Changed
- `src/components/home/ReviewsSection.tsx` — replace `defaultReviews` data, extend `Review` interface, update default-state header copy, redesign card to include event-type tag and "Verified Google Review" badge
