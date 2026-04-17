

# Create /thank-you Page

## Summary
Create a simple thank you page at `/thank-you` that matches the existing site design and displays a confirmation message for form submissions.

## Changes

**1. Create new page component**
- File: `src/pages/ThankYou.tsx`
- Uses `Layout` wrapper for consistent header/footer
- Uses `SEOHead` with `noindex={true}` (form confirmation pages shouldn't be indexed)
- Simple centered message design matching NotFound page styling
- Message: "Thank you for reaching out! We'll be in touch shortly."

**2. Add route to App.tsx**
- Import ThankYou component
- Add route: `<Route path="/thank-you" element={<ThankYou />} />`

## Design
- Centered layout with `flex min-h-screen items-center justify-center`
- Primary heading with `font-display text-4xl font-bold`
- Subtext with muted color
- Optional "Return to Home" link for navigation

## Code Structure
```tsx
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";

export default function ThankYou() {
  return (
    <Layout>
      <SEOHead title="Thank You" noindex={true} />
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Thank you for reaching out! We'll be in touch shortly.
          </p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
    </Layout>
  );
}
```

