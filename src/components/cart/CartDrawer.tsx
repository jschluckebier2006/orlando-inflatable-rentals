import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function CartDrawer() {
  const { items, total, removeItem, isCartOpen, setCartOpen, openCheckout } = useCart();
  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display">Your Cart</SheetTitle>
          <SheetDescription>
            Add as many items as you'd like. We'll check availability for your event date at checkout.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 my-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Your cart is empty.</p>
              <p className="text-sm mt-1">Browse our rentals and tap "Add to Cart".</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                  <img src={it.image} alt={it.name} className="w-16 h-16 object-contain bg-muted/30 rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{it.name}</p>
                    <p className="text-sm text-muted-foreground">${it.price} / day</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeItem(it.id)} aria-label={`Remove ${it.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal (per day)</span>
              <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
            </div>
            <Button onClick={openCheckout} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" size="lg">
              Check Availability & Reserve
            </Button>
            <p className="text-xs text-muted-foreground text-center">No payment now — we'll confirm by phone.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
