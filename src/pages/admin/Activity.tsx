import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

export default function Activity() {
  const [entries, setEntries] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("booking_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      setEntries((data as any) ?? []);
    })();
  }, []);
  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="font-display text-2xl md:text-3xl font-bold">Activity log</h1>
      <div className="bg-card border border-border rounded-lg divide-y">
        {entries.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No activity yet.</p>
        ) : entries.map((e) => (
          <div key={e.id} className="p-3">
            <div className="text-sm">{e.message}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {format(parseISO(e.created_at), "MMM d, yyyy h:mm a")}
              {e.actor_email ? ` · ${e.actor_email}` : ""}
              {e.booking_id && (
                <> · <Link to={`/admin/bookings?open=${e.booking_id}`} className="text-primary hover:underline">View booking</Link></>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
