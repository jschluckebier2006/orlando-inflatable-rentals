import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Upload, Star, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";

const CATS = ["water-slides","bounce-slide-combos","interactive-games","bounce-houses","obstacle-courses","concessions","tables-chairs","tents"];

interface Spec { label: string; value: string; }

interface Item {
  id: string; name: string; slug: string; category: string; base_price: number;
  description: string | null; dimensions: string | null; capacity: string | null;
  age_range: string | null; stock_count: number; active: boolean; sort_order: number;
  primary_image_url: string | null; legacy_image: string | null;
  bookable_online: boolean; specs: Spec[];
}
interface Img { id: string; url: string; storage_path: string | null; is_primary: boolean; sort_order: number; }
interface Blackout { id: string; start_date: string; end_date: string; reason: string | null; }
interface Maint { id: string; performed_at: string; kind: string; notes: string | null; }
interface BookingRow { id: string; event_date: string; event_end_date: string | null; customer_name: string; status: string; }

export default function InventoryDetail() {
  const { id } = useParams();
  const isNew = id === "new";
  const nav = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<Img[]>([]);
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);
  const [maint, setMaint] = useState<Maint[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [newBlackout, setNewBlackout] = useState({ start_date: "", end_date: "", reason: "" });
  const [newMaint, setNewMaint] = useState({ performed_at: format(new Date(), "yyyy-MM-dd"), kind: "cleaning", notes: "" });

  async function load() {
    setLoading(true);
    if (isNew) {
      setItem({ id: "", name: "", slug: "", category: "water-slides", base_price: 0, description: "", dimensions: "", capacity: "", age_range: "", stock_count: 1, active: true, sort_order: 999, primary_image_url: null, legacy_image: null, bookable_online: true, specs: [] });
      setLoading(false); return;
    }
    const [it, im, bl, mt, bk] = await Promise.all([
      (supabase.from("inventory_items") as any).select("*").eq("id", id).maybeSingle(),
      (supabase.from("inventory_images") as any).select("*").eq("item_id", id).order("sort_order"),
      (supabase.from("inventory_blackouts") as any).select("*").eq("item_id", id).order("start_date", { ascending: false }),
      (supabase.from("inventory_maintenance") as any).select("*").eq("item_id", id).order("performed_at", { ascending: false }),
      (supabase.from("booking_items") as any).select("booking_id, bookings:booking_id(id,event_date,event_end_date,customer_name,status)").eq("product_id", id).limit(50),
    ]);
    const raw = it.data as any;
    setItem(raw ? ({ ...raw, bookable_online: raw.bookable_online !== false, specs: Array.isArray(raw.specs) ? raw.specs : [] } as Item) : null);
    setImages((im.data ?? []) as Img[]);
    setBlackouts((bl.data ?? []) as Blackout[]);
    setMaint((mt.data ?? []) as Maint[]);
    setBookings(((bk.data ?? []) as any[]).map((r) => r.bookings).filter(Boolean));
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  function patch(p: Partial<Item>) { setItem((x) => x ? { ...x, ...p } : x); }

  async function save() {
    if (!item) return;
    if (!item.name.trim() || !item.slug.trim() || !item.category) {
      toast({ title: "Name, slug and category are required", variant: "destructive" }); return;
    }
    setSaving(true);
    if (isNew) {
      const newId = item.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
      const { error } = await (supabase.from("inventory_items") as any).insert({ ...item, id: newId });
      setSaving(false);
      if (error) { toast({ title: "Create failed", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Item created" });
      nav(`/admin/inventory/${newId}`);
      return;
    }
    const { id: _id, ...rest } = item;
    const { error } = await (supabase.from("inventory_items") as any).update(rest).eq("id", id);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Saved" });
  }

  async function uploadImage(file: File) {
    if (!id || isNew) { toast({ title: "Save the item first", variant: "destructive" }); return; }
    const path = `${id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("inventory-images").upload(path, file, { contentType: file.type });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("inventory-images").getPublicUrl(path);
    const isFirst = images.length === 0;
    await (supabase.from("inventory_images") as any).insert({ item_id: id, url: publicUrl, storage_path: path, is_primary: isFirst, sort_order: images.length * 10 });
    if (isFirst) await (supabase.from("inventory_items") as any).update({ primary_image_url: publicUrl }).eq("id", id);
    load();
  }

  async function setPrimary(img: Img) {
    await (supabase.from("inventory_images") as any).update({ is_primary: false }).eq("item_id", id);
    await (supabase.from("inventory_images") as any).update({ is_primary: true }).eq("id", img.id);
    await (supabase.from("inventory_items") as any).update({ primary_image_url: img.url }).eq("id", id);
    load();
  }

  async function deleteImage(img: Img) {
    if (!confirm("Delete this image?")) return;
    if (img.storage_path) await supabase.storage.from("inventory-images").remove([img.storage_path]);
    await (supabase.from("inventory_images") as any).delete().eq("id", img.id);
    if (img.is_primary) await (supabase.from("inventory_items") as any).update({ primary_image_url: null }).eq("id", id);
    load();
  }

  async function addBlackout() {
    if (!newBlackout.start_date || !newBlackout.end_date) return;
    const { error } = await (supabase.from("inventory_blackouts") as any).insert({ ...newBlackout, item_id: id });
    if (error) { toast({ title: "Blackout failed", description: error.message, variant: "destructive" }); return; }
    setNewBlackout({ start_date: "", end_date: "", reason: "" });
    load();
  }
  async function delBlackout(b: Blackout) {
    await (supabase.from("inventory_blackouts") as any).delete().eq("id", b.id);
    load();
  }

  async function addMaint() {
    if (!newMaint.performed_at) return;
    await (supabase.from("inventory_maintenance") as any).insert({ ...newMaint, item_id: id });
    setNewMaint({ performed_at: format(new Date(), "yyyy-MM-dd"), kind: "cleaning", notes: "" });
    load();
  }
  async function delMaint(m: Maint) {
    await (supabase.from("inventory_maintenance") as any).delete().eq("id", m.id);
    load();
  }

  if (loading || !item) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-4xl">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => nav("/admin/inventory")}><ArrowLeft className="h-4 w-4"/></Button>
          <h1 className="text-2xl font-display font-bold truncate min-w-0">{isNew ? "New item" : item.name || id}</h1>
        </div>
        <Button onClick={save} disabled={saving} className="shrink-0">{saving ? "Saving…" : "Save"}</Button>
      </div>

      <Tabs defaultValue="details">
        <div className="overflow-x-auto lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-border">
          <TabsList className="w-max lg:w-auto">
            <TabsTrigger value="details" className="whitespace-nowrap">Details & pricing</TabsTrigger>
            <TabsTrigger value="images" disabled={isNew} className="whitespace-nowrap">Images</TabsTrigger>
            <TabsTrigger value="blackouts" disabled={isNew} className="whitespace-nowrap">Availability</TabsTrigger>
            <TabsTrigger value="maintenance" disabled={isNew} className="whitespace-nowrap">Maintenance</TabsTrigger>
            <TabsTrigger value="history" disabled={isNew} className="whitespace-nowrap">Bookings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details">
          <Card className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>Name *</Label><Input value={item.name} onChange={(e)=>patch({name: e.target.value})}/></div>
              <div><Label>Slug *</Label><Input value={item.slug} onChange={(e)=>patch({slug: e.target.value})}/></div>
              <div>
                <Label>Category *</Label>
                <Select value={item.category} onValueChange={(v)=>patch({category: v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Base price ($/day)</Label><Input type="number" value={item.base_price} onChange={(e)=>patch({base_price: Number(e.target.value)||0})}/></div>
              <div><Label>Stock count (units owned)</Label><Input type="number" min={1} value={item.stock_count} onChange={(e)=>patch({stock_count: Math.max(1, Number(e.target.value)||1)})}/></div>
              <div><Label>Sort order</Label><Input type="number" value={item.sort_order} onChange={(e)=>patch({sort_order: Number(e.target.value)||0})}/></div>
              <div><Label>Dimensions</Label><Input value={item.dimensions ?? ""} onChange={(e)=>patch({dimensions: e.target.value})}/></div>
              <div><Label>Capacity</Label><Input value={item.capacity ?? ""} onChange={(e)=>patch({capacity: e.target.value})}/></div>
              <div className="md:col-span-2"><Label>Age range</Label><Input value={item.age_range ?? ""} onChange={(e)=>patch({age_range: e.target.value})}/></div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea rows={4} value={item.description ?? ""} onChange={(e)=>patch({description: e.target.value})}/></div>
              <div className="md:col-span-2 flex items-center gap-2"><Switch checked={item.active} onCheckedChange={(v)=>patch({active: v})}/><Label>Visible on site</Label></div>
              <div className="md:col-span-2 flex items-center gap-2"><Switch checked={item.bookable_online} onCheckedChange={(v)=>patch({bookable_online: v})}/><Label>Bookable online (off = phone reservations only)</Label></div>
              <div className="md:col-span-2 space-y-2">
                <Label>Specs (shown as a small table on the product card)</Label>
                {item.specs.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={s.label}
                      onChange={(e) => patch({ specs: item.specs.map((x, j) => j === i ? { ...x, label: e.target.value } : x) })}
                    />
                    <Input
                      placeholder="Value"
                      value={s.value}
                      onChange={(e) => patch({ specs: item.specs.map((x, j) => j === i ? { ...x, value: e.target.value } : x) })}
                    />
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => patch({ specs: item.specs.filter((_, j) => j !== i) })} aria-label="Remove spec">
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => patch({ specs: [...item.specs, { label: "", value: "" }] })}>
                  <Plus className="h-4 w-4 mr-1"/> Add spec row
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card className="p-4 space-y-3">
            <div>
              <Label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.currentTarget.value = ""; }}/>
                <span className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted text-sm"><Upload className="h-4 w-4"/> Upload image</span>
              </Label>
            </div>
            {images.length === 0 ? (
              <p className="text-sm text-muted-foreground">No uploaded images yet. {item.legacy_image && "Currently using bundled image: " + item.legacy_image}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((im) => (
                  <div key={im.id} className="border rounded-md overflow-hidden">
                    <div className="aspect-square bg-muted"><img src={im.url} alt="" className="w-full h-full object-contain"/></div>
                    <div className="p-2 flex items-center justify-between gap-1">
                      <Button size="sm" variant={im.is_primary ? "default" : "outline"} className="min-h-[44px]" onClick={() => setPrimary(im)} disabled={im.is_primary}>
                        <Star className="h-3 w-3 mr-1"/> {im.is_primary ? "Primary" : "Make primary"}
                      </Button>
                      <Button size="icon" variant="ghost" className="h-11 w-11" onClick={() => deleteImage(im)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="blackouts">
          <Card className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Mark unavailable date range</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                <div><Label>Start</Label><Input type="date" value={newBlackout.start_date} onChange={(e)=>setNewBlackout({...newBlackout, start_date: e.target.value})}/></div>
                <div><Label>End</Label><Input type="date" value={newBlackout.end_date} onChange={(e)=>setNewBlackout({...newBlackout, end_date: e.target.value})}/></div>
                <div className="md:col-span-1"><Label>Reason</Label><Input value={newBlackout.reason} onChange={(e)=>setNewBlackout({...newBlackout, reason: e.target.value})} placeholder="Repair, vacation…"/></div>
                <Button onClick={addBlackout}><Plus className="h-4 w-4 mr-1"/> Add</Button>
              </div>
            </div>
            <div className="divide-y border rounded-md">
              {blackouts.length === 0 ? <p className="p-3 text-sm text-muted-foreground">No blackouts.</p> : blackouts.map((b) => (
                <div key={b.id} className="p-2 flex items-center gap-2 text-sm">
                  <div className="flex-1">
                    <strong>{format(parseISO(b.start_date), "MMM d, yyyy")}</strong> → <strong>{format(parseISO(b.end_date), "MMM d, yyyy")}</strong>
                    {b.reason && <span className="text-muted-foreground"> · {b.reason}</span>}
                  </div>
                  <Button size="icon" variant="ghost" className="h-11 w-11" onClick={() => delBlackout(b)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <div><Label>Date</Label><Input type="date" value={newMaint.performed_at} onChange={(e)=>setNewMaint({...newMaint, performed_at: e.target.value})}/></div>
              <div>
                <Label>Kind</Label>
                <Select value={newMaint.kind} onValueChange={(v)=>setNewMaint({...newMaint, kind: v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1"><Label>Notes</Label><Input value={newMaint.notes} onChange={(e)=>setNewMaint({...newMaint, notes: e.target.value})}/></div>
              <Button onClick={addMaint}><Plus className="h-4 w-4 mr-1"/> Log</Button>
            </div>
            <div className="divide-y border rounded-md">
              {maint.length === 0 ? <p className="p-3 text-sm text-muted-foreground">No log entries.</p> : maint.map((m) => (
                <div key={m.id} className="p-2 flex items-center gap-2 text-sm">
                  <div className="flex-1">
                    <strong>{format(parseISO(m.performed_at), "MMM d, yyyy")}</strong> · <span className="capitalize">{m.kind}</span>
                    {m.notes && <span className="text-muted-foreground"> — {m.notes}</span>}
                  </div>
                  <Button size="icon" variant="ghost" className="h-11 w-11" onClick={() => delMaint(m)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="overflow-hidden">
            {bookings.length === 0 ? <p className="p-4 text-sm text-muted-foreground">No bookings for this item yet.</p> : (
              <div className="divide-y">
                {bookings.map((b) => (
                  <Link key={b.id} to={`/admin/bookings?open=${b.id}`} className="p-3 flex items-center gap-3 hover:bg-muted/50 text-sm">
                    <div className="flex-1">
                      <div className="font-medium">{b.customer_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(b.event_date), "MMM d, yyyy")}
                        {b.event_end_date && b.event_end_date !== b.event_date && ` → ${format(parseISO(b.event_end_date), "MMM d, yyyy")}`}
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-wide">{b.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}