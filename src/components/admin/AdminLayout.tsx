import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation } from "react-router-dom";
import { Calendar, ListChecks, Boxes, Ban, Plus } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/admin/login", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-4">
        <h1 className="font-display text-2xl font-bold">No admin access</h1>
        <p className="text-muted-foreground">
          Your account isn't marked as admin yet.
        </p>
        <Button onClick={signOut} variant="outline">Sign out</Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/20">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-background px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-semibold text-sm">Admin Dashboard</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden pb-20 md:pb-6">
            <Outlet />
          </main>
          <MobileBottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}

const bottomItems = [
  { to: "/admin", label: "Calendar", icon: Calendar, end: true },
  { to: "/admin/bookings", label: "Bookings", icon: ListChecks },
  { to: "/admin/new", label: "New", icon: Plus },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/blackouts", label: "Blackouts", icon: Ban },
];

function MobileBottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 border-t border-border bg-background flex items-stretch">
      {bottomItems.map((it) => {
        const active = it.end ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
        return (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}
          >
            <it.icon className="h-5 w-5" />
            <span>{it.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
