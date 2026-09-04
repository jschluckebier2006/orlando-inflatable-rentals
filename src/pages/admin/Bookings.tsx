import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { ChevronLeft, ChevronRight, Phone, MapPin, Archive, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookingFormModal, { type BookingFormBooking } from "@/components/admin/BookingFormModal";
import { Plus, Pencil } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { logActivity } from "@/lib/adminActivity";
import CancelledBookingsTable from "@/components/admin/CancelledBookingsTable";

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
  stripe_payment_intent_id?: string | null;
  archived?: boolean | null;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
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

function fmtTime(t?: string | null): string {
  if (!t) return "";
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return t;
  const h = parseInt(m[1], 10);
  const mm = m[2];
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm}${suffix}`;
}

/** A booking with money attached can never be hard-deleted — archive it instead. */
function hasCapturedPayment(b: Booking): boolean {
  return Number(b.amount_paid ?? 0) > 0 || !!b.stripe_payment_intent_id;
}

export default function AdminBookings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<BookingFormBooking | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const openId = searchParams.get("open");
    if (!openId || bookings.length === 0) return;
    const b = bookings.find((bk) => bk.id === openId);
    if (b) {
      setEditing(b as any);
      setFormOpen(true);
      setSearchParams((p) => {
        const np = new URLSearchParams(p);
        np.delete("open");
        return np;
      });
    }
  }, [searchParams, bookings]);

  const tab: "active" | "cancelled" =
    searchParams.get("tab") === "cancelled" ? "cancelled" : "active";
  const setTab = (t: "active" | "cancelled") =>
    setSearchParams((p) => {
      const np = new URLSearchParams(p);
      np.set("tab", t);
      return np;
    });

  // Cancel dialog state
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [refundConfirmed, setRefundConfirmed] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  // Restore dialog state
  const [restoreTarget, setRestoreTarget] = useState<Booking | null>(null);
  const [restoreSubmitting, setRestoreSubmitting] = useState(false);

  // Archive dialog state
  const [archiveTarget, setArchiveTarget] = useState<Booking | null>(null);
  const [archiveReason, setArchiveReason] = useState("");
  const [archiveSubmitting, setArchiveSubmitting] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Permanent purge dialog state (paid bookings only)
  const [purgeTarget, setPurgeTarget] = useState<Booking | null>(null);
  const [purgeConfirmText, setPurgeConfirmText] = useState("");
  const [purgeReason, setPurgeReason] = useState("");
  const [purgeSubmitting, setPurgeSubmitting] = useState(false);

  function openPurge(b: Booking) {
    setPurgeTarget(b);
    setPurgeConfirmText("");
    setPurgeReason("");
  }

  async function confirmPurge() {
    if (!purgeTarget) return;
    if (purgeConfirmText !== "PERMANENTLY DELETE") return;
    if (purgeReason.trim().length < 3) return;
    setPurgeSubmitting(true);
    const id = purgeTarget.id;
    const { error } = await supabase.rpc("purge_paid_booking", {
      p_booking_id: id,
      p_reason: purgeReason.trim(),
    });
    if (error) {
      toast({ title: "Permanent delete failed", description: error.message, variant: "destructive" });
      setPurgeSubmitting(false);
      return;
    }
    setBookings((prev) => prev.filter((x) => x.id !== id));
    toast({ title: "Booking permanently deleted", description: "A full snapshot was saved to the audit log. The Stripe charge is unaffected." });
    setPurgeTarget(null);
    setPurgeConfirmText("");
    setPurgeReason("");
    setPurgeSubmitting(false);
  }

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

  async function confirmCancel() {
    if (!cancelTarget || !refundConfirmed) return;
    setCancelSubmitting(true);
    const prev = cancelTarget.status;
    const cancelledAt = new Date().toISOString();
    const reason = cancelReason.trim() || null;
    const { error } = await supabase.from("bookings")
      .update({ status: "cancelled", cancelled_at: cancelledAt, cancel_reason: reason })
      .eq("id", cancelTarget.id);
    if (error) {
      toast({ title: "Cancel failed", description: error.message, variant: "destructive" });
      setCancelSubmitting(false);
      return;
    }
    await logActivity({
      bookingId: cancelTarget.id,
      kind: "cancelled",
      message: reason ? `Booking cancelled — ${reason}` : "Booking cancelled",
      metadata: { reason, previous_status: prev },
    });
    setBookings((bs) => bs.map((x) => x.id === cancelTarget.id
      ? { ...x, status: "cancelled", cancelled_at: cancelledAt, cancel_reason: reason }
      : x));
    toast({ title: "Booking cancelled" });
    setCancelTarget(null);
    setCancelSubmitting(false);
  }

  async function confirmArchive() {
    if (!archiveTarget) return;
    setArchiveSubmitting(true);
    const b = archiveTarget;
    const reason = archiveReason.trim() || null;
    const cancelledAt = b.cancelled_at ?? new Date().toISOString();
    const { error } = await supabase.from("bookings")
      .update({
        status: "cancelled",
        archived: true,
        cancelled_at: cancelledAt,
        cancel_reason: reason ?? b.cancel_reason ?? "Archived by admin",
      })
      .eq("id", b.id);
    if (error) {
      toast({ title: "Archive failed", description: error.message, variant: "destructive" });
      setArchiveSubmitting(false);
      return;
    }
    await logActivity({
      bookingId: b.id,
      kind: "archived",
      message: reason ? `Booking archived — ${reason}` : "Booking archived",
      metadata: { reason, previous_status: b.status },
    });
    setBookings((bs) => bs.map((x) => x.id === b.id
      ? { ...x, status: "cancelled", archived: true, cancelled_at: cancelledAt, cancel_reason: reason ?? x.cancel_reason ?? "Archived by admin" }
      : x));
    toast({ title: "Booking archived", description: "The record is preserved and hidden from the default list." });
    setArchiveTarget(null);
    setArchiveReason("");
    setArchiveSubmitting(false);
  }

  async function unarchive(b: Booking) {
    // A completed-archived booking was auto-filed by the daily job. Restoring it
    // must give back a workable record, so it returns to "confirmed".
    const restoreStatus: BookingStatus | null = b.status === "completed" ? "confirmed" : null;
    const patch: Record<string, unknown> = { archived: false };
    if (restoreStatus) patch.status = restoreStatus;
    const { error } = await supabase.from("bookings").update(patch as never).eq("id", b.id);
    if (error) {
      toast({ title: "Unarchive failed", description: error.message, variant: "destructive" });
      return;
    }
    await logActivity({
      bookingId: b.id,
      kind: "archived",
      message: restoreStatus
        ? "Booking unarchived — restored to confirmed"
        : "Booking unarchived",
      metadata: { previous_status: b.status, new_status: restoreStatus ?? b.status },
    });
    setBookings((bs) => bs.map((x) => (x.id === b.id
      ? { ...x, archived: false, status: restoreStatus ?? x.status }
      : x)));
    toast({
      title: "Booking unarchived",
      description: restoreStatus ? "Restored as a confirmed booking." : undefined,
    });
  }


  async function confirmDelete() {
    if (!deleteTarget || deleteConfirmText !== "DELETE") return;
    if (hasCapturedPayment(deleteTarget)) {
      toast({
        title: "This booking has a captured payment",
        description: "Paid bookings can't be deleted. Cancel and archive it instead.",
        variant: "destructive",
      });
      return;
    }
    setDeleteSubmitting(true);
    const id = deleteTarget.id;
    // Remove child rows first to avoid orphans
    const child1 = await supabase.from("booking_items").delete().eq("booking_id", id);
    const child2 = await supabase.from("booking_payments").delete().eq("booking_id", id);
    const child3 = await supabase.from("booking_activity").delete().eq("booking_id", id);
    const childErr = child1.error || child2.error || child3.error;
    if (childErr) {
      toast({ title: "Delete failed", description: childErr.message, variant: "destructive" });
      setDeleteSubmitting(false);
      return;
    }
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      setDeleteSubmitting(false);
      return;
    }
    setBookings((bs) => bs.filter((x) => x.id !== id));
    toast({ title: "Booking deleted" });
    setDeleteTarget(null);
    setDeleteConfirmText("");
    setDeleteSubmitting(false);
  }

  async function confirmRestore() {
    if (!restoreTarget) return;
    setRestoreSubmitting(true);
    const b = restoreTarget;

    const { data: items, error: itemsErr } = await supabase
      .from("booking_items").select("product_id").eq("booking_id", b.id);
    if (itemsErr) {
      toast({ title: "Restore failed", description: itemsErr.message, variant: "destructive" });
      setRestoreSubmitting(false);
      return;
    }
    const productIds = (items ?? [])
      .map((x: any) => x.product_id)
      .filter(Boolean) as string[];

    if (productIds.length) {
      const { data: ok, error: rpcErr } = await supabase.rpc("is_date_range_available" as any, {
        p_product_ids: productIds,
        p_start: b.event_date,
        p_end: b.event_end_date ?? b.event_date,
        p_exclude_booking_id: b.id,
      });
      if (rpcErr) {
        toast({ title: "Restore failed", description: rpcErr.message, variant: "destructive" });
        setRestoreSubmitting(false);
        return;
      }
      if (!ok) {
        toast({
          title: "Cannot restore — the date is no longer available.",
          variant: "destructive",
        });
        setRestoreSubmitting(false);
        setRestoreTarget(null);
        return;
      }
    }

    const { error } = await supabase.from("bookings")
      .update({ status: "confirmed", cancelled_at: null })
      .eq("id", b.id);
    if (error) {
      toast({ title: "Restore failed", description: error.message, variant: "destructive" });
      setRestoreSubmitting(false);
      return;
    }
    await logActivity({
      bookingId: b.id,
      kind: "restored",
      message: "Booking restored from cancellation",
      metadata: { previous_status: "cancelled" },
    });
    setBookings((prev) => prev.map((x) => x.id === b.id
      ? { ...x, status: "confirmed", cancelled_at: null } : x));
    toast({ title: "Booking restored" });
    setTab("active");
    setRestoreSubmitting(false);
    setRestoreTarget(null);
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

  const activeAll = bookings.filter((b) => b.status !== "cancelled" && !b.archived);
  const activeFiltered = filter === "all"
    ? activeAll
    : activeAll.filter((b) => b.status === filter);
  const cancelledList = bookings.filter((b) => b.status === "cancelled" && (showArchived || !b.archived));
  const archivedCount = bookings.filter((b) => b.archived).length;

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold">Bookings</h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4 mr-1" />New booking</Button>
            <Button variant="outline" onClick={load} disabled={loading}>Refresh</Button>
            <Button variant="outline" onClick={signOut} className="hidden md:inline-flex">Sign out</Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="active">Active ({activeAll.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledList.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="flex justify-end">
              <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:block space-y-4">
              <BookingsCalendar bookings={bookings} />
              <UpcomingWeekList bookings={bookings} />
            </div>

            {/* Mobile card list */}
            <ul className="md:hidden space-y-2">
              {loading ? (
                <li className="text-center py-8 text-muted-foreground">Loading...</li>
              ) : activeFiltered.length === 0 ? (
                <li className="text-center py-8 text-muted-foreground">No bookings</li>
              ) : activeFiltered.map((b) => (
                <li key={b.id} className="bg-card rounded-lg border border-border p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold">
                        {format(new Date(b.event_date + "T12:00:00"), "EEE, MMM d")}
                        {b.event_start_time && <span className="text-muted-foreground font-normal"> · {fmtTime(b.event_start_time)}</span>}
                      </div>
                      <div className="font-medium truncate">{b.customer_name}</div>
                      <div className="text-xs text-muted-foreground">
                        <a href={`tel:${b.customer_phone}`} className="hover:underline">{b.customer_phone}</a>
                      </div>
                    </div>
                    <Badge className={`${STATUS_COLORS[b.status]} shrink-0 capitalize`}>{b.status}</Badge>
                  </div>

                  <div className="text-sm">
                    {b.booking_items && b.booking_items.length > 0
                      ? b.booking_items.map((it) => it.product_name).join(", ")
                      : b.product_name ?? "—"}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {b.event_address_line}{b.event_city ? `, ${b.event_city}` : ""}{b.event_zip ? ` ${b.event_zip}` : ""}
                  </div>

                  {b.payment_status && (
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge className={PAYMENT_COLORS[b.payment_status]}>{PAYMENT_LABELS[b.payment_status]}</Badge>
                      {b.balance_due != null && Number(b.balance_due) > 0 && (
                        <span className="font-semibold text-destructive">Bal ${Number(b.balance_due).toFixed(2)}</span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button size="sm" className="min-h-[44px] flex-1" variant="outline" onClick={() => { setEditing(b as any); setFormOpen(true); }}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    {b.status === "pending" && (
                      <Button size="sm" className="min-h-[44px] flex-1" onClick={() => updateStatus(b.id, "confirmed")}>Confirm</Button>
                    )}
                    {b.status === "confirmed" && (
                      <Button size="sm" className="min-h-[44px] flex-1" variant="outline" onClick={() => updateStatus(b.id, "completed")}>Complete</Button>
                    )}
                    {b.status !== "cancelled" && b.status !== "completed" && (
                      <Button size="sm" className="min-h-[44px]" variant="destructive" onClick={() => { setCancelTarget(b); setCancelReason(""); setRefundConfirmed(false); }}>Cancel</Button>
                    )}
                    {hasCapturedPayment(b) ? (
                      <>
                        {!b.archived && (
                          <Button size="sm" className="min-h-[44px]" variant="outline" onClick={() => { setArchiveTarget(b); setArchiveReason(""); }}>
                            <Archive className="h-4 w-4 mr-1" /> Archive
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="min-h-[44px] text-destructive border border-destructive/40 hover:bg-destructive/10"
                          onClick={() => openPurge(b)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Permanently delete
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="min-h-[44px]" variant="destructive" onClick={() => { setDeleteTarget(b); setDeleteConfirmText(""); }}>Delete</Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden md:block bg-card rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : activeFiltered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No bookings</TableCell></TableRow>
              ) : activeFiltered.map((b) => (
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
                        {b.duration_type === "7hour" ? "Day Rental (7-Hours)" : b.duration_type === "overnight" ? "Overnight" : "Full Weekend"}
                      </div>
                    )}
                    {b.event_start_time && (
                      <div className="text-xs text-muted-foreground">
                          {fmtTime(b.event_start_time)}{b.event_end_time ? ` – ${fmtTime(b.event_end_time)}` : ""}
                      </div>
                    )}
                      {b.payment_status && (
                        <div className="space-y-1 pt-2 text-xs">
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
                      )}
                      <div className="flex flex-wrap gap-1 pt-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditing(b as any); setFormOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                        {b.status === "pending" && (
                          <Button size="sm" onClick={() => updateStatus(b.id, "confirmed")}>Confirm</Button>
                        )}
                        {b.status === "confirmed" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "completed")}>Complete</Button>
                        )}
                        {b.status !== "cancelled" && b.status !== "completed" && (
                          <Button size="sm" variant="destructive" onClick={() => {
                            setCancelTarget(b);
                            setCancelReason("");
                            setRefundConfirmed(false);
                          }}>Cancel</Button>
                        )}
                        {hasCapturedPayment(b) ? (
                          <>
                            {!b.archived && (
                              <Button size="sm" variant="outline" onClick={() => { setArchiveTarget(b); setArchiveReason(""); }}>
                                <Archive className="h-3 w-3 mr-1" /> Archive
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive border border-destructive/40 hover:bg-destructive/10"
                              onClick={() => openPurge(b)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Permanently delete
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="destructive" onClick={() => {
                            setDeleteTarget(b);
                            setDeleteConfirmText("");
                          }}>Delete</Button>
                        )}
                      </div>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <Checkbox
                id="show-archived"
                checked={showArchived}
                onCheckedChange={(v) => setShowArchived(v === true)}
              />
              <label htmlFor="show-archived" className="text-sm text-muted-foreground">
                Show archived ({archivedCount})
              </label>
            </div>
            <CancelledBookingsTable
              rows={cancelledList as any}
              onRestore={(b) => setRestoreTarget(b as any)}
              onView={(b) => { setEditing(b as any); setFormOpen(true); }}
            />
            {showArchived && archivedCount > 0 && (
              <ul className="space-y-2">
                {bookings.filter((b) => b.archived).map((b) => {
                  const completed = b.status === "completed";
                  return (
                    <li
                      key={b.id}
                      className={`flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm ${
                        completed ? "border-green-600/40 bg-green-500/5" : "border-border bg-card"
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={completed ? "bg-green-600/20 text-green-900" : "bg-red-500/20 text-red-900"}>
                            {completed ? "Completed" : "Cancelled"}
                          </Badge>
                          <span className="font-medium">{b.customer_name}</span>
                          <span className="text-muted-foreground">
                            · {format(new Date(b.event_date + "T12:00:00"), "MMM d, yyyy")}
                          </span>
                        </div>
                        {completed ? (
                          <div className="text-xs text-muted-foreground">
                            Job delivered · Paid ${Number(b.amount_paid ?? 0).toFixed(2)}
                            {b.total_amount != null && ` of $${Number(b.total_amount).toFixed(2)}`}
                          </div>
                        ) : (
                          b.cancel_reason && <div className="text-xs text-muted-foreground">{b.cancel_reason}</div>
                        )}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => unarchive(b)}>Unarchive</Button>
                    </li>
                  );
                })}
              </ul>
            )}

          </TabsContent>
        </Tabs>
      </div>
      <BookingFormModal open={formOpen} onOpenChange={setFormOpen} booking={editing} onSaved={load} />

      <AlertDialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will release the date on the calendar and move the booking to the
              Cancelled tab. This app does NOT issue a Stripe refund automatically —
              you must have already refunded the deposit (and any balance charged) in
              the Stripe Dashboard before continuing.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <label className="flex items-start gap-2 text-sm">
            <Checkbox
              checked={refundConfirmed}
              onCheckedChange={(v) => setRefundConfirmed(!!v)}
            />
            <span>I have refunded this booking in the Stripe Dashboard.</span>
          </label>

          <Textarea
            placeholder="Reason for cancellation (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              disabled={!refundConfirmed || cancelSubmitting}
              onClick={(e) => { e.preventDefault(); confirmCancel(); }}
              className={buttonVariants({ variant: "destructive" })}
            >
              Cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!restoreTarget} onOpenChange={(o) => !o && setRestoreTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will return the booking to <strong>confirmed</strong> and re-block
              the event date on the calendar. If the same item has already been booked
              by someone else for this date, the restore will fail and the booking
              will stay cancelled.
              <br /><br />
              The original cancellation reason will be kept on the booking for history.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Keep cancelled</AlertDialogCancel>
            <AlertDialogAction
              disabled={restoreSubmitting}
              onClick={(e) => { e.preventDefault(); confirmRestore(); }}
            >
              Restore booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!archiveTarget} onOpenChange={(o) => { if (!o) { setArchiveTarget(null); setArchiveReason(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This booking has a captured payment, so it can't be permanently deleted. It will be
              cancelled and archived — the full record is preserved and hidden from the default list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {archiveTarget && (
            <div className="text-sm space-y-1">
              <div><span className="text-muted-foreground">Customer:</span> <strong>{archiveTarget.customer_name}</strong></div>
              <div><span className="text-muted-foreground">Date:</span> <strong>{format(parseISO(archiveTarget.event_date), "EEE, MMM d, yyyy")}</strong></div>
              <div><span className="text-muted-foreground">Paid:</span> <strong>${Number(archiveTarget.amount_paid ?? 0).toFixed(2)}</strong></div>
            </div>
          )}
          <Textarea
            value={archiveReason}
            onChange={(e) => setArchiveReason(e.target.value)}
            placeholder="Reason (optional)"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmArchive(); }} disabled={archiveSubmitting}>
              {archiveSubmitting ? "Archiving..." : "Cancel & archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) { setDeleteTarget(null); setDeleteConfirmText(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteTarget && (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <div><span className="text-muted-foreground">Customer:</span> <strong>{deleteTarget.customer_name}</strong></div>
              <div><span className="text-muted-foreground">Date:</span> <strong>{format(parseISO(deleteTarget.event_date), "EEE, MMM d, yyyy")}</strong></div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm">Type <strong>DELETE</strong> to confirm:</label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteConfirmText !== "DELETE" || deleteSubmitting}
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              className={buttonVariants({ variant: "destructive" })}
            >
              Delete booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent purge (paid bookings) */}
      <AlertDialog open={!!purgeTarget} onOpenChange={(o) => { if (!o) { setPurgeTarget(null); setPurgeConfirmText(""); setPurgeReason(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Permanently delete this paid booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This destroys the booking, its line items, its payment records and its activity history.
              It cannot be undone. A complete snapshot is saved to the audit log first, and the Stripe
              charge itself is not touched — it stays in Stripe's records.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {purgeTarget && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm space-y-1">
              <div><span className="text-muted-foreground">Customer:</span> <strong>{purgeTarget.customer_name}</strong></div>
              <div><span className="text-muted-foreground">Event date:</span> <strong>{format(parseISO(purgeTarget.event_date), "EEE, MMM d, yyyy")}</strong></div>
              <div><span className="text-muted-foreground">Amount paid:</span> <strong>${Number(purgeTarget.amount_paid ?? 0).toFixed(2)}</strong></div>
              <div className="break-all">
                <span className="text-muted-foreground">Stripe PaymentIntent:</span>{" "}
                <strong>{purgeTarget.stripe_payment_intent_id ?? "—"}</strong>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm">Reason (required):</label>
            <Textarea
              value={purgeReason}
              onChange={(e) => setPurgeReason(e.target.value)}
              placeholder="Why is this record being destroyed?"
            />
            <label className="text-sm">Type <strong>PERMANENTLY DELETE</strong> to confirm:</label>
            <Input
              value={purgeConfirmText}
              onChange={(e) => setPurgeConfirmText(e.target.value)}
              placeholder="PERMANENTLY DELETE"
              autoComplete="off"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              disabled={purgeConfirmText !== "PERMANENTLY DELETE" || purgeReason.trim().length < 3 || purgeSubmitting}
              onClick={(e) => { e.preventDefault(); confirmPurge(); }}
              className={buttonVariants({ variant: "destructive" })}
            >
              {purgeSubmitting ? "Deleting..." : "Permanently delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------- Calendar ----------

function getCountedDates(b: Booking): string[] {
  const start = parseISO(b.event_date);
  const end = b.event_end_date ? parseISO(b.event_end_date) : start;
  return eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
}

interface DayInfo {
  deliveries: Booking[];
  pickups: Booking[];
  ongoing: Booking[];
  itemCount: number;
}

function BookingsCalendar({ bookings }: { bookings: Booking[] }) {
  const [cursor, setCursor] = useState<Date>(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const dayMap = new Map<string, DayInfo>();
  const get = (k: string): DayInfo => {
    let d = dayMap.get(k);
    if (!d) { d = { deliveries: [], pickups: [], ongoing: [], itemCount: 0 }; dayMap.set(k, d); }
    return d;
  };
  bookings
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .forEach((b) => {
      const items = b.booking_items?.length ?? (b.product_id ? 1 : 0);
      const startKey = b.event_date;
      const endKey = b.event_end_date || b.event_date;
      const dates = getCountedDates(b);
      dates.forEach((key) => {
        const info = get(key);
        info.itemCount += items;
        if (key === startKey) info.deliveries.push(b);
        else if (key === endKey) info.pickups.push(b);
        else info.ongoing.push(b);
      });
    });

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const selectedInfo = selectedDate ? dayMap.get(selectedDate) : null;
  const selectedAll: Booking[] = selectedInfo
    ? [...selectedInfo.deliveries, ...selectedInfo.ongoing, ...selectedInfo.pickups]
    : [];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">
          {format(cursor, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCursor((c) => subMonths(c, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(startOfMonth(new Date()))}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCursor((c) => addMonths(c, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-muted-foreground mb-1">
        {weekdays.map((w) => (
          <div key={w} className="text-center py-1">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const info = dayMap.get(key);
          const inMonth = isSameMonth(d, cursor);
          const today = isToday(d);
          const hasAny = !!info && info.itemCount > 0;
          const deliveryCount = info?.deliveries.reduce((s, b) => s + (b.booking_items?.length ?? (b.product_id ? 1 : 0)), 0) ?? 0;
          const pickupCount = info?.pickups.reduce((s, b) => s + (b.booking_items?.length ?? (b.product_id ? 1 : 0)), 0) ?? 0;
          return (
            <button
              type="button"
              key={key}
              onClick={() => hasAny && setSelectedDate(key)}
              disabled={!hasAny}
              className={[
                "aspect-square rounded-md border p-1.5 flex flex-col text-left transition",
                inMonth ? "bg-background" : "bg-muted/30",
                today ? "border-primary" : "border-border",
                hasAny ? "hover:bg-accent cursor-pointer" : "cursor-default",
              ].join(" ")}
            >
              <div
                className={[
                  "text-xs font-medium",
                  inMonth ? "text-foreground" : "text-muted-foreground",
                  today ? "text-primary" : "",
                ].join(" ")}
              >
                {format(d, "d")}
              </div>
              <div className="flex-1 flex items-center justify-center gap-1 flex-wrap">
                {deliveryCount > 0 && (
                  <span
                    title="Deliveries"
                    className="rounded-full bg-primary text-primary-foreground text-xs font-bold min-w-[1.5rem] h-6 px-1.5 flex items-center justify-center"
                  >
                    {deliveryCount}
                  </span>
                )}
                {pickupCount > 0 && (
                  <span
                    title="Pickups"
                    className="rounded-full bg-destructive text-destructive-foreground text-xs font-bold min-w-[1.5rem] h-6 px-1.5 flex items-center justify-center"
                  >
                    {pickupCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-primary" /> Delivery day
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-destructive" /> Pickup day
        </span>
        <span>Click a day to see bookings.</span>
      </div>

      <Dialog open={!!selectedDate} onOpenChange={(o) => !o && setSelectedDate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          {selectedInfo && (
            <div className="space-y-4">
              {(["deliveries", "ongoing", "pickups"] as const).map((kind) => {
                const list = selectedInfo[kind];
                if (list.length === 0) return null;
                const label = kind === "deliveries" ? "Deliveries" : kind === "pickups" ? "Pickups" : "Ongoing";
                const dot = kind === "deliveries" ? "bg-primary" : kind === "pickups" ? "bg-destructive" : "bg-muted-foreground";
                return (
                  <div key={kind}>
                    <h3 className="font-semibold mb-2 inline-flex items-center gap-2">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${dot}`} />
                      {label} ({list.length})
                    </h3>
                    <ul className="divide-y divide-border border border-border rounded-md">
                      {list.map((b) => (
                        <li key={b.id} className="p-3">
                          <div className="font-medium">{b.customer_name}</div>
                          {b.customer_phone && (
                            <a href={`tel:${b.customer_phone}`} className="text-sm text-primary inline-flex items-center gap-1 hover:underline">
                              <Phone className="h-3 w-3" /> {b.customer_phone}
                            </a>
                          )}
                          {(b.event_address_line || b.event_city) && (
                            <div className="text-sm text-muted-foreground inline-flex items-start gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                              <span>
                                {[b.event_address_line, [b.event_city, b.event_zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")}
                              </span>
                            </div>
                          )}
                          <div className="text-sm mt-1">
                            <span className="text-muted-foreground">Items: </span>
                            {b.booking_items && b.booking_items.length > 0
                              ? b.booking_items.map((it) => it.product_name).join(", ")
                              : b.product_name ?? "—"}
                          </div>
                          {b.event_end_date && b.event_end_date !== b.event_date && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(parseISO(b.event_date), "MMM d")} → {format(parseISO(b.event_end_date), "MMM d")}
                            </div>
                          )}
                          <div className="mt-2">
                            <Badge className={STATUS_COLORS[b.status]}>{b.status}</Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              {selectedAll.length === 0 && (
                <p className="text-sm text-muted-foreground">No bookings.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- Upcoming 7 days ----------

function UpcomingWeekList({ bookings }: { bookings: Booking[] }) {
  const today = startOfDay(new Date());
  const weekEnd = addDays(today, 7);

  const upcoming = bookings
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .filter((b) => {
      const d = parseISO(b.event_date);
      return d >= today && d <= weekEnd;
    })
    .sort((a, b) => a.event_date.localeCompare(b.event_date));

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h2 className="font-display text-xl font-semibold mb-3">Next 7 Days</h2>
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No bookings in the next 7 days.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {upcoming.map((b) => {
            const items =
              b.booking_items && b.booking_items.length > 0
                ? b.booking_items.map((it) => it.product_name).join(", ")
                : b.product_name ?? "—";
            const address = [
              b.event_address_line,
              [b.event_city, b.event_zip].filter(Boolean).join(" "),
            ]
              .filter(Boolean)
              .join(", ");
            return (
              <li key={b.id} className="py-3 flex flex-col md:flex-row md:items-start md:gap-4">
                <div className="md:w-32 shrink-0">
                  <div className="text-sm font-semibold">
                    {format(parseISO(b.event_date), "EEE, MMM d")}
                  </div>
                  {b.event_start_time && (
                    <div className="text-xs text-muted-foreground">{fmtTime(b.event_start_time)}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{b.customer_name}</div>
                  {b.customer_phone && (
                    <a
                      href={`tel:${b.customer_phone}`}
                      className="text-sm text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      {b.customer_phone}
                    </a>
                  )}
                  {address && (
                    <div className="text-sm text-muted-foreground inline-flex items-start gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{address}</span>
                    </div>
                  )}
                  <div className="text-sm mt-1">
                    <span className="text-muted-foreground">Items: </span>
                    {items}
                  </div>
                </div>
                <div className="md:ml-auto mt-2 md:mt-0">
                  <Badge className={STATUS_COLORS[b.status]}>{b.status}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}