import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookingFormModal from "@/components/admin/BookingFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function NewReservation() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(true);
  const presetDate = params.get("date");

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="font-display text-2xl md:text-3xl font-bold">New reservation</h1>
      <p className="text-sm text-muted-foreground">
        Add a reservation taken by phone or in person. Save without payment, or record a
        cash/check/external card payment from the booking after saving.
        {presetDate && <> Date pre-filled: <strong>{presetDate}</strong></>}
      </p>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-1" /> Open form
      </Button>
      <BookingFormModal
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) navigate("/admin/bookings");
        }}
        booking={presetDate ? ({ event_date: presetDate } as any) : null}
        onSaved={() => navigate("/admin/bookings")}
      />
    </div>
  );
}
