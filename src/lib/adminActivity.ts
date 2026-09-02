import { supabase } from "@/integrations/supabase/client";

export type ActivityKind =
  | "note"
  | "status_change"
  | "payment"
  | "date_change"
  | "email_sent"
  | "created"
  | "edited"
  | "cancelled"
  | "restored"
  | "archived";

export async function logActivity(params: {
  bookingId?: string | null;
  customerId?: string | null;
  kind: ActivityKind;
  message: string;
  metadata?: Record<string, any>;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  await (supabase.from("booking_activity") as any).insert({
    booking_id: params.bookingId ?? null,
    customer_id: params.customerId ?? null,
    actor_email: session?.user?.email ?? null,
    actor_user_id: session?.user?.id ?? null,
    kind: params.kind,
    message: params.message,
    metadata: params.metadata ?? {},
  });
}
