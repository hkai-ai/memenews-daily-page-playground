"use client"

import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/lib/components/common/ui/button"
import { cn } from "@/lib/utils"

export function StartButton() {
  const { data: session, status } = useSession()

  return (
    <>
      {status === "authenticated" ? (
        <Link
          className="text-white dark:text-zinc-900"
          href={session?.user?.redirectUrl || "/memes"}
        >
          <Button
            size="sm"
            className={cn(
              "relative overflow-hidden px-4 py-1",
              "bg-zinc-900 dark:bg-zinc-100",
              "transition-all duration-200",
              "group",
            )}
          >
            <div className="relative flex items-center justify-center gap-2">
              前往订阅
              <ArrowUpRight className="h-3.5 w-3.5 text-white/90 dark:text-zinc-900/90" />
            </div>
          </Button>
        </Link>
      ) : (
        <Button
          size="sm"
          className={cn(
            "relative overflow-hidden px-4 py-1",
            "bg-zinc-900 dark:bg-zinc-100",
            "transition-all duration-200",
            "group",
          )}
          onClick={() => signIn()}
        >
          登录后体验
        </Button>
      )}
    </>
  )
}
