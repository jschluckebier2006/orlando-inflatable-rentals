interface ContentImageWithTextProps {
  src: string;
  alt: string;
  imagePosition?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  /** When true, treats image as LCP candidate — eager load + high priority. Default lazy. */
  priority?: boolean;
}

export function ContentImageWithText({ 
  src, 
  alt, 
  imagePosition = "right",
  children,
  className = "",
  priority = false,
}: ContentImageWithTextProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 my-12 items-center ${className}`}>
      {imagePosition === "left" && (
        <div className="rounded-xl overflow-hidden shadow-lg order-1 lg:order-1">
          <img
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="w-full h-64 md:h-80 object-cover object-center"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            {...(priority ? { fetchPriority: "high" as const } : {})}
          />
        </div>
      )}
      <div className={`${imagePosition === "left" ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}>
        {children}
      </div>
      {imagePosition === "right" && (
        <div className="rounded-xl overflow-hidden shadow-lg order-1 lg:order-2">
          <img
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="w-full h-64 md:h-80 object-cover object-center"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            {...(priority ? { fetchPriority: "high" as const } : {})}
          />
        </div>
      )}
    </div>
  );
}
