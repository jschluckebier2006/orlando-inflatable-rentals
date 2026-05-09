import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ExternalLink, ImageOff, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { legacyAssetFilenames } from "@/lib/inventory";

type Status = "healthy" | "no_gallery" | "stale_primary" | "legacy_fallback" | "broken";

interface Row {
  id: string;
  name: string;
  category: string;
  active: boolean;
  primary_image_url: string | null;
  legacy_image: string | null;
  gallery_count: number;
  primary_in_gallery: boolean;
  first_gallery_url: string | null;
  status: Status;
  source: "DB primary" | "Gallery" | "Bundled webp" | "Placeholder";
  thumb: string | null;
}

const STATUS_META: Record<Status, { label: string; tone: "default" | "secondary" | "destructive" | "outline"; help: string }> = {
  broken: { label: "Broken", tone: "destructive", help: "No usable image — customer sees placeholder." },
  legacy_fallback: { label: "Legacy fallback", tone: "outline", help: "Working from a bundled file. Upload a real photo to make it permanent." },
  stale_primary: { label: "Stale primary", tone: "destructive", help: "Primary image URL no longer matches any gallery row." },
  no_gallery: { label: "No gallery", tone: "secondary", help: "Primary image set but no extra gallery photos." },
  healthy: { label: "Healthy", tone: "default", help: "Primary image plus at least one gallery photo." },
};

export function useImageHealthRows() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [itemsRes, imgsRes] = await Promise.all([
      (supabase.from("inventory_items") as any).select("id,name,category,active,primary_image_url,legacy_image").order("category").order("name"),
      (supabase.from("inventory_images") as any).select("item_id,url,is_primary,sort_order"),
    ]);
    const items = (itemsRes.data ?? []) as any[];
    const imgs = (imgsRes.data ?? []) as any[];
    const byItem = new Map<string, any[]>();
    for (const im of imgs) {
      const arr = byItem.get(im.item_id) ?? [];
      arr.push(im);
      byItem.set(im.item_id, arr);
    }
    const next: Row[] = items.map((it) => {
      const gallery = (byItem.get(it.id) ?? []).slice().sort((a, b) =>
        a.is_primary === b.is_primary ? (a.sort_order ?? 0) - (b.sort_order ?? 0) : a.is_primary ? -1 : 1,
      );
      const galleryCount = gallery.length;
      const firstGalleryUrl = gallery[0]?.url ?? null;
      const primaryInGallery = !!it.primary_image_url && gallery.some((g) => g.url === it.primary_image_url);
      const legacyOk = !!it.legacy_image && legacyAssetFilenames.has(it.legacy_image);

      let status: Status;
      let source: Row["source"];
      let thumb: string | null;

      if (it.primary_image_url) {
        thumb = it.primary_image_url;
        source = "DB primary";
        if (!primaryInGallery && galleryCount > 0) status = "stale_primary";
        else if (galleryCount === 0) status = "no_gallery";
        else status = "healthy";
      } else if (galleryCount > 0) {
        thumb = firstGalleryUrl;
        source = "Gallery";
        status = "no_gallery"; // has photos but no primary set — surface as fixable
      } else if (legacyOk) {
        thumb = null; // bundled — render via separate img path not needed here
        source = "Bundled webp";
        status = "legacy_fallback";
      } else {
        thumb = null;
        source = "Placeholder";
        status = "broken";
      }

      return {
        id: it.id,
        name: it.name,
        category: it.category,
        active: it.active !== false,
        primary_image_url: it.primary_image_url ?? null,
        legacy_image: it.legacy_image ?? null,
        gallery_count: galleryCount,
        primary_in_gallery: primaryInGallery,
        first_gallery_url: firstGalleryUrl,
        status,
        source,
        thumb,
      };
    });
    setRows(next);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { rows, loading, reload: load };
}

export function imageIssueCount(rows: Row[]): number {
  return rows.filter((r) => r.active && r.status !== "healthy").length;
}

const STATUSES: Status[] = ["broken", "stale_primary", "legacy_fallback", "no_gallery", "healthy"];

export default function InventoryImageHealth() {
  const { toast } = useToast();
  const { rows, loading, reload } = useImageHealthRows();
  const [statusFilter, setStatusFilter] = useState<Status | "issues">("issues");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [showInactive, setShowInactive] = useState(false);

  const counts = useMemo(() => {
    const c: Record<Status, number> = { healthy: 0, no_gallery: 0, stale_primary: 0, legacy_fallback: 0, broken: 0 };
    rows.filter((r) => r.active).forEach((r) => { c[r.status]++; });
    return c;
  }, [rows]);

  const cats = useMemo(() => Array.from(new Set(rows.map((r) => r.category))).sort(), [rows]);

  const filtered = useMemo(() => rows.filter((r) => {
    if (!showInactive && !r.active) return false;
    if (statusFilter === "issues" ? r.status === "healthy" : r.status !== statusFilter) return false;
    if (catFilter !== "all" && r.category !== catFilter) return false;
    return true;
  }), [rows, statusFilter, catFilter, showInactive]);

  async function promote(r: Row) {
    if (!r.first_gallery_url) return;
    const { error } = await (supabase.from("inventory_items") as any).update({ primary_image_url: r.first_gallery_url }).eq("id", r.id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    toast({ title: "Primary image updated" });
    reload();
  }
  async function clearPrimary(r: Row) {
    const { error } = await (supabase.from("inventory_items") as any).update({ primary_image_url: null }).eq("id", r.id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    toast({ title: "Primary image cleared" });
    reload();
  }

  // Bulk action candidates respect current category + active filters but ignore the status filter
  // so admins always know what they're touching regardless of which view they're on.
  const scope = useMemo(() => rows.filter((r) => {
    if (!showInactive && !r.active) return false;
    if (catFilter !== "all" && r.category !== catFilter) return false;
    return true;
  }), [rows, catFilter, showInactive]);

  const promoteCandidates = useMemo(
    () => scope.filter((r) => r.first_gallery_url && (r.status === "no_gallery" || r.status === "stale_primary") && r.first_gallery_url !== r.primary_image_url),
    [scope],
  );
  const staleCandidates = useMemo(() => scope.filter((r) => r.status === "stale_primary"), [scope]);

  const [bulkRunning, setBulkRunning] = useState(false);

  async function bulkPromote() {
    if (promoteCandidates.length === 0) return;
    setBulkRunning(true);
    const results = await Promise.all(
      promoteCandidates.map((r) =>
        (supabase.from("inventory_items") as any)
          .update({ primary_image_url: r.first_gallery_url })
          .eq("id", r.id)
          .then((res: any) => ({ ok: !res.error, id: r.id })),
      ),
    );
    setBulkRunning(false);
    const ok = results.filter((r) => r.ok).length;
    const failed = results.length - ok;
    toast({
      title: `Promoted ${ok} item${ok === 1 ? "" : "s"}`,
      description: failed ? `${failed} failed — check permissions and retry.` : undefined,
      variant: failed ? "destructive" : "default",
    });
    reload();
  }

  async function bulkClearStale() {
    if (staleCandidates.length === 0) return;
    setBulkRunning(true);
    const ids = staleCandidates.map((r) => r.id);
    const { error } = await (supabase.from("inventory_items") as any).update({ primary_image_url: null }).in("id", ids);
    setBulkRunning(false);
    if (error) return toast({ title: "Bulk clear failed", description: error.message, variant: "destructive" });
    toast({ title: `Cleared ${ids.length} stale primar${ids.length === 1 ? "y" : "ies"}` });
    reload();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {STATUSES.map((s) => (
          <Card key={s} className={`p-3 cursor-pointer transition ${statusFilter === s ? "ring-2 ring-primary" : ""}`} onClick={() => setStatusFilter(s)}>
            <div className="text-xs text-muted-foreground">{STATUS_META[s].label}</div>
            <div className="text-2xl font-bold">{counts[s]}</div>
          </Card>
        ))}
      </div>

      <Card className="p-3 flex flex-wrap gap-2 items-center">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-44"><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="issues">All issues</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-52"><SelectValue/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <label className="text-sm flex items-center gap-1 ml-2">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
          Include hidden items
        </label>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}/> Re-run check
          </Button>
        </div>
      </Card>

      {(promoteCandidates.length > 0 || staleCandidates.length > 0) && (
        <Card className="p-3 flex flex-wrap gap-2 items-center bg-muted/40">
          <div className="text-sm font-medium">Bulk fixes</div>
          <div className="text-xs text-muted-foreground">
            Applies to {catFilter === "all" ? "all categories" : catFilter}
            {showInactive ? "" : ", active items only"}.
          </div>
          <div className="ml-auto flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="default" disabled={bulkRunning || promoteCandidates.length === 0}>
                  Promote first gallery → primary ({promoteCandidates.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Promote {promoteCandidates.length} item{promoteCandidates.length === 1 ? "" : "s"}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    For every flagged item with at least one gallery photo, the first gallery image will be set as the primary image. This is reversible per-item from the detail page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={bulkPromote}>Promote all</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={bulkRunning || staleCandidates.length === 0}>
                  Clear stale primaries ({staleCandidates.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear {staleCandidates.length} stale primar{staleCandidates.length === 1 ? "y" : "ies"}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Removes the saved primary image URL on every item whose primary no longer exists in the gallery. The resolver will then fall back to a gallery photo or the bundled webp.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={bulkClearStale}>Clear all</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-sm text-center text-muted-foreground">Scanning images…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-sm text-center text-muted-foreground">Nothing to flag here. </div>
        ) : (
          <div className="divide-y">
            {filtered.map((r) => {
              const meta = STATUS_META[r.status];
              return (
                <div key={r.id} className="p-3 flex items-center gap-3">
                  <div className="w-14 h-14 bg-muted rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {r.thumb ? (
                      <img src={r.thumb} alt={r.name} className="w-full h-full object-contain" loading="lazy"/>
                    ) : r.status === "legacy_fallback" ? (
                      <ImageOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/admin/inventory/${r.id}`} className="font-medium hover:underline truncate block">{r.name}</Link>
                    <div className="flex flex-wrap gap-1 mt-1 items-center">
                      <Badge variant={meta.tone} className="text-xs">{meta.label}</Badge>
                      <Badge variant="outline" className="text-xs">{r.category}</Badge>
                      <span className="text-xs text-muted-foreground">{r.source} · {r.gallery_count} gallery photo{r.gallery_count === 1 ? "" : "s"}</span>
                      {!r.active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{meta.help}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {r.gallery_count > 0 && (r.status === "stale_primary" || r.status === "no_gallery") && r.first_gallery_url && (
                      <Button size="sm" variant="outline" onClick={() => promote(r)}>Promote gallery</Button>
                    )}
                    {r.status === "stale_primary" && (
                      <Button size="sm" variant="ghost" onClick={() => clearPrimary(r)}>Clear primary</Button>
                    )}
                    <Button size="icon" variant="ghost" asChild title="Open detail">
                      <Link to={`/admin/inventory/${r.id}`}><ExternalLink className="h-4 w-4"/></Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}