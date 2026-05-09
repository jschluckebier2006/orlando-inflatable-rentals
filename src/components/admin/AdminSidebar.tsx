import { NavLink, useLocation } from "react-router-dom";
import { Calendar, ListChecks, Users, Plus, Activity, Settings as SettingsIcon, Boxes, Mail } from "lucide-react";
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
  { title: "Customers", url: "/admin/customers", icon: Users },
  { title: "New Reservation", url: "/admin/new", icon: Plus },
  { title: "Activity", url: "/admin/activity", icon: Activity },
  { title: "Notifications", url: "/admin/notifications", icon: Mail },
  { title: "Settings", url: "/admin/settings", icon: SettingsIcon },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

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
