import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const RequestSchema = z.object({
  customer_name: z.string().trim().min(1, "Please enter your name").max(120),
  customer_phone: z.string().trim().min(7, "Please enter a phone number").max(40)
    .regex(/^[0-9+().\-\s]+$/, "Phone can only contain digits and + ( ) -"),
  customer_email: z.string().trim().email("Please enter a valid email").max(255),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick an event date"),
  event_zip: z.string().trim().regex(/^\d{5}$/, "ZIP must be 5 digits"),
  items: z.string().trim().max(2000),
  notes: z.string().trim().max(2000),
});

interface Props {
  zip: string;
  defaults: {
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    event_date?: string; // yyyy-MM-dd
    items?: string[];
    notes?: string;
  };
}

/**
 * Shown when a ZIP can't be booked online ("call" or unlisted). Offers call,
 * text, and a short request form that's saved for the owner and emailed to them.
 */
/** Anchor the call-ZIP note under the checkout ZIP field scrolls to. */
export const DELIVERY_REQUEST_PANEL_ID = "delivery-request-panel";

const CONTACT_KEYS = ["customer_name", "customer_phone", "customer_email"] as const;
type ContactKey = (typeof CONTACT_KEYS)[number];

export function DeliveryRequestPanel({ zip, defaults }: Props) {
  const zip5 = (zip ?? "").trim().slice(0, 5);
  const [form, setForm] = useState({
    customer_name: defaults.customer_name ?? "",
    customer_phone: defaults.customer_phone ?? "",
    customer_email: defaults.customer_email ?? "",
    event_date: defaults.event_date ?? "",
    event_zip: zip5,
    items: (defaults.items ?? []).join("\n"),
    notes: defaults.notes ?? "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [failMsg, setFailMsg] = useState<string | null>(null);

  // Name/phone/email follow what the customer types in the checkout form
  // above, until they edit that field here — then their edit wins.
  const edited = useRef<Set<ContactKey>>(new Set());
  useEffect(() => {
    setForm((f) => {
      const next = { ...f };
      for (const k of CONTACT_KEYS) {
        if (!edited.current.has(k)) next[k] = defaults[k] ?? "";
      }
      return next;
    });
  }, [defaults.customer_name, defaults.customer_phone, defaults.customer_email]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if ((CONTACT_KEYS as readonly string[]).includes(k)) edited.current.add(k as ContactKey);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFailMsg(null);
    const parsed = RequestSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ||= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    try {
      const d = parsed.data;
      const { data, error } = await supabase.functions.invoke("submit-delivery-request", {
        body: {
          customer_name: d.customer_name,
          customer_phone: d.customer_phone,
          customer_email: d.customer_email,
          event_date: d.event_date,
          event_zip: d.event_zip,
          items: d.items.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 20),
          notes: d.notes || null,
          website: form.website || null,
        },
      });
      if (error || !data?.ok) {
        setFailMsg("We couldn't send your request. Please call or text (407) 497-1840.");
        return;
      }
      trackEvent("delivery_request_submitted", { zip: d.event_zip });
      setDone(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div id={DELIVERY_REQUEST_PANEL_ID} role="region" aria-label="Delivery request" className="scroll-mt-4 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-foreground space-y-3">
      <p>
        We may still be able to deliver to <strong>{zip5}</strong>. Call or text{" "}
        <a href="tel:4074971840" className="font-semibold underline whitespace-nowrap">(407) 497-1840</a>, or send a request and we'll get back to you.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <a href="tel:4074971840"><Phone className="h-4 w-4 mr-1" />Call</a>
        </Button>
        <Button asChild variant="outline">
          <a href="sms:4074971840"><MessageSquare className="h-4 w-4 mr-1" />Text</a>
        </Button>
      </div>

      {done ? (
        <div role="status" className="rounded-md border border-green-600/30 bg-green-600/10 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-700 dark:text-green-400" />
          <div>
            <p className="font-semibold text-base">Got it, we'll reach out</p>
            <p className="text-muted-foreground">Thanks, {form.customer_name.split(" ")[0] || "friend"}! We'll contact you about delivery to {form.event_zip} soon.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3 rounded-md bg-card border border-border p-3" noValidate>
          <p className="font-semibold">Send a delivery request</p>
          {/* Honeypot — hidden from people, bots fill it in. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="hidden" value={form.website} onChange={set("website")} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field id="dr-name" label="Name *" error={errors.customer_name}>
              <Input id="dr-name" value={form.customer_name} onChange={set("customer_name")} maxLength={120} />
            </Field>
            <Field id="dr-phone" label="Phone *" error={errors.customer_phone}>
              <Input id="dr-phone" type="tel" value={form.customer_phone} onChange={set("customer_phone")} maxLength={40} />
            </Field>
            <Field id="dr-email" label="Email *" error={errors.customer_email} className="md:col-span-2">
              <Input id="dr-email" type="email" value={form.customer_email} onChange={set("customer_email")} maxLength={255} />
            </Field>
            <Field id="dr-date" label="Event date *" error={errors.event_date}>
              <Input id="dr-date" type="date" value={form.event_date} onChange={set("event_date")} />
            </Field>
            <Field id="dr-zip" label="Event ZIP *" error={errors.event_zip}>
              <Input id="dr-zip" inputMode="numeric" value={form.event_zip} maxLength={5}
                onChange={(e) => setForm((f) => ({ ...f, event_zip: e.target.value.replace(/\D/g, "").slice(0, 5) }))} />
            </Field>
            <Field id="dr-items" label="Items you want" error={errors.items} className="md:col-span-2">
              <Textarea id="dr-items" rows={3} value={form.items} onChange={set("items")} maxLength={2000} />
            </Field>
            <Field id="dr-notes" label="Notes" error={errors.notes} className="md:col-span-2">
              <Textarea id="dr-notes" rows={2} value={form.notes} onChange={set("notes")} maxLength={2000}
                placeholder="Event address area, setup surface, anything else..." />
            </Field>
          </div>
          {failMsg && <p role="alert" className="text-destructive text-sm">{failMsg}</p>}
          <Button type="submit" disabled={sending} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            {sending ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Sending…</> : "Send request"}
          </Button>
        </form>
      )}
    </div>
  );
}

function Field({ id, label, error, className, children }: {
  id: string; label: string; error?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
