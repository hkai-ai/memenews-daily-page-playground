"use client"

import { LogOut, ChevronsUpDown, Settings2, Home } from "lucide-react"
import { useSession, signOut, signIn } from "next-auth/react"
import { Link } from "next-view-transitions"
import { match } from "ts-pattern"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/lib/components/common/ui/sidebar"
import { delay } from "@/utils"
import { showSuccessToast } from "@/lib/components/common/ui/toast"

export function AppSidebarFooter() {
  const { data: session, status } = useSession()

  const handleLogout = async () => {
    showSuccessToast("退出登录成功")
    await delay(800)
    signOut({ callbackUrl: "/" })
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          {match(status)
            .with("loading", () => <Skeleton className="h-10 w-full" />)
            .with("authenticated", () => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        className="object-cover"
                        src={session?.user?.avatar ?? ""}
                        alt={session?.user?.name ?? ""}
                      />
                      <AvatarFallback className="skeleton size-full">
                        {session?.user?.name?.charAt(0).toUpperCase() ?? ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.name ?? ""}
                      </span>
                      <span className="truncate text-xs">
                        {session?.user?.email ?? ""}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          className="object-cover"
                          src={session?.user?.avatar ?? ""}
                          alt={session?.user?.name ?? ""}
                        />
                        <AvatarFallback className="skeleton size-full">
                          {session?.user?.name?.charAt(0).toUpperCase() ?? ""}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session?.user?.name ?? ""}
                        </span>
                        <span className="truncate text-xs">
                          {session?.user?.email ?? ""}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <Link href="/">
                      <DropdownMenuItem>
                        <Home className="size-4" />
                        主页
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem>
                        <Settings2 className="size-4" />
                        个人资料
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))
            .with("unauthenticated", () => (
              <Button asChild className="w-full">
                <Link href="/api/auth/signin">登录</Link>
              </Button>
            ))
            .otherwise(() => null)}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
