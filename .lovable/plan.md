# Service-area wording, schema, and template cleanup

The delivery ZIP logic doesn't change. The table stays at 33 free / 7 call, and no ZIPs get added for Kissimmee, Apopka or Sanford.

## 1. Each city's delivery status, set in one place (template fix)
- Add one shared list of service areas. Each area gets a status:
  - **Free:** Alafaya, Avalon Park, Azalea Park, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, Wedgefield, Orlando, Winter Park
  - **Call or text:** Bithlo, Christmas, Kissimmee, Apopka, Sanford
- Both city-page layouts (the 10 delivery-area pages and the 20 bounce house / water slide city pages) read the status from that list. Any city that isn't on the list defaults to call-or-text, so a new page can never claim free delivery by accident.
- On call-or-text pages, every free-delivery line becomes: "We deliver to [City] — call or text (407) 497-1840 to book your date." The number is tappable as both Call and Text. This covers the search description, the hero line, the "Free Delivery to [City]" card, the built-in FAQs, the "why choose us" bullets and the closing paragraph.
- City search data follows the same status. Call-or-text cities lose "Free delivery, setup, and pickup included" and "Free delivery and setup included".
- All 6 Bithlo and Christmas pages stay live and in the sitemap.
- One unavoidable direct edit: the Bithlo and Christmas delivery pages each have their own FAQ written into the page ("We provide free delivery…", "All prices include free delivery to Bithlo"). Only those sentences get reworded to the call-or-text line; the rest of each page stays unique.

## 2. Outside cities
- Homepage "We serve" line: remove Cocoa and Cocoa Beach, and label Kissimmee, Apopka and Sanford as call or text.
- Homepage reviews heading becomes "…customers across Orlando, Winter Park, Avalon Park, and surrounding areas."
- Search the whole site for any other Cocoa mention and remove it.

## 3. "Central Florida": only next to delivery claims
Three spots change to: free delivery throughout East Orlando and Orange County, then "Outside that area? Call or text us at (407) 497-1840 and we'll take care of you."
- The homepage "We Deliver to Your Area" banner
- The View All Delivery Areas page
- The FAQ coverage answer

Every other "Central Florida" and every "Orange County" stays as is.

**Search-result descriptions:** "Free delivery & setup" in category and event page descriptions (and the matching body text) becomes "Free delivery in most areas". I'll list every page changed in the final report.

## 4. Blog pricing post
- "Delivery remains free within 25+ Central Florida communities" gets rewritten to the new policy. The rest of the post stays the same.

## 5. FAQ
- "A small delivery fee may apply…" is replaced with: delivery and setup are free throughout our service area, and a handful of outlying areas are booked by phone or text at (407) 497-1840.
- In the coverage answer, Bithlo and Christmas move out of the free list and get labeled call or text.

## 6. Street address
- Remove "19621 Knight Tale Ln, Orlando, FL 32833" from the Bounce House Rentals Near Me post.
- Recheck the site, its files and search data for any other copy. The first search found it only in that post. I'll report the result either way.

## 7. Business-wide search data
- Replace "serves Florida" with: Orange County plus every city listed in section 1, including the call-or-text ones. Cocoa and Cocoa Beach are not included. This applies to both the main business listing and the organization listing.

## Final report
Every file changed, grouped as: visible copy, search data, page descriptions, layouts.

## Technical notes
- New file `src/data/serviceAreas.ts` with entries `{ name, slug, status: 'free' | 'call' }` and a `getCityDeliveryStatus(name)` helper that defaults to `'call'`.
- Edits go into `CityServicePage.tsx` and `CityDeliveryPage.tsx`, which branch on that status.
- Schema components (`LocalBusinessSchema`, `ServiceAreaSchema`, `OrganizationSchema`) take the status into account. Their `areaServed` gets built from the list as `City` entries plus `AdministrativeArea` Orange County.
- Also touched: `DeliveryAreasSection.tsx`, `ReviewsSection.tsx`, `FAQ.tsx`, `DeliveryArea.tsx`, the blog post files, the category and event pages' SEO descriptions, and `delivery/Bithlo.tsx` and `delivery/Christmas.tsx` (FAQ sentences only).
- Sitemap and routes stay unchanged.
