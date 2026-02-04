
# Update Primary Booking CTA and Form Copy

## Summary
Update the header CTA button text from "Get a Free Quote" to "Check Availability" and enhance the booking modal with a new heading and subheading.

## Changes Overview

| Location | Current Text | New Text |
|----------|--------------|----------|
| Header desktop CTA | Get a Free Quote | Check Availability |
| Header mobile CTA | Get a Free Quote | Check Availability |
| Modal title | Submit A Booking Request | Check Availability for Your Event Date |
| Modal subheading | (none) | Submit the form below and we'll confirm availability. |

## Implementation Details

### File 1: `src/components/layout/Header.tsx`

**Desktop CTA Button (line 237):**
- Change "Get a Free Quote" to "Check Availability"

**Mobile Menu CTA Button (line 333):**
- Change "Get a Free Quote" to "Check Availability"

### File 2: `src/components/JotformModal.tsx`

**Update DialogHeader section:**
- Change DialogTitle text to "Check Availability for Your Event Date"
- Add a DialogDescription (or styled paragraph) below the title with smaller, lighter text:
  "Submit the form below and we'll confirm availability."

```text
Current structure:
+----------------------------------+
| Submit A Booking Request         |
+----------------------------------+
| [Jotform iframe]                 |
+----------------------------------+

Updated structure:
+------------------------------------------+
| Check Availability for Your Event Date   |  (larger, bold)
| Submit the form below and we'll confirm  |  (smaller, lighter)
| availability.                            |
+------------------------------------------+
| [Jotform iframe]                         |
+------------------------------------------+
```

## Technical Notes

- Import `DialogDescription` from the dialog component for proper accessibility (provides `aria-describedby`)
- Use `text-sm text-muted-foreground` for the subheading to create visual hierarchy
- No changes to form fields, validation, or submission behavior
- No changes to other CTAs elsewhere on the site (Hero section, Sticky button, etc.)
