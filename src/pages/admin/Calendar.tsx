import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, isSameMonth, isToday,
  parseISO, addDays,
} from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Phone, MapPin, Plus, Ban, BellRing, CalendarClock, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface BookingItem { id: string; product_name: string; }
interface Booking {
  id: string;
  event_date: string;
  event_end_date: string | null;
  event_start_time: string | null;
  created_at?: string;
  customer_name: string;
  customer_phone: string;
  event_address_line: string;
  event_city: string;
  event_zip: string;
  status: BookingStatus;
  product_id: string | null;
  product_name: string | null;
  booking_items?: BookingItem[];
}

interface GlobalBlackout {
  id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
}

interface ItemBlackout {
  id: string;
  item_id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
  inventory_items?: { name: string } | null;
}

/** Unified shape used by the popover for both blackout kinds. */
interface BlackoutEntry {
  id: string;
  kind: "item" | "global";
  label: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at?: string | null;
  /** Number of holds covering the same item on this date (item blackouts only). */
  overlapCount: number;
}

function fmtRange(start: string, end: string): string {
  return start === end
    ? format(parseISO(start), "EEE, MMM d, yyyy")
    : `${format(parseISO(start), "MMM d, yyyy")} → ${format(parseISO(end), "MMM d, yyyy")}`;
}

function BlackoutPopover({
  entry,
  onRemove,
  children,
}: {
  entry: BlackoutEntry;
  onRemove: (entry: BlackoutEntry) => Promise<void>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setConfirming(false);
      }}
    >
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 max-w-[90vw] space-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-2">
          <Ban className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="font-semibold leading-tight break-words">{entry.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{fmtRange(entry.start_date, entry.end_date)}</div>
          </div>
        </div>

        {entry.overlapCount > 1 && (
          <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-900">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{entry.overlapCount} holds on this item for this date — one may be stale.</span>
          </div>
        )}

        <div className="rounded-md bg-muted p-2 text-sm whitespace-pre-wrap break-words">
          {entry.reason?.trim() ? entry.reason : "No reason given"}
        </div>

        <div className="text-[11px] text-muted-foreground">
          {entry.kind === "global" ? "Applies to all products" : "Item-level block"}
          {entry.created_at ? ` · created ${format(parseISO(entry.created_at), "MMM d, yyyy h:mma")}` : ""}
        </div>

        {confirming ? (
          <div className="space-y-2 rounded-md border border-destructive/40 bg-destructive/5 p-2">
            <p className="text-xs text-destructive">
              Remove this block? The date becomes bookable again.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setConfirming(false)} disabled={busy}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  await onRemove(entry);
                  setBusy(false);
                  setConfirming(false);
                  setOpen(false);
                }}
              >
                {busy ? "Removing…" : "Remove"}
              </Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="outline" className="text-destructive" onClick={() => setConfirming(true)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove blackout
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}



const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-green-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500",
};
const STATUS_BADGE: Record<BookingStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-900",
  confirmed: "bg-green-500/20 text-green-900",
  completed: "bg-blue-500/20 text-blue-900",
  cancelled: "bg-red-500/20 text-red-900",
};

type ViewMode = "month" | "week" | "day";

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

function fmtLocation(b: Booking): string {
  return [b.event_address_line, [b.event_city, b.event_zip].filter(Boolean).join(" ")]
    .filter(Boolean).join(", ");
}

function itemNames(b: Booking): string {
  if (b.booking_items && b.booking_items.length > 0) return b.booking_items.map((i) => i.product_name).join(", ");
  return b.product_name ?? "—";
}

export default function AdminCalendar() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blackouts, setBlackouts] = useState<GlobalBlackout[]>([]);
  const [itemBlackouts, setItemBlackouts] = useState<ItemBlackout[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [reviewQueue, setReviewQueue] = useState<any[]>([]);

  async function load() {
    setLoading(true);
    const [{ data: bData }, { data: gbData }, { data: rData }, { data: ibData }] = await Promise.all([
      supabase
        .from("bookings")
        .select("id, event_date, event_end_date, event_start_time, created_at, customer_name, customer_phone, event_address_line, event_city, event_zip, status, product_id, product_name, booking_items(id, product_name)")
        .order("event_date", { ascending: true }),
      supabase
        .from("global_blackouts")
        .select("id, start_date, end_date, reason, created_at")
        .order("start_date", { ascending: true }),
      supabase
        .from("bookings")
        .select("id, customer_name, customer_email, customer_phone, event_date, finalize_error, stripe_session_id, stripe_payment_intent_id")
        .eq("needs_review", true)
        .order("needs_review_at", { ascending: false }),
      supabase
        .from("inventory_blackouts")
        .select("id, item_id, start_date, end_date, reason, created_at, inventory_items(name)")
        .order("start_date", { ascending: true }),
    ]);
    setBookings((bData as any) ?? []);
    setBlackouts((gbData as any) ?? []);
    setReviewQueue((rData as any) ?? []);
    setItemBlackouts((ibData as any) ?? []);
    setLoading(false);
  }

  async function removeBlackout(entry: BlackoutEntry) {
    const table = entry.kind === "global" ? "global_blackouts" : "inventory_blackouts";
    const { error } = await supabase.from(table as any).delete().eq("id", entry.id);
    if (error) {
      toast({ title: "Could not remove the blackout", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Blackout removed", description: `${entry.label} — ${fmtRange(entry.start_date, entry.end_date)}` });
    if (entry.kind === "global") setBlackouts((l) => l.filter((b) => b.id !== entry.id));
    else setItemBlackouts((l) => l.filter((b) => b.id !== entry.id));
  }


  async function clearReview(id: string) {
    const { error } = await supabase
      .from("bookings")
      .update({ needs_review: false, needs_review_at: null } as any)
      .eq("id", id);
    if (error) {
      toast({ title: "Could not clear the flag", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Marked resolved" });
    setReviewQueue((q) => q.filter((b) => b.id !== id));
  }

  useEffect(() => { load(); }, []);

  const dayMap = useMemo(() => {
    const m = new Map<string, Booking[]>();
    for (const b of bookings) {
      const start = parseISO(b.event_date);
      const end = b.event_end_date ? parseISO(b.event_end_date) : start;
      for (const d of eachDayOfInterval({ start, end })) {
        const key = format(d, "yyyy-MM-dd");
        const arr = m.get(key) ?? [];
        arr.push(b);
        m.set(key, arr);
      }
    }
    return m;
  }, [bookings]);




  /** Global blackouts as unified entries, keyed by date. */
  const globalEntryMap = useMemo(() => {
    const m = new Map<string, BlackoutEntry[]>();
    for (const b of blackouts) {
      for (const d of eachDayOfInterval({ start: parseISO(b.start_date), end: parseISO(b.end_date) })) {
        const key = format(d, "yyyy-MM-dd");
        const arr = m.get(key) ?? [];
        arr.push({
          id: b.id,
          kind: "global",
          label: "All products",
          start_date: b.start_date,
          end_date: b.end_date,
          reason: b.reason,
          created_at: (b as any).created_at ?? null,
          overlapCount: 1,
        });
        m.set(key, arr);
      }
    }
    return m;
  }, [blackouts]);

  /** Item-level blackouts as unified entries, keyed by date, with per-item overlap counts. */
  const itemEntryMap = useMemo(() => {
    const m = new Map<string, BlackoutEntry[]>();
    for (const b of itemBlackouts) {
      for (const d of eachDayOfInterval({ start: parseISO(b.start_date), end: parseISO(b.end_date) })) {
        const key = format(d, "yyyy-MM-dd");
        const arr = m.get(key) ?? [];
        arr.push({
          id: b.id,
          kind: "item",
          label: b.inventory_items?.name ?? b.item_id,
          start_date: b.start_date,
          end_date: b.end_date,
          reason: b.reason,
          created_at: b.created_at,
          overlapCount: 1,
          // keep the item id for overlap counting
          ...(({ item_id: b.item_id } as any)),
        } as BlackoutEntry);
        m.set(key, arr);
      }
    }
    // flag overlaps: same item, same date, more than one hold
    for (const [, arr] of m) {
      const counts = new Map<string, number>();
      for (const e of arr) counts.set((e as any).item_id, (counts.get((e as any).item_id) ?? 0) + 1);
      for (const e of arr) e.overlapCount = counts.get((e as any).item_id) ?? 1;
      arr.sort((a, b) => b.overlapCount - a.overlapCount || a.label.localeCompare(b.label));
    }
    return m;
  }, [itemBlackouts]);



  const days = useMemo(() => {
    if (view === "month") {
      const ms = startOfMonth(cursor);
      return eachDayOfInterval({ start: startOfWeek(ms, { weekStartsOn: 0 }), end: endOfWeek(endOfMonth(ms), { weekStartsOn: 0 }) });
    }
    if (view === "week") {
      return eachDayOfInterval({ start: startOfWeek(cursor, { weekStartsOn: 0 }), end: endOfWeek(cursor, { weekStartsOn: 0 }) });
    }
    return [cursor];
  }, [view, cursor]);

  const headerLabel =
    view === "month" ? format(cursor, "MMMM yyyy")
    : view === "week" ? `Week of ${format(startOfWeek(cursor, { weekStartsOn: 0 }), "MMM d, yyyy")}`
    : format(cursor, "EEEE, MMM d, yyyy");

  function shift(dir: -1 | 1) {
    if (view === "month") setCursor((c) => (dir === -1 ? subMonths(c, 1) : addMonths(c, 1)));
    else if (view === "week") setCursor((c) => addDays(c, dir * 7));
    else setCursor((c) => addDays(c, dir));
  }

  const selected = selectedDate ? dayMap.get(selectedDate) ?? [] : [];
  
  const selectedGlobalEntries = selectedDate ? globalEntryMap.get(selectedDate) ?? [] : [];
  const selectedItemEntries = selectedDate ? itemEntryMap.get(selectedDate) ?? [] : [];
  // Hide cancelled bookings from the grid; they only appear inside the day sheet.
  function visibleOnGrid(list: Booking[]) { return list.filter((b) => b.status !== "cancelled"); }

  /** Split visible slots so at least one blackout always survives truncation. */
  function splitCell(list: Booking[], bos: BlackoutEntry[], max: number) {
    const bk = visibleOnGrid(list);
    const total = bk.length + bos.length;
    if (total <= max) return { bookings: bk, blackouts: bos, more: 0 };
    const boShow = Math.min(bos.length, Math.max(bos.length > 0 ? 1 : 0, max - bk.length));
    const bkShow = Math.max(0, max - boShow);
    return { bookings: bk.slice(0, bkShow), blackouts: bos.slice(0, boShow), more: total - bkShow - boShow };
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const pendingAlerts = useMemo(
    () => bookings
      .filter((b) => b.status === "pending")
      .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "")),
    [bookings]
  );

  const upcomingByDay = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const horizon = addDays(today, 6);
    const todayKey = format(today, "yyyy-MM-dd");
    const horizonKey = format(horizon, "yyyy-MM-dd");
    const buckets = new Map<string, Booking[]>();
    for (let i = 0; i < 7; i++) buckets.set(format(addDays(today, i), "yyyy-MM-dd"), []);
    for (const b of bookings) {
      if (b.status !== "pending" && b.status !== "confirmed") continue;
      const start = b.event_date;
      const end = b.event_end_date ?? b.event_date;
      if (end < todayKey || start > horizonKey) continue;
      for (const d of eachDayOfInterval({ start: parseISO(start), end: parseISO(end) })) {
        const k = format(d, "yyyy-MM-dd");
        if (buckets.has(k)) buckets.get(k)!.push(b);
      }
    }
    return Array.from(buckets.entries()).map(([date, list]) => ({
      date,
      list: list.sort((a, b) => (a.event_start_time ?? "").localeCompare(b.event_start_time ?? "")),
    }));
  }, [bookings]);

  return (
    <div className="space-y-4">
      {/* Needs review — paid checkouts that failed to finalize */}
      {reviewQueue.length > 0 && (
        <Card className="p-4 border-l-4 border-l-destructive bg-destructive/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h2 className="font-display font-semibold">Needs review — payment taken, booking incomplete</h2>
            <Badge variant="destructive">{reviewQueue.length}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            These customers paid but their booking could not be created automatically. Nothing was deleted —
            fix the details below and clear the flag.
          </p>
          <ul className="divide-y border border-destructive/30 rounded-md bg-background">
            {reviewQueue.map((b) => (
              <li key={b.id} className="p-3 space-y-2">
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer"
                  onClick={() => navigate(`/admin/bookings?open=${b.id}`)}
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{b.customer_name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {b.event_date ? format(parseISO(b.event_date), "EEE, MMM d yyyy") : "—"} · {b.customer_email} · {b.customer_phone}
                    </div>
                  </div>
                  <Badge variant="destructive" className="shrink-0">needs review</Badge>
                </div>
                {b.finalize_error && (
                  <pre className="text-[11px] leading-snug whitespace-pre-wrap bg-muted rounded p-2 text-muted-foreground overflow-x-auto">
                    {b.finalize_error}
                  </pre>
                )}
                <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  {b.stripe_session_id && <span className="font-mono">session {b.stripe_session_id}</span>}
                  {b.stripe_payment_intent_id && <span className="font-mono">pi {b.stripe_payment_intent_id}</span>}
                </div>
                <Button size="sm" variant="outline" onClick={() => clearReview(b.id)}>
                  Mark resolved
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* New booking alerts */}
      <Card className={`p-4 border-l-4 ${pendingAlerts.length > 0 ? "border-l-yellow-500 bg-yellow-500/5" : "border-l-muted"}`}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <BellRing className={`h-5 w-5 ${pendingAlerts.length > 0 ? "text-yellow-600" : "text-muted-foreground"}`} />
            <h2 className="font-display font-semibold">New booking alerts</h2>
            <Badge variant={pendingAlerts.length > 0 ? "default" : "secondary"} className={pendingAlerts.length > 0 ? "bg-yellow-500 text-yellow-950 hover:bg-yellow-500" : ""}>
              {pendingAlerts.length}
            </Badge>
          </div>
          {pendingAlerts.length > 3 && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/bookings")}>View all</Button>
          )}
        </div>
        {pendingAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">All caught up — no new bookings awaiting confirmation.</p>
        ) : (
          <ul className="divide-y border border-border rounded-md bg-background">
            {pendingAlerts.slice(0, 5).map((b) => (
              <li
                key={b.id}
                className="p-3 cursor-pointer hover:bg-accent flex items-start justify-between gap-3"
                onClick={() => navigate(`/admin/bookings?open=${b.id}`)}
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{b.customer_name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {format(parseISO(b.event_date), "EEE, MMM d")}{b.event_start_time ? ` · ${fmtTime(b.event_start_time)}` : ""} · {itemNames(b)}
                  </div>
                </div>
                <Badge className={`${STATUS_BADGE.pending} shrink-0`}>pending</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Coming up — next 7 days */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="h-5 w-5 text-primary" />
          <h2 className="font-display font-semibold">Coming up — next 7 days</h2>
        </div>
        <div className="space-y-4">
          {upcomingByDay.filter(({ list }) => list.length > 0).length === 0 && (
            <p className="text-sm text-muted-foreground">No bookings in the next 7 days.</p>
          )}
          {upcomingByDay.filter(({ list }) => list.length > 0).map(({ date, list }) => (
            <div key={date}>
              <h3 className="font-display text-lg font-bold leading-tight">
                {format(parseISO(date), "EEEE")}
                <span className="text-muted-foreground font-normal text-sm ml-2">{format(parseISO(date), "MMM d")}</span>
              </h3>
              <ul className="mt-2 divide-y border border-border rounded-md bg-background">
                  {list.map((b) => (
                    <li
                      key={`${date}-${b.id}`}
                      className="p-3 cursor-pointer hover:bg-accent"
                      onClick={() => navigate(`/admin/bookings?open=${b.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium truncate">{itemNames(b)}</div>
                        <Badge className={`${STATUS_BADGE[b.status]} shrink-0 capitalize`}>{b.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {b.customer_name}{b.event_start_time ? ` · ${fmtTime(b.event_start_time)}` : ""}{fmtLocation(b) ? ` · ${fmtLocation(b)}` : ""}
                      </div>
                      {fmtLocation(b) && (
                        <div className="text-xs text-muted-foreground inline-flex items-start gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                          <span className="truncate">{fmtLocation(b)}</span>
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Calendar</h1>
          <Button size="sm" className="min-h-[44px] hidden md:inline-flex" onClick={() => navigate("/admin/new")}>
            <Plus className="h-4 w-4 mr-1" /> New reservation
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            {(["month", "week", "day"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 min-h-[44px] text-sm capitalize ${view === v ? "bg-primary text-primary-foreground" : "bg-background"}`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px]" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="min-h-[44px]" onClick={() => setCursor(new Date())}>Today</Button>
            <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px]" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <h2 className="font-display text-xl font-semibold mb-3">{headerLabel}</h2>

        {view === "month" && (
          <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-muted-foreground mb-1">
            {weekdays.map((w) => (<div key={w} className="text-center py-1">{w}</div>))}
          </div>
        )}

        <div className={view === "day" ? "" : "grid grid-cols-7 gap-1"}>
          {days.map((d) => {
            const key = format(d, "yyyy-MM-dd");
            const list = dayMap.get(key) ?? [];
            const globalEntries = globalEntryMap.get(key) ?? [];
            const itemEntries = itemEntryMap.get(key) ?? [];
            const hasGlobalBlackout = globalEntries.length > 0;
            const hasConflict = itemEntries.some((e) => e.overlapCount > 1);
            const inMonth = view !== "month" || isSameMonth(d, cursor);
            const today = isToday(d);
            const max = view === "month" ? 3 : 8;
            const cell = splitCell(list, itemEntries, max);
            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedDate(key)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedDate(key); } }}
                className={[
                  view === "day" ? "min-h-[300px]" : "min-h-[5rem] aspect-square",
                  "rounded-md border p-1.5 flex flex-col text-left transition hover:bg-accent cursor-pointer",
                  hasGlobalBlackout ? "bg-destructive/10" : (inMonth ? "bg-background" : "bg-muted/30"),
                  today ? "border-primary border-2" : (hasGlobalBlackout ? "border-destructive/40" : "border-border"),
                ].join(" ")}
              >
                <div className={`text-xs font-semibold flex items-center justify-between gap-1 ${today ? "text-primary" : ""} ${inMonth ? "" : "text-muted-foreground"}`}>
                  <span>{view === "day" ? format(d, "EEEE, MMM d") : format(d, "d")}</span>
                  <span className="flex items-center gap-0.5 shrink-0">
                    {hasConflict && <AlertTriangle className="h-3 w-3 text-amber-600" />}
                    {hasGlobalBlackout && <Ban className="h-3 w-3 text-destructive" />}
                  </span>
                </div>
                <div className="flex-1 mt-1 space-y-0.5 overflow-hidden">
                  {/* Global blackouts — full-width banner across the top of the cell */}
                  {globalEntries.map((e) => (
                    <BlackoutPopover key={e.id} entry={e} onRemove={removeBlackout}>
                      <button
                        type="button"
                        className="w-full block text-left text-[10px] sm:text-xs font-semibold rounded-sm bg-destructive/25 text-destructive px-1 py-0.5 truncate"
                      >
                        Closed{e.reason ? ` — ${e.reason}` : ""}
                      </button>
                    </BlackoutPopover>
                  ))}

                  {view === "month" ? (
                    <>
                      {/* Mobile: compact dots row with count. Desktop: stacked names. */}
                      <div className="flex flex-wrap items-center gap-1 sm:hidden">
                        {visibleOnGrid(list).slice(0, 4).map((b) => (
                          <span key={b.id} className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[b.status]}`} />
                        ))}
                        {globalEntries.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-destructive">
                            <Ban className="h-2.5 w-2.5" />{globalEntries.length}
                          </span>
                        )}
                        {visibleOnGrid(list).length > 4 && (
                          <span className="text-[10px] font-semibold text-muted-foreground">+{visibleOnGrid(list).length - 4}</span>
                        )}
                      </div>
                      <div className="hidden sm:block space-y-0.5">
                        {cell.bookings.map((b) => (
                          <div key={b.id} className="flex items-center gap-1 text-xs truncate">
                            <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[b.status]}`} />
                            <span className="truncate">{b.customer_name}</span>
                          </div>
                        ))}
                        {cell.blackouts.map((e) => (
                          <BlackoutPopover key={e.id} entry={e} onRemove={removeBlackout}>
                            <button
                              type="button"
                              className={`w-full flex items-center gap-1 text-xs rounded-sm px-0.5 ${e.overlapCount > 1 ? "bg-amber-500/15 text-amber-800" : "text-muted-foreground"}`}
                            >
                              {e.overlapCount > 1 && <AlertTriangle className="h-2.5 w-2.5 shrink-0" />}
                              <span className="truncate line-through decoration-1">{e.label}</span>
                            </button>
                          </BlackoutPopover>
                        ))}
                        {cell.more > 0 && (
                          <div className="text-xs font-semibold text-muted-foreground">+{cell.more} more</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {cell.bookings.map((b) => (
                        <div key={b.id} className="flex items-center gap-1 text-xs truncate">
                          <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[b.status]}`} />
                          <span className="truncate">{b.customer_name}</span>
                        </div>
                      ))}
                      {cell.blackouts.map((e) => (
                        <BlackoutPopover key={e.id} entry={e} onRemove={removeBlackout}>
                          <button
                            type="button"
                            className={`w-full flex items-center gap-1 text-xs rounded-sm px-0.5 ${e.overlapCount > 1 ? "bg-amber-500/15 text-amber-800" : "text-muted-foreground"}`}
                          >
                            {e.overlapCount > 1 && <AlertTriangle className="h-3 w-3 shrink-0" />}
                            <span className="truncate line-through decoration-1">{e.label}</span>
                          </button>
                        </BlackoutPopover>
                      ))}
                      {cell.more > 0 && (
                        <div className="text-xs font-semibold text-muted-foreground">+{cell.more} more</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>


        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
          {(["pending", "confirmed", "completed", "cancelled"] as BookingStatus[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 capitalize">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${STATUS_COLORS[s]}`} /> {s}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-destructive/30 border border-destructive/40" /> blackout
          </span>
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-amber-600" /> overlapping holds
          </span>
          {loading && <span>Loading…</span>}
        </div>
      </div>

      <Sheet open={!!selectedDate} onOpenChange={(o) => !o && setSelectedDate(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedDate && format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {selectedGlobalEntries.length > 0 && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3">
                <div className="flex items-center gap-2 font-semibold text-destructive">
                  <Ban className="h-4 w-4" /> Closed — all products
                </div>
                <ul className="mt-2 space-y-2">
                  {selectedGlobalEntries.map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm text-destructive/90 whitespace-pre-wrap break-words">
                          {e.reason?.trim() || "No reason given"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{fmtRange(e.start_date, e.end_date)}</div>
                      </div>
                      <BlackoutPopover entry={e} onRemove={removeBlackout}>
                        <button type="button" className="text-xs underline text-destructive shrink-0">Details</button>
                      </BlackoutPopover>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-2 text-xs underline text-destructive"
                  onClick={() => navigate("/admin/blackouts")}
                >
                  Manage blackout dates →
                </button>
              </div>
            )}
            {selectedItemEntries.length > 0 && (
              <div className="rounded-md border border-border p-3">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Ban className="h-4 w-4 text-destructive" /> Blocked items ({selectedItemEntries.length})
                </div>
                <ul className="mt-2 space-y-2">
                  {selectedItemEntries.map((e) => (
                    <li
                      key={e.id}
                      className={`flex items-start justify-between gap-2 rounded-md p-2 ${e.overlapCount > 1 ? "bg-amber-500/10 border border-amber-500/40" : "bg-muted/50"}`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium line-through decoration-1 text-muted-foreground break-words">
                          {e.label}
                        </div>
                        {e.overlapCount > 1 && (
                          <div className="text-[11px] text-amber-800 inline-flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="h-3 w-3" /> {e.overlapCount} holds on this item for this date
                          </div>
                        )}
                        <div className="text-xs whitespace-pre-wrap break-words mt-0.5">
                          {e.reason?.trim() || "No reason given"}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {fmtRange(e.start_date, e.end_date)}
                          {e.created_at ? ` · created ${format(parseISO(e.created_at), "MMM d, yyyy h:mma")}` : ""}
                        </div>
                      </div>
                      <BlackoutPopover entry={e} onRemove={removeBlackout}>
                        <button type="button" className="text-xs underline text-destructive shrink-0">Manage</button>
                      </BlackoutPopover>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              size="sm"
              onClick={() => {
                if (selectedDate) navigate(`/admin/new?date=${selectedDate}`);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> New reservation on this date
            </Button>
            {selected.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings on this date.</p>
            ) : (
              <ul className="divide-y border border-border rounded-md">
                {selected.map((b) => (
                  <li
                    key={b.id}
                    className={`p-3 cursor-pointer hover:bg-accent ${b.status === "cancelled" ? "opacity-50 line-through decoration-1" : ""}`}
                    onClick={() => navigate(`/admin/bookings?open=${b.id}`)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">{b.customer_name}</div>
                      <Badge className={STATUS_BADGE[b.status]}>{b.status}</Badge>
                    </div>
                    {b.customer_phone && (
                      <a href={`tel:${b.customer_phone}`} className="text-sm text-primary inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Phone className="h-3 w-3" /> {b.customer_phone}
                      </a>
                    )}
                    {(b.event_address_line || b.event_city) && (
                      <div className="text-sm text-muted-foreground inline-flex items-start gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{[b.event_address_line, [b.event_city, b.event_zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                    <div className="text-sm mt-1">
                      <span className="text-muted-foreground">Items: </span>
                      {b.booking_items && b.booking_items.length > 0
                        ? b.booking_items.map((it) => it.product_name).join(", ")
                        : b.product_name ?? "—"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
