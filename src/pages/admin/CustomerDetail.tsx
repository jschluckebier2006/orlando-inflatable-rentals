import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { format, parseISO } from "date-fns";
import { ArrowLeft } from "lucide-react";

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [c, setC] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!id) return;
    const { data } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();
    setC(data);
    const { data: bk } = await supabase
      .from("bookings")
      .select("id, event_date, status, total_amount, customer_name")
      .eq("customer_id", id)
      .order("event_date", { ascending: false });
    setBookings((bk as any) ?? []);
  }
  useEffect(() => { load(); }, [id]);

  async function save() {
    if (!c) return;
    setSaving(true);
    const { error } = await (supabase.from("customers") as any).update({
      name: c.name, email: c.email, phone: c.phone,
      address_line: c.address_line, city: c.city, zip: c.zip, notes: c.notes,
    }).eq("id", c.id);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Customer updated" });
  }

  if (!c) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-4 max-w-4xl">
      <Link to="/admin/customers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>
      <h1 className="font-display text-2xl md:text-3xl font-bold">{c.name}</h1>

      <section className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold">Contact info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label>Name</Label><Input value={c.name ?? ""} onChange={(e) => setC({ ...c, name: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={c.email ?? ""} onChange={(e) => setC({ ...c, email: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={c.phone ?? ""} onChange={(e) => setC({ ...c, phone: e.target.value })} /></div>
          <div><Label>City</Label><Input value={c.city ?? ""} onChange={(e) => setC({ ...c, city: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Address</Label><Input value={c.address_line ?? ""} onChange={(e) => setC({ ...c, address_line: e.target.value })} /></div>
          <div><Label>ZIP</Label><Input value={c.zip ?? ""} onChange={(e) => setC({ ...c, zip: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Customer notes</Label><Textarea rows={3} value={c.notes ?? ""} onChange={(e) => setC({ ...c, notes: e.target.value })} /></div>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </section>

      <section className="bg-card border border-border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Booking history ({bookings.length})</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          <ul className="divide-y border border-border rounded-md">
            {bookings.map((b) => (
              <li key={b.id} className="p-3 flex items-center justify-between gap-2">
                <div>
                  <Link to={`/admin/bookings?open=${b.id}`} className="font-medium hover:underline">
                    {format(parseISO(b.event_date), "MMM d, yyyy")}
                  </Link>
                  <div className="text-xs text-muted-foreground">${Number(b.total_amount ?? 0).toFixed(2)}</div>
                </div>
                <Badge>{b.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-card border border-border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Activity & notes</h2>
        <ActivityFeed customerId={c.id} />
      </section>
    </div>
  );
}
