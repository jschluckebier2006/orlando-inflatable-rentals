import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export function CartButton({ className = "" }: { className?: string }) {
  const { count, openCart } = useCart();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={openCart}
      className={`relative ${className}`}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <ShoppingCart className="h-4 w-4 mr-1.5" />
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Button>
  );
}
