import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    // Recovery links arrive with type=recovery in the URL hash; the Supabase
    // client picks it up and fires PASSWORD_RECOVERY once the session is set.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Fallback: if a recovery session is already established, allow the form.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else if (window.location.hash.includes("type=recovery")) setReady(true);
      else setTimeout(() => setInvalid((v) => v || !ready), 3000);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated", description: "You're signed in with your new password." });
      navigate("/admin/bookings", { replace: true });
    } catch (err: any) {
      toast({ title: "Couldn't update password", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  if (invalid && !ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4 text-center gap-3">
        <h1 className="font-display text-2xl font-bold">Link expired or invalid</h1>
        <p className="text-muted-foreground">Request a new password reset link from the sign-in page.</p>
        <Button variant="outline" onClick={() => navigate("/admin/login")}>Back to sign in</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-card border border-border rounded-lg p-6 space-y-4">
        <h1 className="font-display text-2xl font-bold">Set a new password</h1>
        <div className="space-y-1">
          <Label htmlFor="npw">New password</Label>
          <Input id="npw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cpw">Confirm new password</Label>
          <Input id="cpw" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
        </div>
        <Button type="submit" className="w-full" disabled={busy || !ready}>
          {busy ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
}
