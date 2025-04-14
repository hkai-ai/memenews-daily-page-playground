"use client"

import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { SubmitAccountDialog } from "@/lib/components/features/submitAccount/SubmitAccountDialog"
import { AppSidebarHeader } from "@/lib/components/common/layout/AppSidebarHeader"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/lib/components/common/ui/sidebar"
import { NavMenusMain, NavMenusMeme, NavMenusOther } from "@/lib/constants"
import { FeedbackDialog } from "@/lib/components/features/settings"
import { SearchDialog } from "@/lib/components/features/dashboard"
import { cn } from "@/lib/utils"
import { getCleanPath } from "@/utils/getCleanPath"
import { useIsMobile } from "@/hooks/use-mobile"

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const curPath = getCleanPath(pathname)
  const { open, setOpen } = useSidebar()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) {
      setOpen(false)
    }
  }, [curPath, isMobile])

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className={cn("rounded-lg", className)}
    >
      <AppSidebarHeader />

      <SidebarContent className="gap-4">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SearchDialog className="" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="py-0">
          <SidebarMenu className="space-y-0.5">
            {NavMenusMain.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-9 rounded-md pl-4 hover:bg-primary/20",
                    item.href === curPath && "bg-primary/20",
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="font-semibold">
            管理 meme
          </SidebarGroupLabel>
          <SidebarMenu className={cn("space-y-0.5", open && "pl-4")}>
            {NavMenusMeme.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-9 rounded-md hover:bg-primary/20",
                    item.href === curPath && "bg-primary/20",
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="font-semibold">其他</SidebarGroupLabel>
          <SidebarMenu className={cn("space-y-0.5", open && "pl-4")}>
            {NavMenusOther.map((item) => (
              <SidebarMenuItem
                // id={
                //   item.href === "/channels"
                //     ? "intro-channel-add"
                //     : item.href === "/dailies/history"
                //       ? "intro-read-start"
                //       : ""
                // }
                key={item.href}
              >
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-9 rounded-md hover:bg-primary/20",
                    item.href === curPath && "bg-primary/20",
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SubmitAccountDialog />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <FeedbackDialog />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* <AppSidebarFooter /> */}
    </Sidebar>
  )
}
