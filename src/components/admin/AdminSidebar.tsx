import { NavLink, useLocation } from "react-router-dom";
import { Calendar, ListChecks, Users, Plus, Activity, Settings as SettingsIcon, Boxes, Mail, Ban } from "lucide-react";
import { useImageHealthRows, imageIssueCount } from "@/components/admin/InventoryImageHealth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Calendar", url: "/admin", icon: Calendar, end: true },
  { title: "Bookings", url: "/admin/bookings", icon: ListChecks },
  { title: "Inventory", url: "/admin/inventory", icon: Boxes },
  { title: "Blackout Dates", url: "/admin/blackouts", icon: Ban },
  { title: "Customers", url: "/admin/customers", icon: Users },
  { title: "New Reservation", url: "/admin/new", icon: Plus },
  { title: "Activity", url: "/admin/activity", icon: Activity },
  { title: "Emails", url: "/admin/emails", icon: Mail },
  { title: "Settings", url: "/admin/settings", icon: SettingsIcon },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { rows } = useImageHealthRows();
  const inventoryIssues = imageIssueCount(rows);

  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-3 border-b border-sidebar-border">
        {!collapsed ? (
          <div>
            <div className="font-display font-bold text-base leading-tight">Admin</div>
            <div className="text-xs text-sidebar-foreground/70">Orlando Inflatable Rentals</div>
          </div>
        ) : (
          <div className="font-display font-bold text-center">A</div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.end)}>
                    <NavLink to={item.url} end={item.end} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                      {item.url === "/admin/inventory" && inventoryIssues > 0 && (
                        <span className={`ml-auto inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold ${collapsed ? "w-2 h-2" : "min-w-[18px] h-[18px] px-1"}`}>
                          {!collapsed && inventoryIssues}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
