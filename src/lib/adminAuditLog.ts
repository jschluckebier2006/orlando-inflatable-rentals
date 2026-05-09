import { supabase } from "@/integrations/supabase/client";

export interface AuditLogParams {
  entity_type: string;
  entity_id: string;
  action: string;
  summary: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  metadata?: Record<string, any>;
}

/** Best-effort audit log insert. Never throws — logs to console on failure. */
export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const actor = session?.user?.email ?? null;
    const { error } = await (supabase.from("admin_audit_log") as any).insert({
      actor_email: actor,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      action: params.action,
      summary: params.summary,
      before: params.before ?? {},
      after: params.after ?? {},
      metadata: params.metadata ?? {},
    });
    if (error) console.warn("[audit] insert failed", error);
  } catch (e) {
    console.warn("[audit] threw", e);
  }
}

/** Generate a short batch id to group bulk-action audit rows. */
export function newBatchId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}