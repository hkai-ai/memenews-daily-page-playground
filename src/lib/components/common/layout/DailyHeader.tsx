"use client"

import { signIn, useSession } from "next-auth/react"

import { ThemeSwitcher } from "../theme/ThemeSwitcher"
import { Button } from "../ui/button"

import { LogoTitle } from "./LogoTitle"
import { UserNav } from "./UserNav"

import { cn } from "@/lib/utils"

export function DailyHeader({
  className,
  leftChildren,
  rightChildren,
}: {
  className?: string
  leftChildren?: React.ReactNode
  rightChildren?: React.ReactNode
}) {
  const { status: sessionStatus } = useSession()

  return (
    <header
      id="header-bar"
      className={cn(
        "sticky inset-0 top-0 z-30 h-16 items-center gap-2 bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:static">
        {leftChildren}

        <LogoTitle src="/home" hideBetaBadge />

        <div className="flex items-center gap-2 lg:ml-auto">
          <ThemeSwitcher />

          {rightChildren}

          {sessionStatus === "unauthenticated" ? (
            <Button variant="outline" onClick={() => signIn()}>
              登录
            </Button>
          ) : (
            <UserNav />
          )}
        </div>
      </div>
    </header>
  )
}
