import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

// Map event types to relevant blog post slugs
const eventBlogMap: Record<string, string[]> = {
  birthday: [
    "top-3-bounce-house-themes-orlando",
    "toddler-party-safety-bounce-house-rules",
    "elevate-celebration-bounce-house-rental"
  ],
  school: [
    "toddler-party-safety-bounce-house-rules",
    "bounce-house-rental-pricing-orlando-2025",
    "bounce-house-rentals-near-me"
  ],
  church: [
    "elevate-celebration-bounce-house-rental",
    "bounce-house-rentals-near-me",
    "toddler-party-safety-bounce-house-rules"
  ],
  corporate: [
    "corporate-team-building-with-inflatables",
    "bounce-house-rental-pricing-orlando-2025",
    "bounce-house-rentals-near-me"
  ],
  graduation: [
    "elevate-celebration-bounce-house-rental",
    "bounce-house-rental-pricing-orlando-2025",
    "top-3-bounce-house-themes-orlando"
  ]
};

interface RelatedBlogPostsProps {
  eventType: "birthday" | "school" | "church" | "corporate" | "graduation";
}

export function RelatedBlogPosts({ eventType }: RelatedBlogPostsProps) {
  const relatedSlugs = eventBlogMap[eventType] || [];
  const relatedPosts = blogPosts.filter((post) =>
    relatedSlugs.includes(post.slug)
  );

  if (relatedPosts.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container-page">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Helpful Resources</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Related Articles & Guides
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn more about planning your event with these helpful tips and guides.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
              <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-4">
                  <span className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/blog" className="gap-2">
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
