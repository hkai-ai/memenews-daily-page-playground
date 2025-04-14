"use client"

import { Link } from "next-view-transitions"
import { useEffect } from "react"

import { Button } from "../ui/button"

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/lib/components/common/ui/sidebar"
import { Icons } from "@/lib/components/common/icon"
import { cn } from "@/lib/utils"

export function AppSidebarHeader() {
  const { open, setOpen, toggleSidebar } = useSidebar()

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem
          className={cn("flex items-center", open ? "gap-2" : "gap-0")}
        >
          {/* <DropdownMenu> */}
          <SidebarMenuButton
            size="lg"
            className="flex-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            asChild
          >
            <Link href="/home">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Icons.memenews className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Memenews</span>
                <span className="truncate text-xs">你的个性化AI日报</span>
              </div>
            </Link>
          </SidebarMenuButton>

          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={toggleSidebar}
            aria-label={open ? "收起侧边栏" : "展开侧边栏"}
          >
            {open ? (
              <Icons.tabClose className="size-4" />
            ) : (
              <Icons.tabOpen className="size-4" />
            )}
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
