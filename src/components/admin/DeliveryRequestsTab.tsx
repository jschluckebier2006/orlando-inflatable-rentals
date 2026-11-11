import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export type DeliveryRequestStatus = "new" | "contacted" | "booked" | "closed";

export interface DeliveryRequest {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  event_date: string | null;
  event_zip: string;
  items: string[];
  notes: string | null;
  status: DeliveryRequestStatus;
}

const STATUS_LABEL: Record<DeliveryRequestStatus, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  closed: "Closed",
};

/** Admin list of delivery requests from ZIPs that can't book online. */
export default function DeliveryRequestsTab({ rows, onChanged }: { rows: DeliveryRequest[]; onChanged: () => void }) {
  const { toast } = useToast();

  async function setStatus(id: string, status: DeliveryRequestStatus) {
    const { error } = await supabase.from("delivery_requests").update({ status }).eq("id", id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    onChanged();
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground p-4 border rounded-md bg-card">No delivery requests yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.id} className="rounded-md border border-border bg-card p-3 text-sm space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15">Delivery request</Badge>
              <span className="font-medium">{r.customer_name}</span>
              <span className="text-muted-foreground">
                · {r.event_date ? format(new Date(r.event_date + "T12:00:00"), "MMM d, yyyy") : "No date"}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />ZIP {r.event_zip}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Received {format(new Date(r.created_at), "MMM d, h:mm a")}</span>
              <Select value={r.status} onValueChange={(v) => setStatus(r.id, v as DeliveryRequestStatus)}>
                <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABEL) as DeliveryRequestStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <a href={`tel:${r.customer_phone.replace(/[^0-9+]/g, "")}`}><Phone className="h-3.5 w-3.5 mr-1" />{r.customer_phone}</a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={`mailto:${r.customer_email}`}><Mail className="h-3.5 w-3.5 mr-1" />{r.customer_email}</a>
            </Button>
          </div>
          {r.items.length > 0 && (
            <div className="text-muted-foreground"><span className="font-medium text-foreground">Wants:</span> {r.items.join(", ")}</div>
          )}
          {r.notes && <div className="text-muted-foreground"><span className="font-medium text-foreground">Notes:</span> {r.notes}</div>}
        </li>
      ))}
    </ul>
  );
}
