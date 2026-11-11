import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Search } from "lucide-react";
import { loadAppSettings } from "@/lib/appSettings";

type ZoneStatus = "free" | "fee" | "call";
const DEFAULT_ZONE_FEE = 50;
const STATUS_OPTIONS: { value: ZoneStatus; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "fee", label: "Fee" },
  { value: "call", label: "Call" },
];
/** Switching status keeps the fee consistent: only "fee" ZIPs carry a fee. */
function withStatus(z: Zone, status: ZoneStatus): Zone {
  return { ...z, status, fee: status === "fee" ? (Number(z.fee) > 0 ? Number(z.fee) : DEFAULT_ZONE_FEE) : 0 };
}
interface Zone { zip: string; city: string; fee: number; status: ZoneStatus; }

export default function Settings() {
  const { toast } = useToast();
  const [taxPct, setTaxPct] = useState("7");
  const [waiverPct, setWaiverPct] = useState("10");
  const [deposit, setDeposit] = useState("50");
  const [feePct, setFeePct] = useState("4");
  const [savingPricing, setSavingPricing] = useState(false);

  const [reviewsCount, setReviewsCount] = useState("68");
  const [reviewsRating, setReviewsRating] = useState("5.0");
  const [savingReviews, setSavingReviews] = useState(false);

  const [zones, setZones] = useState<Zone[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ZoneStatus>("all");
  const [newZone, setNewZone] = useState<Zone>({ zip: "", city: "", fee: 0, status: "free" });

  async function loadAll() {
    const [{ data: s }, { data: z }] = await Promise.all([
      (supabase.from("app_settings") as any).select("*").eq("id", 1).maybeSingle(),
      (supabase.from("delivery_zones") as any).select("*").order("zip"),
    ]);
    if (s) {
      setTaxPct(String(Number(s.tax_rate) * 100));
      setWaiverPct(String(Number(s.damage_waiver_rate) * 100));
      setDeposit(String(Number(s.default_deposit)));
      setFeePct(String(Number(s.online_checkout_fee_rate ?? 0.04) * 100));
      if (s.google_reviews_count != null) setReviewsCount(String(s.google_reviews_count));
      if (s.google_rating != null) setReviewsRating(String(s.google_rating));
    }
    setZones((z ?? []) as Zone[]);
  }
  useEffect(() => { loadAll(); }, []);

  async function savePricing() {
    const tax = Number(taxPct);
    const waiver = Number(waiverPct);
    const dep = Number(deposit);
    const fee = Number(feePct);
    if (!isFinite(tax) || tax < 0 || tax > 50) return toast({ title: "Tax % must be 0–50", variant: "destructive" });
    if (!isFinite(waiver) || waiver < 0 || waiver > 50) return toast({ title: "Waiver % must be 0–50", variant: "destructive" });
    if (!isFinite(dep) || dep < 0) return toast({ title: "Deposit must be ≥ 0", variant: "destructive" });
    if (!isFinite(fee) || fee < 0 || fee > 20) return toast({ title: "Fee % must be 0–20", variant: "destructive" });
    setSavingPricing(true);
    const { error } = await (supabase.from("app_settings") as any).update({
      tax_rate: tax / 100, damage_waiver_rate: waiver / 100, default_deposit: dep, online_checkout_fee_rate: fee / 100,
    }).eq("id", 1);
    setSavingPricing(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Pricing settings saved" });
    await loadAppSettings();
  }

  async function saveReviews() {
    const count = Number(reviewsCount);
    const rating = Number(reviewsRating);
    if (!Number.isInteger(count) || count < 0 || count > 100000) return toast({ title: "Reviews count must be 0–100000", variant: "destructive" });
    if (!isFinite(rating) || rating < 0 || rating > 5) return toast({ title: "Rating must be 0–5", variant: "destructive" });
    setSavingReviews(true);
    const { error } = await (supabase.from("app_settings") as any).update({
      google_reviews_count: count,
      google_rating: rating,
      google_reviews_updated_at: new Date().toISOString(),
    }).eq("id", 1);
    setSavingReviews(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Google reviews updated" });
    await loadAppSettings();
  }

  async function upsertZone(z: Zone) {
    if (!/^\d{5}$/.test(z.zip)) return toast({ title: "ZIP must be 5 digits", variant: "destructive" });
    if (!z.city.trim()) return toast({ title: "City required", variant: "destructive" });
    const fee = z.status === "fee" ? Math.round(Number(z.fee) * 100) / 100 : 0;
    if (z.status === "fee" && (!isFinite(fee) || fee <= 0 || fee > 500)) {
      return toast({ title: "Fee must be between $0.01 and $500", variant: "destructive" });
    }
    const { error } = await (supabase.from("delivery_zones") as any).upsert({
      zip: z.zip, city: z.city.trim(), fee, status: z.status,
    });
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: `ZIP ${z.zip} saved` });
    setNewZone({ zip: "", city: "", fee: 0, status: "free" });
    loadAll();
    loadAppSettings();
  }

  async function deleteZone(zip: string) {
    if (!confirm(`Remove ZIP ${zip} from delivery zones?`)) return;
    const { error } = await (supabase.from("delivery_zones") as any).delete().eq("zip", zip);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Removed" });
    loadAll();
    loadAppSettings();
  }

  const filtered = useMemo(() => zones.filter((z) => {
    if (statusFilter !== "all" && z.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return z.zip.includes(q) || z.city.toLowerCase().includes(q);
  }), [zones, search, statusFilter]);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>

      <Card className="p-4 space-y-4">
        <div>
          <h2 className="font-semibold">Pricing & deposits</h2>
          <p className="text-xs text-muted-foreground">Changes apply immediately to new bookings on the storefront.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label>Sales tax %</Label>
            <div className="flex items-center gap-1">
              <Input type="number" step="0.01" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} />
              <span className="text-sm">%</span>
            </div>
          </div>
          <div>
            <Label>Damage waiver %</Label>
            <div className="flex items-center gap-1">
              <Input type="number" step="0.01" value={waiverPct} onChange={(e) => setWaiverPct(e.target.value)} />
              <span className="text-sm">%</span>
            </div>
          </div>
          <div>
            <Label>Online payment fee %</Label>
            <div className="flex items-center gap-1">
              <Input type="number" step="0.01" value={feePct} onChange={(e) => setFeePct(e.target.value)} />
              <span className="text-sm">%</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Card-on-file only; skipped for cash on delivery.</p>
          </div>
          <div>
            <Label>Default deposit ($)</Label>
            <Input type="number" step="1" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={savePricing} disabled={savingPricing}>{savingPricing ? "Saving…" : "Save pricing"}</Button>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div>
          <h2 className="font-semibold">Google reviews</h2>
          <p className="text-xs text-muted-foreground">Manually update the homepage review count and star rating. Changes apply instantly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>Reviews count</Label>
            <Input type="number" min="0" step="1" value={reviewsCount} onChange={(e) => setReviewsCount(e.target.value)} />
          </div>
          <div>
            <Label>Star rating</Label>
            <Input type="number" min="0" max="5" step="0.1" value={reviewsRating} onChange={(e) => setReviewsRating(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={saveReviews} disabled={savingReviews}>{savingReviews ? "Saving…" : "Save reviews"}</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div>
          <h2 className="font-semibold">Delivery zones</h2>
          <p className="text-xs text-muted-foreground">
            Per-ZIP availability. <strong>Free</strong> = $0 delivery, bookable online. <strong>Fee</strong> = bookable online with the delivery fee shown. <strong>Call</strong> = online booking blocked; customer calls, texts, or sends a request. Unlisted ZIPs are treated as call.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end p-3 rounded-md border bg-muted/30">
          <div className="md:col-span-2"><Label>ZIP</Label><Input maxLength={5} value={newZone.zip} onChange={(e) => setNewZone({ ...newZone, zip: e.target.value.replace(/\D/g, "").slice(0, 5) })} placeholder="32801" /></div>
          <div className="md:col-span-4"><Label>City</Label><Input value={newZone.city} onChange={(e) => setNewZone({ ...newZone, city: e.target.value })} placeholder="Orlando" /></div>
          <div className="md:col-span-2">
            <Label>Status</Label>
            <Select value={newZone.status} onValueChange={(v) => setNewZone(withStatus(newZone, v as ZoneStatus))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Fee ($)</Label>
            <Input type="number" min="0" step="1" disabled={newZone.status !== "fee"} value={newZone.fee}
              onChange={(e) => setNewZone({ ...newZone, fee: Number(e.target.value) })} />
          </div>
          <div className="md:col-span-2">
            <Button className="w-full" onClick={() => upsertZone(newZone)}><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search ZIP or city…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:grid grid-cols-12 gap-2 px-2 text-xs font-semibold text-muted-foreground">
          <div className="col-span-2 pl-1">ZIP</div>
          <div className="col-span-4">City</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Fee ($)</div>
          <div className="col-span-2" />
        </div>
        <div className="border rounded-md divide-y max-h-[480px] overflow-y-auto">
          {filtered.length === 0 ? <p className="p-3 text-sm text-muted-foreground">No matching zones.</p> :
            filtered.map((z) => <ZoneRow key={z.zip} zone={z} onSave={upsertZone} onDelete={() => deleteZone(z.zip)} />)}
        </div>
      </Card>
    </div>
  );
}

function ZoneRow({ zone, onSave, onDelete }: { zone: Zone; onSave: (z: Zone) => void; onDelete: () => void; }) {
  const [draft, setDraft] = useState<Zone>(zone);
  const dirty = draft.city !== zone.city || draft.status !== zone.status || Number(draft.fee) !== Number(zone.fee);
  useEffect(() => { setDraft(zone); }, [zone.zip, zone.city, zone.fee, zone.status]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center p-2">
      <div className="md:col-span-2 font-mono text-sm pl-1">{zone.zip}</div>
      <Input className="md:col-span-4" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
      <div className="md:col-span-2">
        <Select value={draft.status} onValueChange={(v) => setDraft(withStatus(draft, v as ZoneStatus))}>
          <SelectTrigger aria-label={`Status for ${zone.zip}`}><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Input className="md:col-span-2" type="number" min="0" step="1" aria-label={`Fee for ${zone.zip}`}
        disabled={draft.status !== "fee"} value={draft.fee}
        onChange={(e) => setDraft({ ...draft, fee: Number(e.target.value) })} />
      <div className="md:col-span-2 flex gap-1 justify-end">
        <Button size="sm" disabled={!dirty} onClick={() => onSave(draft)}>Save</Button>
        <Button size="icon" variant="ghost" onClick={onDelete} title="Delete"><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
