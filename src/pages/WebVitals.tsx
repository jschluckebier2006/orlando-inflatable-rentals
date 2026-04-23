import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  THRESHOLDS,
  classifyRoute,
  clearStoredSamples,
  formatValue,
  getStoredSamples,
  type RouteTemplate,
  type VitalName,
  type VitalSample,
} from "@/lib/webVitals";

const TEMPLATE_LABELS: Record<RouteTemplate, string> = {
  home: "Home",
  "city-delivery": "City Delivery Pages",
  "city-service": "City + Service Pages",
  event: "Event Pages",
  blog: "Blog",
  category: "Category Pages",
  other: "Other",
};

const TRACKED_METRICS: VitalName[] = ["LCP", "CLS", "INP"];

function ratingBadge(rating: VitalSample["rating"]) {
  const variant =
    rating === "good" ? "default" : rating === "needs-improvement" ? "secondary" : "destructive";
  const label =
    rating === "good" ? "Good" : rating === "needs-improvement" ? "Needs work" : "Poor";
  return <Badge variant={variant as "default" | "secondary" | "destructive"}>{label}</Badge>;
}

function percentile(values: number[], p: number): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

interface AggregateRow {
  template: RouteTemplate;
  metric: VitalName;
  count: number;
  p75: number | null;
}

function aggregate(samples: VitalSample[]): AggregateRow[] {
  const rows: AggregateRow[] = [];
  const templates = Array.from(new Set(samples.map((s) => s.template))) as RouteTemplate[];
  for (const template of templates) {
    for (const metric of TRACKED_METRICS) {
      const values = samples
        .filter((s) => s.template === template && s.name === metric)
        .map((s) => s.value);
      rows.push({ template, metric, count: values.length, p75: percentile(values, 75) });
    }
  }
  return rows;
}

function ratingFor(metric: VitalName, value: number | null): VitalSample["rating"] | null {
  if (value === null) return null;
  const t = THRESHOLDS[metric];
  if (value <= t.good) return "good";
  if (value <= t.poor) return "needs-improvement";
  return "poor";
}

export default function WebVitals() {
  const [samples, setSamples] = useState<VitalSample[]>(() => getStoredSamples());

  useEffect(() => {
    const refresh = () => setSamples(getStoredSamples());
    window.addEventListener("cwv-sample", refresh);
    window.addEventListener("storage", refresh);
    const interval = window.setInterval(refresh, 2000);
    return () => {
      window.removeEventListener("cwv-sample", refresh);
      window.removeEventListener("storage", refresh);
      window.clearInterval(interval);
    };
  }, []);

  const aggregateRows = useMemo(() => aggregate(samples), [samples]);
  const recent = useMemo(() => [...samples].sort((a, b) => b.timestamp - a.timestamp).slice(0, 50), [samples]);

  const summary = useMemo(() => {
    const result: Record<VitalName, { p75: number | null; count: number }> = {
      LCP: { p75: null, count: 0 },
      CLS: { p75: null, count: 0 },
      INP: { p75: null, count: 0 },
      FCP: { p75: null, count: 0 },
      TTFB: { p75: null, count: 0 },
    };
    for (const metric of TRACKED_METRICS) {
      const values = samples.filter((s) => s.name === metric).map((s) => s.value);
      result[metric] = { p75: percentile(values, 75), count: values.length };
    }
    return result;
  }, [samples]);

  return (
    <Layout>
      <SEOHead
        title="Core Web Vitals Monitor | Orlando Inflatables"
        description="Internal Core Web Vitals dashboard tracking LCP, CLS, and INP across city, service, and event templates."
        canonical="https://orlandoinflatables.com/web-vitals"
        noindex
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Core Web Vitals Monitor</h1>
            <p className="text-muted-foreground max-w-2xl">
              Real-time LCP, CLS, and INP collected from this browser session. Visit other pages to
              gather samples — this dashboard updates automatically.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSamples(getStoredSamples())}>
              Refresh
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearStoredSamples();
                setSamples([]);
              }}
            >
              Clear data
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          {TRACKED_METRICS.map((metric) => {
            const { p75, count } = summary[metric];
            const rating = ratingFor(metric, p75);
            const t = THRESHOLDS[metric];
            return (
              <Card key={metric} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">{metric}</h2>
                  {rating && ratingBadge(rating)}
                </div>
                <p className="text-3xl font-bold mb-1">
                  {p75 === null ? "—" : formatValue(metric, p75)}
                </p>
                <p className="text-sm text-muted-foreground">
                  p75 across {count} sample{count === 1 ? "" : "s"}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  Good ≤ {metric === "CLS" ? t.good : `${t.good} ms`} · Poor &gt;{" "}
                  {metric === "CLS" ? t.poor : `${t.poor} ms`}
                </p>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="by-template" className="w-full">
          <TabsList>
            <TabsTrigger value="by-template">By template</TabsTrigger>
            <TabsTrigger value="by-page">By page</TabsTrigger>
            <TabsTrigger value="recent">Recent samples</TabsTrigger>
          </TabsList>

          <TabsContent value="by-template">
            <Card className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">p75</TableHead>
                    <TableHead className="text-right">Samples</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aggregateRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No samples yet — browse the site to collect Core Web Vitals.
                      </TableCell>
                    </TableRow>
                  )}
                  {aggregateRows.map((row) => {
                    const rating = ratingFor(row.metric, row.p75);
                    return (
                      <TableRow key={`${row.template}-${row.metric}`}>
                        <TableCell className="font-medium">{TEMPLATE_LABELS[row.template]}</TableCell>
                        <TableCell>{row.metric}</TableCell>
                        <TableCell className="text-right">
                          {row.p75 === null ? "—" : formatValue(row.metric, row.p75)}
                        </TableCell>
                        <TableCell className="text-right">{row.count}</TableCell>
                        <TableCell>{rating ? ratingBadge(rating) : "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="by-page">
            <Card className="p-4">
              <PerPageTable samples={samples} />
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No samples yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {recent.map((s) => (
                    <TableRow key={`${s.id}-${s.timestamp}`}>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(s.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[280px] truncate">{s.path}</TableCell>
                      <TableCell>{TEMPLATE_LABELS[s.template]}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell className="text-right">
                        {formatValue(s.name as VitalName, s.value)}
                      </TableCell>
                      <TableCell>{ratingBadge(s.rating)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function PerPageTable({ samples }: { samples: VitalSample[] }) {
  const rows = useMemo(() => {
    const byPath = new Map<string, VitalSample[]>();
    for (const s of samples) {
      const list = byPath.get(s.path) ?? [];
      list.push(s);
      byPath.set(s.path, list);
    }
    return Array.from(byPath.entries())
      .map(([path, list]) => {
        const result: Record<VitalName, number | null> = {
          LCP: null,
          CLS: null,
          INP: null,
          FCP: null,
          TTFB: null,
        };
        for (const metric of TRACKED_METRICS) {
          const values = list.filter((s) => s.name === metric).map((s) => s.value);
          result[metric] = percentile(values, 75);
        }
        return {
          path,
          template: classifyRoute(path),
          metrics: result,
          count: list.length,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [samples]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Page</TableHead>
          <TableHead>Template</TableHead>
          {TRACKED_METRICS.map((m) => (
            <TableHead key={m} className="text-right">
              {m} (p75)
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={2 + TRACKED_METRICS.length} className="text-center text-muted-foreground py-8">
              No samples yet — browse the site to collect Core Web Vitals.
            </TableCell>
          </TableRow>
        )}
        {rows.map((row) => (
          <TableRow key={row.path}>
            <TableCell className="font-mono text-xs max-w-[320px] truncate">{row.path}</TableCell>
            <TableCell>{TEMPLATE_LABELS[row.template]}</TableCell>
            {TRACKED_METRICS.map((m) => {
              const v = row.metrics[m];
              const rating = ratingFor(m, v);
              return (
                <TableCell key={m} className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span>{v === null ? "—" : formatValue(m, v)}</span>
                    {rating && ratingBadge(rating)}
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
