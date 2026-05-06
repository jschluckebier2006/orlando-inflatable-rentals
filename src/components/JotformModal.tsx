// Compatibility shim: legacy "Check Availability" buttons now open the cart-based checkout.
// We sync the global checkout dialog state with the local prop the legacy callers pass in.
import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

interface JotformModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JotformModal({ open, onOpenChange }: JotformModalProps) {
  const { setCheckoutOpen, isCheckoutOpen } = useCart();

  useEffect(() => {
    if (open) setCheckoutOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!isCheckoutOpen && open) onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckoutOpen]);

  return null;
}
