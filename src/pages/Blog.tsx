import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { BlogCard } from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { siteImages } from "@/components/home/ContentImages";
import { CTASection } from "@/components/home/CTASection";

export default function Blog() {
  return (
    <Layout>
      <SEOHead
        title="Blog - Party Tips & Guides"
        description="Read our blog for bounce house rental tips, party planning guides, safety information, and local Orlando insights from Orlando Inflatable Rentals LLC."
        canonical="/blog"
      />
      <BreadcrumbSchema items={[{ name: "Blog", href: "/blog" }]} />

      {/* Hero Section */}
      <section 
        className="relative py-20 md:py-32"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${siteImages.kidsGroupSlide1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our Blog
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Party planning tips, safety guides, and local Orlando insights to help make your next event unforgettable.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                slug={post.slug}
                image={post.image}
                category={post.category}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
}
