

# Add Google Analytics to All Pages

## Summary
Insert the Google Analytics 4 (gtag.js) tracking code into the `<head>` section of `index.html` to enable analytics tracking across all pages of the website.

## Changes

**File:** `index.html`

**Add after line 7 (after the author meta tag, before closing `</head>`):**

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CSD46XS8PZ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-CSD46XS8PZ');
</script>
```

**Resulting `<head>` section:**
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  <meta name="author" content="Orlando Inflatables LLC" />
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-CSD46XS8PZ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-CSD46XS8PZ');
  </script>
</head>
```

## Notes
- The `async` attribute ensures the script doesn't block page rendering
- This single change applies to all pages since `index.html` is the entry point for the React SPA
- Tracking ID `G-CSD46XS8PZ` will be configured as specified

