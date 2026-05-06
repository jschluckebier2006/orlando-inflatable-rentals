import { Helmet } from "@dr.pogodin/react-helmet";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  datePublished?: string;
  dateModified?: string;
  schemaJson?: object | object[];
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noindex = false,
  datePublished,
  dateModified,
  schemaJson,
}: SEOHeadProps) {
  const siteName = "Orlando Inflatables";
  const baseUrl = "https://orlandoinflatables.com";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonicalUrl = `${baseUrl}${canonical}`;
  
  // Default OG image - use a real image from assets
  const defaultOgImage = "/og-image.jpg";
  const ogImageUrl = ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}${defaultOgImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:site" content="@orlandoinflata1" />
      
      {/* OG image dimensions */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${siteName} - ${title}`} />

      {/* Article dates for blog posts */}
      {datePublished && <meta property="article:published_time" content={datePublished} />}
      {dateModified && <meta property="article:modified_time" content={dateModified} />}
      
      {/* Local SEO geo tags */}
      <meta name="geo.region" content="US-FL" />
      <meta name="geo.placename" content="Orlando" />
      <meta name="geo.position" content="28.5383;-81.3792" />
      <meta name="ICBM" content="28.5383, -81.3792" />
      
      {/* Custom Schema JSON-LD */}
      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
}
