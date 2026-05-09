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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, Phone, MapPin, Plus } from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface BookingItem { id: string; product_name: string; }
interface Booking {
  id: string;
  event_date: string;
  event_end_date: string | null;
  event_start_time: string | null;
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

export default function AdminCalendar() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("id, event_date, event_end_date, event_start_time, customer_name, customer_phone, event_address_line, event_city, event_zip, status, product_id, product_name, booking_items(id, product_name)")
      .order("event_date", { ascending: true });
    setBookings((data as any) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const dayMap = useMemo(() => {
    const m = new Map<string, Booking[]>();
    for (const b of bookings) {
      if (b.status === "cancelled") {
        // still show but lighter
      }
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
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            {(["month", "week", "day"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm capitalize ${view === v ? "bg-primary text-primary-foreground" : "bg-background"}`}
              >
                {v}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Today</Button>
          <Button variant="outline" size="sm" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button size="sm" onClick={() => navigate("/admin/new")}>
            <Plus className="h-4 w-4 mr-1" /> New reservation
          </Button>
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
            const inMonth = view !== "month" || isSameMonth(d, cursor);
            const today = isToday(d);
            return (
              <button
                key={key}
                onClick={() => setSelectedDate(key)}
                className={[
                  view === "day" ? "min-h-[300px]" : "min-h-[5rem] aspect-square",
                  "rounded-md border p-1.5 flex flex-col text-left transition hover:bg-accent",
                  inMonth ? "bg-background" : "bg-muted/30",
                  today ? "border-primary border-2" : "border-border",
                ].join(" ")}
              >
                <div className={`text-xs font-semibold ${today ? "text-primary" : ""} ${inMonth ? "" : "text-muted-foreground"}`}>
                  {view === "day" ? format(d, "EEEE, MMM d") : format(d, "d")}
                </div>
                <div className="flex-1 mt-1 space-y-0.5 overflow-hidden">
                  {list.slice(0, view === "month" ? 3 : 8).map((b) => (
                    <div key={b.id} className="flex items-center gap-1 text-xs truncate">
                      <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[b.status]}`} />
                      <span className="truncate">{b.customer_name}</span>
                    </div>
                  ))}
                  {list.length > (view === "month" ? 3 : 8) && (
                    <div className="text-[10px] text-muted-foreground">+{list.length - (view === "month" ? 3 : 8)} more</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
          {(["pending", "confirmed", "completed", "cancelled"] as BookingStatus[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 capitalize">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${STATUS_COLORS[s]}`} /> {s}
            </span>
          ))}
          {loading && <span>Loading…</span>}
        </div>
      </div>

      <Sheet open={!!selectedDate} onOpenChange={(o) => !o && setSelectedDate(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedDate && format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
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
                    className="p-3 cursor-pointer hover:bg-accent"
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
