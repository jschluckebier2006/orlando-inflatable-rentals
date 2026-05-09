import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
}
interface Stats {
  bookings: number;
  lifetime: number;
  last: string | null;
}

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [stats, setStats] = useState<Record<string, Stats>>({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data: cs } = await supabase
        .from("customers")
        .select("id, name, email, phone, city")
        .order("name");
      const list = (cs as CustomerRow[]) ?? [];
      setCustomers(list);

      const { data: bk } = await supabase
        .from("bookings")
        .select("customer_id, total_amount, event_date");
      const map: Record<string, Stats> = {};
      for (const b of (bk as any[]) ?? []) {
        if (!b.customer_id) continue;
        const s = map[b.customer_id] ?? { bookings: 0, lifetime: 0, last: null };
        s.bookings += 1;
        s.lifetime += Number(b.total_amount ?? 0);
        if (!s.last || b.event_date > s.last) s.last = b.event_date;
        map[b.customer_id] = s;
      }
      setStats(map);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(t) ||
        c.email.toLowerCase().includes(t) ||
        (c.phone ?? "").toLowerCase().includes(t) ||
        (c.city ?? "").toLowerCase().includes(t),
    );
  }, [customers, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Customers</h1>
        <Input
          placeholder="Search name, email, phone, city…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead className="text-right">Lifetime</TableHead>
              <TableHead>Last booking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Loading…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No customers</TableCell></TableRow>
            ) : filtered.map((c) => {
              const s = stats[c.id] ?? { bookings: 0, lifetime: 0, last: null };
              return (
                <TableRow key={c.id} className="cursor-pointer hover:bg-accent">
                  <TableCell>
                    <Link to={`/admin/customers/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone ?? "—"}</TableCell>
                  <TableCell>{c.city ?? "—"}</TableCell>
                  <TableCell className="text-right">{s.bookings}</TableCell>
                  <TableCell className="text-right">${s.lifetime.toFixed(2)}</TableCell>
                  <TableCell>{s.last ? format(parseISO(s.last), "MMM d, yyyy") : "—"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
