/**
 * Core Web Vitals tracking
 * - Captures LCP, CLS, INP, FCP, TTFB per route
 * - Persists to localStorage (last 200 samples) so the dashboard can read them
 * - Categorises by route template (city / city-service / event / blog / other)
 */
import type { Metric } from "web-vitals";

export type VitalName = "LCP" | "CLS" | "INP" | "FCP" | "TTFB";

export type RouteTemplate =
  | "home"
  | "city-delivery"
  | "city-service"
  | "event"
  | "blog"
  | "category"
  | "other";

export interface VitalSample {
  id: string;
  name: VitalName;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  path: string;
  template: RouteTemplate;
  timestamp: number;
  navigationType?: string;
}

const STORAGE_KEY = "cwv-samples-v1";
const MAX_SAMPLES = 200;

export function classifyRoute(path: string): RouteTemplate {
  if (path === "/" || path === "/water-slide-and-bounce-house-rentals-orlando") return "home";
  if (path.startsWith("/water-slide-and-bounce-house-rental-")) return "city-delivery";
  if (path.startsWith("/bounce-house-rentals-") || path.startsWith("/water-slide-rentals-")) {
    // Distinguish category pages (no city suffix) from city-service pages
    if (path === "/bounce-house-rentals" || path === "/water-slide-rentals") return "category";
    return "city-service";
  }
  if (path.startsWith("/events/")) return "event";
  if (path.startsWith("/blog")) return "blog";
  if (
    path.endsWith("-rentals") ||
    path === "/rentals" ||
    path === "/concession-rentals" ||
    path === "/table-chair-rentals" ||
    path === "/obstacle-course-rentals" ||
    path === "/interactive-game-rentals" ||
    path === "/bounce-slide-combo-rentals"
  ) {
    return "category";
  }
  return "other";
}

function readSamples(): VitalSample[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSamples(samples: VitalSample[]) {
  try {
    const trimmed = samples.slice(-MAX_SAMPLES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    // Notify any open dashboards in the same tab
    window.dispatchEvent(new CustomEvent("cwv-sample"));
  } catch {
    /* storage full / disabled — silently ignore */
  }
}

export function getStoredSamples(): VitalSample[] {
  return readSamples();
}

export function clearStoredSamples() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("cwv-sample"));
  } catch {
    /* noop */
  }
}

function record(metric: Metric) {
  const path = window.location.pathname;
  const sample: VitalSample = {
    id: metric.id,
    name: metric.name as VitalName,
    value: metric.value,
    rating: metric.rating,
    path,
    template: classifyRoute(path),
    timestamp: Date.now(),
    navigationType: metric.navigationType,
  };
  const existing = readSamples();
  // Web-vitals can fire multiple times per metric (e.g. CLS updates) — keep the latest by id
  const filtered = existing.filter((s) => s.id !== sample.id);
  filtered.push(sample);
  writeSamples(filtered);
}

let initialised = false;

export async function initWebVitals() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  try {
    const { onLCP, onCLS, onINP, onFCP, onTTFB } = await import("web-vitals");
    onLCP(record);
    onCLS(record);
    onINP(record);
    onFCP(record);
    onTTFB(record);
  } catch {
    /* web-vitals failed to load — non-fatal */
  }
}

/** Thresholds per Google's Core Web Vitals guidance (values in ms except CLS). */
export const THRESHOLDS: Record<VitalName, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  INP: { good: 200, poor: 500, unit: "ms" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
};

export function formatValue(name: VitalName, value: number): string {
  if (name === "CLS") return value.toFixed(3);
  return `${Math.round(value)} ms`;
}
