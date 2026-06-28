import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Boxes, Copy, Plus, Search, ArrowUp, ArrowDown, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InventoryImageHealth, { useImageHealthRows, imageIssueCount } from "@/components/admin/InventoryImageHealth";
import { AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Item {
  id: string;
  name: string;
  slug: string;
  category: string;
  base_price: number;
  stock_count: number;
  active: boolean;
  sort_order: number;
  primary_image_url: string | null;
  legacy_image: string | null;
}

const CATS = ["water-slides","bounce-slide-combos","interactive-games","bounce-houses","obstacle-courses","concessions","tables-chairs"];

export default function Inventory() {
  const { toast } = useToast();
  const nav = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [tab, setTab] = useState<"items" | "health">("items");
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { rows: healthRows } = useImageHealthRows();
  const issues = imageIssueCount(healthRows);

  async function load() {
    setLoading(true);
    const { data } = await (supabase.from("inventory_items") as any)
      .select("id,name,slug,category,base_price,stock_count,active,sort_order,primary_image_url,legacy_image")
      .order("category").order("sort_order");
    setItems((data ?? []) as Item[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((i) => {
    if (cat !== "all" && i.category !== cat) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.id.includes(search)) return false;
    return true;
  }), [items, cat, search]);

  async function move(item: Item, dir: -1 | 1) {
    const same = items.filter((i) => i.category === item.category).sort((a,b) => a.sort_order - b.sort_order);
    const idx = same.findIndex((i) => i.id === item.id);
    const swap = same[idx + dir];
    if (!swap) return;
    await Promise.all([
      (supabase.from("inventory_items") as any).update({ sort_order: swap.sort_order }).eq("id", item.id),
      (supabase.from("inventory_items") as any).update({ sort_order: item.sort_order }).eq("id", swap.id),
    ]);
    load();
  }

  async function toggleActive(item: Item) {
    await (supabase.from("inventory_items") as any).update({ active: !item.active }).eq("id", item.id);
    load();
  }

  async function duplicate(item: Item) {
    const newId = `${item.id}-copy-${Date.now().toString(36)}`;
    const { data: full } = await (supabase.from("inventory_items") as any).select("*").eq("id", item.id).single();
    if (!full) return;
    const insert = { ...full, id: newId, slug: `${full.slug}-copy`, name: `${full.name} (Copy)`, active: false, sort_order: full.sort_order + 1 };
    delete (insert as any).created_at; delete (insert as any).updated_at;
    const { error } = await (supabase.from("inventory_items") as any).insert(insert);
    if (error) { toast({ title: "Duplicate failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Item duplicated" });
    nav(`/admin/inventory/${newId}`);
  }


  async function deleteProduct(item: Item) {
    setDeleting(true);

    {
      const { error } = await (supabase.from("inventory_images") as any).delete().eq("item_id", item.id);
      if (error) console.warn("[deleteProduct] inventory_images cleanup failed:", error.message);
    }
    {
      const { error } = await (supabase.from("inventory_blackouts") as any).delete().eq("item_id", item.id);
      if (error) console.warn("[deleteProduct] inventory_blackouts cleanup failed:", error.message);
    }
    {
      const { error } = await (supabase.from("inventory_maintenance") as any).delete().eq("item_id", item.id);
      if (error) console.warn("[deleteProduct] inventory_maintenance cleanup failed:", error.message);
    }

    try {
      const { data: files, error: listErr } = await supabase.storage
        .from("inventory-images")
        .list(`${item.id}/`);
      if (listErr) {
        console.warn("[deleteProduct] storage list failed:", listErr.message);
      } else if (files && files.length > 0) {
        const paths = files.map((f) => `${item.id}/${f.name}`);
        const { error: rmErr } = await supabase.storage.from("inventory-images").remove(paths);
        if (rmErr) console.warn("[deleteProduct] storage remove failed:", rmErr.message);
      }
    } catch (e: any) {
      console.warn("[deleteProduct] storage cleanup threw:", e?.message ?? e);
    }

    const { error: parentErr } = await (supabase.from("inventory_items") as any).delete().eq("id", item.id);
    if (parentErr) {
      setDeleting(false);
      toast({ title: "Delete failed", description: parentErr.message, variant: "destructive" });
      return;
    }

    setDeleting(false);
    toast({ title: "Product deleted" });
    setDeleteTarget(null);
    setItems((prev) => prev.filter((x) => x.id !== item.id));
    load();
  }

  const imgUrl = (i: Item) => i.primary_image_url || (i.legacy_image ? `/src/assets/inventory/${i.legacy_image}` : null);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2"><Boxes className="h-6 w-6"/> Inventory</h1>
          <p className="text-sm text-muted-foreground">{items.length} items · edit pricing, photos, stock, and availability.</p>
        </div>
        <div className="flex gap-2">
          
          <Button onClick={() => nav("/admin/inventory/new")}><Plus className="h-4 w-4 mr-1"/> New item</Button>
        </div>
      </div>

      {issues > 0 && tab === "items" && (
        <Card className="p-3 flex items-center gap-2 border-destructive/40 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive"/>
          <div className="text-sm flex-1">
            <strong>{issues}</strong> active item{issues === 1 ? "" : "s"} need image attention.
          </div>
          <Button size="sm" variant="outline" onClick={() => setTab("health")}>Review</Button>
        </Card>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="health">Image health{issues > 0 ? ` (${issues})` : ""}</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="space-y-4 mt-4">
      <Card className="p-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center">
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input className="pl-8" placeholder="Search name or ID…" value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden">
        {loading ? <div className="p-8 text-sm text-center text-muted-foreground">Loading…</div>
          : filtered.length === 0 ? <div className="p-8 text-sm text-center text-muted-foreground">No items match.</div>
          : (
          <div className="divide-y">
            {filtered.map((it) => (
              <div key={it.id} className="p-3 flex items-center gap-3">
                <div className="w-14 h-14 bg-muted rounded overflow-hidden flex-shrink-0">
                  {imgUrl(it) ? (
                    <img src={imgUrl(it)!} alt={it.name} className="w-full h-full object-contain" loading="lazy"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">no img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/admin/inventory/${it.id}`} className="font-medium hover:underline truncate block">{it.name}</Link>
                  <div className="flex items-center flex-wrap gap-2 mt-1">
                    <span className="lg:hidden font-semibold text-sm">${Number(it.base_price).toFixed(0)}</span>
                    <span className="lg:hidden text-xs text-muted-foreground">/ day</span>
                    <Badge variant="outline" className="text-xs hidden lg:inline-flex">{it.category}</Badge>
                    {!it.active && <Badge variant="destructive" className="text-xs">Hidden</Badge>}
                    <Badge variant="secondary" className="text-xs">Stock {it.stock_count}</Badge>
                  </div>
                </div>
                <div className="text-right hidden lg:block">
                  <div className="font-semibold">${Number(it.base_price).toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">base / day</div>
                </div>
                <div className="hidden lg:flex items-center gap-1">
                  <Button size="icon" variant="ghost" title="Move up" onClick={() => move(it, -1)}><ArrowUp className="h-4 w-4"/></Button>
                  <Button size="icon" variant="ghost" title="Move down" onClick={() => move(it, 1)}><ArrowDown className="h-4 w-4"/></Button>
                  <Button size="icon" variant="ghost" title={it.active?"Hide":"Show"} onClick={() => toggleActive(it)}>
                    {it.active ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}
                  </Button>
                  <Button size="icon" variant="ghost" title="Duplicate" onClick={() => duplicate(it)}><Copy className="h-4 w-4"/></Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="lg:hidden h-11 w-11" aria-label="Row actions">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => move(it, -1)}><ArrowUp className="h-4 w-4 mr-2"/>Move up</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => move(it, 1)}><ArrowDown className="h-4 w-4 mr-2"/>Move down</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleActive(it)}>
                      {it.active ? <><EyeOff className="h-4 w-4 mr-2"/>Hide</> : <><Eye className="h-4 w-4 mr-2"/>Show</>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicate(it)}><Copy className="h-4 w-4 mr-2"/>Duplicate product</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteTarget(it)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />Delete product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </Card>
        </TabsContent>
        <TabsContent value="health" className="mt-4">
          <InventoryImageHealth />
        </TabsContent>
      </Tabs>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Bulk price adjustment</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Apply to <strong>{filtered.length}</strong> currently filtered item{filtered.length===1?"":"s"}.</p>
            <div>
              <Label>Percent change</Label>
              <div className="flex items-center gap-1">
                <Input type="number" value={bulkPct} onChange={(e)=>setBulkPct(e.target.value)}/>
                <span className="text-sm">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Use a negative number to discount.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setBulkOpen(false)}>Cancel</Button>
            <Button onClick={bulkAdjust}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o && !deleting) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{deleteTarget ? ` "${deleteTarget.name}"` : ""} and all of its images, availability blackouts, and maintenance history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                if (deleteTarget) deleteProduct(deleteTarget);
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}