"use client"

import { ThemeSwitcher } from "../theme/ThemeSwitcher"
import { Separator } from "../ui/separator"

import { UserNav } from "./UserNav"
import { LogoTitle } from "./LogoTitle"

import { cn } from "@/lib/utils"

export function DashboardHeader({
  className,
  leftChildren,
}: {
  className?: string
  leftChildren?: React.ReactNode
}) {
  return (
    <header
      id="header-bar"
      className={cn(
        "sticky inset-0 top-0 z-50 h-16 items-center gap-2 bg-background/95 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 md:static">
        {leftChildren}

        <div className="size-4 md:hidden" />

        <LogoTitle src="/home" className="md:hidden" />

        <div className="flex items-center gap-2 md:ml-auto">
          <ThemeSwitcher />

          <UserNav />
        </div>
      </div>
    </header>
  )
}
