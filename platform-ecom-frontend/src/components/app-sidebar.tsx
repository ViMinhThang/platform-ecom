import { useLocation } from "react-router-dom";
import { Home, Users, Box, Tags, Percent } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Products", url: "/admin/products", icon: Box },
  { title: "Categories", url: "/admin/categories", icon: Tags },
  { title: "Coupons", url: "/admin/coupons", icon: Percent },
];

export function AppSidebar() {
  const location = useLocation();

  const isActive = (url: string) => location.pathname.startsWith(url);

  return (
    <Sidebar className="border-none">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={`bg-white px-5 py-8 my-1 flex items-center gap-2 rounded  ${
                        isActive(item.url) ? "text-green-500 " : "text-black"
                      }`}
                    >
                      <item.icon />
                      <span className="text-lg font-semibold">{item.title}</span>
                    </a>
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
