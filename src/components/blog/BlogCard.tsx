import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  category: string;
}

export function BlogCard({ title, excerpt, slug, image, category }: BlogCardProps) {
  return (
    <Link to={`/blog/${slug}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 group">
        <div className="aspect-video overflow-hidden bg-muted">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-6">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            {category}
          </span>
          <h3 className="text-lg font-bold mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
