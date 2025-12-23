import { ReactNode } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { CTASection } from "@/components/home/CTASection";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BlogPostLayoutProps {
  title: string;
  metaDescription: string;
  heroImage: string;
  category: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  children: ReactNode;
}

export function BlogPostLayout({ 
  title, 
  metaDescription, 
  heroImage, 
  category,
  slug,
  datePublished,
  dateModified,
  children 
}: BlogPostLayoutProps) {
  const canonicalPath = `/blog/${slug}`;
  
  return (
    <Layout>
      <SEOHead
        title={`${title} | Orlando Inflatable Rentals Blog`}
        description={metaDescription}
        canonical={canonicalPath}
        ogType="article"
        datePublished={datePublished}
        dateModified={dateModified}
      />
      <ArticleSchema
        title={title}
        description={metaDescription}
        datePublished={datePublished}
        dateModified={dateModified}
        image={heroImage}
        url={canonicalPath}
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", href: "/blog" },
          { name: category, href: canonicalPath }
        ]}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/50 py-3">
        <div className="container-page">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/blog" className="hover:text-primary">Blog</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground">{category}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={heroImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Content */}
      <article className="container-page py-12">
        <div className="max-w-4xl mx-auto">
          <span className="text-primary font-semibold uppercase tracking-wide text-sm">
            {category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-8">
            {title}
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert 
            prose-headings:font-bold prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-ul:text-muted-foreground prose-ol:text-muted-foreground
            prose-li:marker:text-primary">
            {children}
          </div>
        </div>
      </article>

      <ReviewsSection />
      <CTASection />
    </Layout>
  );
}
