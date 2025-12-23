import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { JotformModal } from "@/components/JotformModal";
import type { Product } from "@/data/inventory";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const [showJotform, setShowJotform] = useState(false);

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => setShowJotform(true)}
          />
        ))}
      </div>
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
