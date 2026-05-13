import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, RotateCcw } from "lucide-react";

interface BookingItemLite {
  id: string;
  product_name: string;
}

export interface CancelledBookingRow {
  id: string;
  customer_name: string;
  customer_email: string;
  event_date: string;
  event_end_date?: string | null;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
  amount_paid?: number | null;
  total_amount?: number | null;
  product_name?: string | null;
  booking_items?: BookingItemLite[];
}

export default function CancelledBookingsTable({
  rows,
  onRestore,
  onView,
}: {
  rows: CancelledBookingRow[];
  onRestore: (b: CancelledBookingRow) => void;
  onView: (b: CancelledBookingRow) => void;
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Event date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Cancelled</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No cancelled bookings.
              </TableCell>
            </TableRow>
          ) : rows.map((b) => {
            const items =
              b.booking_items && b.booking_items.length > 0
                ? b.booking_items.map((it) => it.product_name).join(", ")
                : b.product_name ?? "—";
            const reason = b.cancel_reason?.trim() || "—";
            return (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="font-medium">{b.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{b.customer_email}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {format(new Date(b.event_date + "T12:00:00"), "MMM d, yyyy")}
                  {b.event_end_date && b.event_end_date !== b.event_date && (
                    <div className="text-xs text-muted-foreground">
                      → {format(new Date(b.event_end_date + "T12:00:00"), "MMM d, yyyy")}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm">{items}</TableCell>
                <TableCell className="text-xs whitespace-nowrap">
                  ${Number(b.amount_paid ?? 0).toFixed(2)}
                  {b.total_amount != null && (
                    <span className="text-muted-foreground"> / ${Number(b.total_amount).toFixed(2)}</span>
                  )}
                </TableCell>
                <TableCell className="text-xs whitespace-nowrap">
                  {b.cancelled_at
                    ? format(new Date(b.cancelled_at), "MMM d, yyyy")
                    : "—"}
                </TableCell>
                <TableCell className="text-sm max-w-[14rem]">
                  <span className="line-clamp-2" title={reason}>{reason}</span>
                </TableCell>
                <TableCell className="text-right space-x-1 whitespace-nowrap">
                  <Button size="sm" variant="outline" onClick={() => onView(b)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button size="sm" onClick={() => onRestore(b)}>
                    <RotateCcw className="h-3 w-3 mr-1" /> Restore
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}