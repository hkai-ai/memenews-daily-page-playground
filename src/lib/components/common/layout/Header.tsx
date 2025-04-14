"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

import { ThemeSwitcher } from "../theme/ThemeSwitcher"
import { HeaderStartButton } from "../../features/home/HeaderStartButton"

import { LogoTitle } from "./LogoTitle"
import { UserNav } from "./UserNav"

import { cn } from "@/lib/utils"

/**
 * Header 组件
 *
 * @param lang 当前语言
 * @param className 自定义类名
 * @returns 返回 JSX 元素
 */
export function Header({ lang, className }: { lang: any; className?: string }) {
  const pathname = usePathname()
  const { status } = useSession()

  const hidden =
    pathname.startsWith("/meme/create") || pathname.startsWith("/meme/edit")

  return (
    <div
      id="header-bar"
      className={cn(
        "sticky inset-0 top-0 z-40 bg-background/95 py-4 shadow-sm backdrop-blur",
        className,
        {
          hidden,
        },
      )}
    >
      <div className="container flex items-center justify-between md:static">
        <LogoTitle />

        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          <HeaderStartButton />

          {status === "authenticated" && <UserNav />}
        </div>
      </div>
    </div>
  )
}
