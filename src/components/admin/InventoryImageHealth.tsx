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
import { logAudit, newBatchId } from "@/lib/adminAuditLog";

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

// ----- Snapshot cache (sessionStorage) -----
const SNAPSHOT_KEY = "imageHealth.snapshot.v1";
const ITEM_PAGE = 500;
const IMG_PAGE = 1000;
const EPOCH = "1970-01-01T00:00:00Z";

type ItemRow = { id: string; name: string; category: string; active: boolean; primary_image_url: string | null; legacy_image: string | null; updated_at: string | null };
type ImageRow = { id: string; item_id: string; url: string; is_primary: boolean; sort_order: number; created_at: string | null };

interface Snapshot {
  itemsById: Record<string, ItemRow>;
  imagesByItem: Record<string, ImageRow[]>;
  itemsHighWater: string;
  imagesHighWater: string;
  knownItemIds: string[];
  knownImageIds: string[];
  scannedAt: string;
}

function readSnapshot(): Snapshot | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Snapshot;
    if (!parsed.itemsById || !parsed.imagesByItem) return null;
    return parsed;
  } catch { return null; }
}
function writeSnapshot(snap: Snapshot) {
  try { if (typeof window !== "undefined") window.sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snap)); } catch { /* quota — ignore */ }
}
function clearSnapshot() {
  try { if (typeof window !== "undefined") window.sessionStorage.removeItem(SNAPSHOT_KEY); } catch { /* ignore */ }
}

async function fetchAllIds(table: "inventory_items" | "inventory_images"): Promise<string[]> {
  const ids: string[] = [];
  for (let from = 0; ; from += IMG_PAGE) {
    const { data, error } = await (supabase.from(table) as any)
      .select("id")
      .order("id", { ascending: true })
      .range(from, from + IMG_PAGE - 1);
    if (error) throw error;
    const page = (data ?? []) as { id: string }[];
    ids.push(...page.map((r) => r.id));
    if (page.length < IMG_PAGE) break;
  }
  return ids;
}

export function useImageHealthRows() {
  // (helper hoisted below component)
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);

  const buildRows = useCallback((itemsById: Record<string, ItemRow>, imagesByItem: Record<string, ImageRow[]>): Row[] => {
    const items = Object.values(itemsById).sort((a, b) =>
      a.category === b.category ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category),
    );
    return items.map((it) => {
      const gallery = (imagesByItem[it.id] ?? []).slice().sort((a, b) =>
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
  }, []);

  const load = useCallback(async (opts?: { full?: boolean }) => {
    setLoading(true);
    try {
      const cached = opts?.full ? null : readSnapshot();
      const snap: Snapshot = cached ?? {
        itemsById: {}, imagesByItem: {}, itemsHighWater: EPOCH, imagesHighWater: EPOCH,
        knownItemIds: [], knownImageIds: [], scannedAt: new Date().toISOString(),
      };

      // Items: paginated, gated by updated_at high-water
      let itemsHi = snap.itemsHighWater;
      for (let from = 0; ; from += ITEM_PAGE) {
        let q: any = (supabase.from("inventory_items") as any)
          .select("id,name,category,active,primary_image_url,legacy_image,updated_at")
          .order("updated_at", { ascending: true })
          .order("id", { ascending: true })
          .range(from, from + ITEM_PAGE - 1);
        if (snap.itemsHighWater !== EPOCH) q = q.gt("updated_at", snap.itemsHighWater);
        const { data, error } = await q;
        if (error) throw error;
        const page = (data ?? []) as any[];
        for (const it of page) {
          snap.itemsById[it.id] = {
            id: it.id, name: it.name, category: it.category, active: it.active !== false,
            primary_image_url: it.primary_image_url ?? null, legacy_image: it.legacy_image ?? null,
            updated_at: it.updated_at,
          };
          if (it.updated_at && it.updated_at > itemsHi) itemsHi = it.updated_at;
        }
        if (page.length < ITEM_PAGE) break;
      }
      snap.itemsHighWater = itemsHi;

      // Images: paginated, gated by created_at high-water (rows are insert/delete only)
      let imgsHi = snap.imagesHighWater;
      for (let from = 0; ; from += IMG_PAGE) {
        let q: any = (supabase.from("inventory_images") as any)
          .select("id,item_id,url,is_primary,sort_order,created_at")
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .range(from, from + IMG_PAGE - 1);
        if (snap.imagesHighWater !== EPOCH) q = q.gt("created_at", snap.imagesHighWater);
        const { data, error } = await q;
        if (error) throw error;
        const page = (data ?? []) as any[];
        for (const im of page) {
          const arr = snap.imagesByItem[im.item_id] ?? [];
          const idx = arr.findIndex((x) => x.id === im.id);
          const row: ImageRow = { id: im.id, item_id: im.item_id, url: im.url, is_primary: !!im.is_primary, sort_order: im.sort_order ?? 0, created_at: im.created_at };
          if (idx >= 0) arr[idx] = row; else arr.push(row);
          snap.imagesByItem[im.item_id] = arr;
          if (im.created_at && im.created_at > imgsHi) imgsHi = im.created_at;
        }
        if (page.length < IMG_PAGE) break;
      }
      snap.imagesHighWater = imgsHi;

      // Reconcile deletes only on full rescan (cheap id-only scan)
      if (opts?.full || !cached) {
        const [liveItemIds, liveImageIds] = await Promise.all([
          fetchAllIds("inventory_items"),
          fetchAllIds("inventory_images"),
        ]);
        const liveItemSet = new Set(liveItemIds);
        const liveImageSet = new Set(liveImageIds);
        for (const id of Object.keys(snap.itemsById)) {
          if (!liveItemSet.has(id)) { delete snap.itemsById[id]; delete snap.imagesByItem[id]; }
        }
        for (const itemId of Object.keys(snap.imagesByItem)) {
          snap.imagesByItem[itemId] = snap.imagesByItem[itemId].filter((im) => liveImageSet.has(im.id));
        }
        snap.knownItemIds = liveItemIds;
        snap.knownImageIds = liveImageIds;
      }

      snap.scannedAt = new Date().toISOString();
      writeSnapshot(snap);
      setLastScannedAt(snap.scannedAt);
      setRows(buildRows(snap.itemsById, snap.imagesByItem));
    } catch (e) {
      console.warn("[ImageHealth] scan failed", e);
    } finally {
      setLoading(false);
    }
  }, [buildRows]);

  useEffect(() => { load(); }, [load]);

  const fullRescan = useCallback(() => { clearSnapshot(); return load({ full: true }); }, [load]);

  return { rows, loading, reload: load, lastScannedAt, fullRescan };
}

export function imageIssueCount(rows: Row[]): number {
  return rows.filter((r) => r.active && r.status !== "healthy").length;
}

const STATUSES: Status[] = ["broken", "stale_primary", "legacy_fallback", "no_gallery", "healthy"];

export default function InventoryImageHealth() {
  const { toast } = useToast();
  const { rows, loading, reload, lastScannedAt, fullRescan } = useImageHealthRows();
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
    await logAudit({
      entity_type: "inventory_item",
      entity_id: r.id,
      action: "image.promote_primary",
      summary: `Promoted gallery image to primary for ${r.name}`,
      before: { primary_image_url: r.primary_image_url },
      after: { primary_image_url: r.first_gallery_url },
      metadata: { source: "single", item_name: r.name, category: r.category, gallery_count: r.gallery_count },
    });
    toast({ title: "Primary image updated" });
    reload();
  }
  async function clearPrimary(r: Row) {
    const { error } = await (supabase.from("inventory_items") as any).update({ primary_image_url: null }).eq("id", r.id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    await logAudit({
      entity_type: "inventory_item",
      entity_id: r.id,
      action: "image.clear_primary",
      summary: `Cleared stale primary image for ${r.name}`,
      before: { primary_image_url: r.primary_image_url },
      after: { primary_image_url: null },
      metadata: { source: "single", item_name: r.name, category: r.category, gallery_count: r.gallery_count },
    });
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
    const batch_id = newBatchId();
    const results = await Promise.all(
      promoteCandidates.map((r) =>
        (supabase.from("inventory_items") as any)
          .update({ primary_image_url: r.first_gallery_url })
          .eq("id", r.id)
          .then((res: any) => ({ ok: !res.error, row: r })),
      ),
    );
    setBulkRunning(false);
    const ok = results.filter((r) => r.ok).length;
    const failed = results.length - ok;
    await Promise.all(
      results
        .filter((r) => r.ok)
        .map((r) =>
          logAudit({
            entity_type: "inventory_item",
            entity_id: r.row.id,
            action: "image.promote_primary",
            summary: `Bulk: promoted gallery image to primary for ${r.row.name}`,
            before: { primary_image_url: r.row.primary_image_url },
            after: { primary_image_url: r.row.first_gallery_url },
            metadata: { source: "bulk", batch_id, batch_size: promoteCandidates.length, item_name: r.row.name, category: r.row.category, gallery_count: r.row.gallery_count },
          }),
        ),
    );
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
    const batch_id = newBatchId();
    await Promise.all(
      staleCandidates.map((r) =>
        logAudit({
          entity_type: "inventory_item",
          entity_id: r.id,
          action: "image.clear_primary",
          summary: `Bulk: cleared stale primary image for ${r.name}`,
          before: { primary_image_url: r.primary_image_url },
          after: { primary_image_url: null },
          metadata: { source: "bulk", batch_id, batch_size: ids.length, item_name: r.name, category: r.category, gallery_count: r.gallery_count },
        }),
      ),
    );
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
        <div className="ml-auto flex items-center gap-2">
          {lastScannedAt && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Scanned {formatScannedAgo(lastScannedAt)} · {rows.length} items
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => reload()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}/> Re-run check
          </Button>
          <Button variant="ghost" size="sm" onClick={() => fullRescan()} disabled={loading} title="Clear cache and reconcile deletes">
            Full rescan
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