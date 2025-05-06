"use client"

import * as React from "react"
import {
  Home,
  FileText,
  User,
  FileIcon,
  FolderPen
} from "lucide-react"

import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const data = {
  user: {
    name: "Gerald Okereke",
    email: "geraldmokereke@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Main",
      url: "/",
      icon: Home,
      isActive: true,
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                  <span className="truncate text-xs">DCA</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
