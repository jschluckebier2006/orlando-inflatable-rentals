
# Update All "Get a Free Quote" Buttons to "Check Availability"

## Summary
Change the display text of all CTA buttons across the website from "Get a Free Quote" to "Check Availability" for consistency with the previously updated header buttons.

## Files to Update

| File | Line(s) | Current Text | New Text |
|------|---------|--------------|----------|
| `src/components/home/HeroSection.tsx` | 51 | Get a Free Quote | Check Availability |
| `src/components/home/CTASection.tsx` | 25 | Get a Free Quote | Check Availability |
| `src/components/templates/CityServicePage.tsx` | 114, 480 | Get a Free Quote | Check Availability |
| `src/components/templates/CityDeliveryPage.tsx` | Multiple | Get a Free Quote | Check Availability |
| `src/pages/BounceHouseRentals.tsx` | ~75 | Get a Free Quote | Check Availability |
| `src/pages/BounceSlideComboRentals.tsx` | 75 | Get a Free Quote | Check Availability |
| `src/pages/WaterSlideRentals.tsx` | 71 | Get a Free Quote | Check Availability |
| `src/pages/ObstacleCourseRentals.tsx` | 75 | Get a Free Quote | Check Availability |
| `src/pages/InteractiveGameRentals.tsx` | 75 | Get a Free Quote | Check Availability |
| `src/pages/ConcessionRentals.tsx` | 75 | Get a Free Quote | Check Availability |
| `src/pages/TableChairRentals.tsx` | 75 | Get a Free Quote | Check Availability |
| `src/pages/events/BirthdayParties.tsx` | 174 | Get a Free Quote | Check Availability |
| `src/pages/events/GraduationEvents.tsx` | 184 | Get a Free Quote | Check Availability |
| `src/pages/delivery/Alafaya.tsx` | 274 | Get a Free Quote Today | Check Availability |
| `src/pages/delivery/AvalonPark.tsx` | 274 | Get a Free Quote Today | Check Availability |
| `src/pages/delivery/AzaleaPark.tsx` | 277 | Get a Free Quote Today | Check Availability |
| `src/pages/delivery/Bithlo.tsx` | 246 | Get a Free Quote Today | Check Availability |
| `src/pages/delivery/Christmas.tsx` | ~246 | Get a Free Quote Today | Check Availability |
| `src/pages/delivery/Chuluota.tsx` | ~274 | Get a Free Quote Today | Check Availability |
| `src/pages/delivery/Eastwood.tsx` | 274 | Get a Free Quote Today | Check Availability |
| `src/pages/delivery/Stoneybrook.tsx` | 274 | Get a Free Quote Today | Check Availability |
| `src/pages/delivery/WaterfordLakes.tsx` | ~274 | Get a Free Quote Today | Check Availability |
| `src/pages/delivery/Wedgefield.tsx` | 246 | Get a Free Quote Today | Check Availability |

## Exclusions (No Changes)

The following occurrences will **NOT** be changed as they are descriptive text in SEO metadata, not button labels:

- `src/pages/Contact.tsx` - SEO title text
- `src/pages/events/ChurchEvents.tsx` - SEO description text
- `src/pages/events/SchoolEvents.tsx` - SEO description text
- `src/pages/events/CorporateEvents.tsx` - SEO description text
- `src/components/home/CTASection.tsx` line 17 - Paragraph text ("Get a free quote today and let us help...")

## Implementation

For each file, the button text will be updated from:
```tsx
Get a Free Quote
// or
Get a Free Quote Today
```

To:
```tsx
Check Availability
```

All button styling, behavior, and functionality will remain unchanged - only the display text is updated.

## Result
All CTA buttons across the site will display "Check Availability" consistently, matching the header buttons that were previously updated.
