import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addDays,
  startOfDay,
} from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Phone, MapPin } from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
type PaymentStatus = "unpaid" | "deposit_paid" | "paid_in_full" | "refunded";

interface BookingItem {
  id: string;
  product_name: string;
  product_price: number;
  unit_price?: number | null;
}

interface Booking {
  id: string;
  product_id: string | null;
  product_name: string | null;
  product_price: number | null;
  event_date: string;
  event_end_date?: string | null;
  duration_type?: "7hour" | "overnight" | "weekend" | null;
  price_multiplier?: number | null;
  event_start_time: string | null;
  event_end_time: string | null;
  event_type: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_address_line: string;
  event_city: string;
  event_zip: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  payment_status?: PaymentStatus | null;
  amount_paid?: number | null;
  balance_due?: number | null;
  deposit_amount?: number | null;
  total_amount?: number | null;
  stripe_session_id?: string | null;
  booking_items?: BookingItem[];
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-900",
  confirmed: "bg-green-500/20 text-green-900",
  cancelled: "bg-red-500/20 text-red-900",
  completed: "bg-blue-500/20 text-blue-900",
};

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  unpaid: "bg-gray-500/20 text-gray-900",
  deposit_paid: "bg-amber-500/20 text-amber-900",
  paid_in_full: "bg-green-500/20 text-green-900",
  refunded: "bg-red-500/20 text-red-900",
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  deposit_paid: "Deposit",
  paid_in_full: "Paid in full",
  refunded: "Refunded",
};

export default function AdminBookings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", session.user.id);
      const admin = !!roles?.some((r: any) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) await load();
      else setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/admin/login", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*, booking_items(id, product_name, product_price, unit_price)")
      .order("event_date", { ascending: true });
    if (error) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } else {
      setBookings((data as Booking[]) ?? []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: BookingStatus) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    toast({ title: `Marked ${status}` });
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-4">
        <h1 className="font-display text-2xl font-bold">No admin access</h1>
        <p className="text-muted-foreground">
          Your account isn't marked as admin yet. Send your email to the developer to grant access.
        </p>
        <Button onClick={signOut} variant="outline">Sign out</Button>
      </div>
    );
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold">Bookings</h1>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={load} disabled={loading}>Refresh</Button>
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        </div>

        <BookingsCalendar bookings={bookings} />
        <UpcomingWeekList bookings={bookings} />

        <div className="bg-card rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No bookings</TableCell></TableRow>
              ) : filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">{format(new Date(b.event_date + "T12:00:00"), "MMM d, yyyy")}</div>
                    {b.event_end_date && b.event_end_date !== b.event_date && (
                      <div className="text-xs text-muted-foreground">
                        → {format(new Date(b.event_end_date + "T12:00:00"), "MMM d, yyyy")}
                      </div>
                    )}
                    {b.duration_type && (
                      <div className="text-xs font-medium text-primary">
                        {b.duration_type === "7hour" ? "7-Hour" : b.duration_type === "overnight" ? "Overnight" : "Full Weekend"}
                      </div>
                    )}
                    {b.event_start_time && (
                      <div className="text-xs text-muted-foreground">
                        {b.event_start_time}{b.event_end_time ? ` – ${b.event_end_time}` : ""}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {b.booking_items && b.booking_items.length > 0 ? (
                      <ul className="text-sm space-y-0.5">
                        {b.booking_items.map((it) => (
                          <li key={it.id}>
                            <span className="font-medium">{it.product_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {" "}· ${Number(it.unit_price ?? it.product_price).toFixed(2)}
                              {it.unit_price != null && it.unit_price !== it.product_price && (
                                <> (base ${Number(it.product_price).toFixed(2)})</>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : b.product_name ? (
                      <>
                        <div className="font-medium">{b.product_name}</div>
                        <div className="text-xs text-muted-foreground">${b.product_price}/day</div>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{b.customer_name}</div>
                    <div className="text-xs text-muted-foreground">
                      <a href={`tel:${b.customer_phone}`} className="hover:underline">{b.customer_phone}</a>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <a href={`mailto:${b.customer_email}`} className="hover:underline">{b.customer_email}</a>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {b.event_address_line}<br />
                    {b.event_city}, {b.event_zip}
                    {b.notes && <div className="text-xs text-muted-foreground italic mt-1">"{b.notes}"</div>}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[b.status]}>{b.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    {b.payment_status ? (
                      <div className="space-y-1">
                        <Badge className={PAYMENT_COLORS[b.payment_status]}>
                          {PAYMENT_LABELS[b.payment_status]}
                        </Badge>
                        {b.total_amount != null && (
                          <div className="text-muted-foreground">
                            Paid ${Number(b.amount_paid ?? 0).toFixed(2)} of ${Number(b.total_amount).toFixed(2)}
                          </div>
                        )}
                        {b.balance_due != null && Number(b.balance_due) > 0 && (
                          <div className="font-semibold text-destructive">
                            Balance: ${Number(b.balance_due).toFixed(2)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1 whitespace-nowrap">
                    {b.status === "pending" && (
                      <Button size="sm" onClick={() => updateStatus(b.id, "confirmed")}>Confirm</Button>
                    )}
                    {b.status === "confirmed" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "completed")}>Complete</Button>
                    )}
                    {b.status !== "cancelled" && b.status !== "completed" && (
                      <Button size="sm" variant="destructive" onClick={() => updateStatus(b.id, "cancelled")}>Cancel</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}