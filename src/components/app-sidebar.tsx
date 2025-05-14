"use client";

import * as React from "react";
import { jwtDecode } from "jwt-decode";
import {
  Home,
  FileText,
  User,
  FileIcon,
  FolderPen,
} from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

interface JWTPayload {
  sub: string;
  email: string;
  role: "ADMIN" | "DCA" | "USER";
  iat: number;
  exp: number;
}

const fullNav = [
  {
    title: "Main",
    url: "/",
    icon: Home,
  },
  {
    title: "File",
    url: "/files",
    icon: FileText,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: FileIcon,
  },
  {
    title: "DCAs",
    url: "/dca",
    icon: FolderPen,
  },
];

function getFilteredNavItems(role: JWTPayload["role"]) {
  switch (role) {
    case "ADMIN":
      return fullNav;
    case "DCA":
      return fullNav.filter(item =>
        ["Main", "Profile", "Applications"].includes(item.title)
      );
    case "USER":
    default:
      return fullNav.filter(item =>
        ["Main", "Files", "Profile"].includes(item.title)
      );
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState<JWTPayload["role"] | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token:", err);
        setRole("USER"); // Fallback to USER
      }
    } else {
      setRole("USER");
    }
  }, []);

  const user = {
    name: "Gerald Okereke",
    email: "geraldmokereke@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  };

  const filteredNav = role ? getFilteredNavItems(role) : [];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div>
                  <img src="/logo.png" className="w-10 h-10" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">AFCFTA</span>
                  <span className="truncate text-xs">
                    {role ? role.charAt(0) + role.slice(1).toLowerCase() : "..."}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
