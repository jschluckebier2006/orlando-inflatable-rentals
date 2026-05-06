// Compatibility shim: legacy JotformModal now routes to the native BookingModal.
// All existing imports keep working without changes.
import { BookingModal } from "@/components/booking/BookingModal";

interface JotformModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JotformModal({ open, onOpenChange }: JotformModalProps) {
  return <BookingModal open={open} onOpenChange={onOpenChange} />;
}
