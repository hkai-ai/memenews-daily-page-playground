"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { Button } from "@/lib/components/common/ui/button"

export function PlanDetailsNavButton() {
  const router = useRouter()
  const { status } = useSession()
  const hasHistory = window.history.length > 1

  const handleNavigation = () => {
    if (hasHistory) {
      router.back()
    } else {
      if (status === "authenticated") {
        router.push("/memes")
      } else {
        router.push("/")
      }
    }
  }

  return (
    <Button variant="outline" onClick={handleNavigation} className="text-xs">
      {status === "unauthenticated"
        ? "Memene"
        : hasHistory
          ? "返回上一页"
          : "逛逛Memene"}
    </Button>
  )
}
