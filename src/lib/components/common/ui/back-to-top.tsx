"use client"

import { useMemoizedFn, useScroll } from "ahooks"
import { ChevronUp } from "lucide-react"
import { usePathname } from "next/navigation"
import React, { useMemo } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/lib/components/common/ui/button"

type BackToTopProps = {
  scrollRef?: React.MutableRefObject<HTMLDivElement | null>
}

/**
 * 回到顶部按钮
 *
 * @param scrollRef 滚动的容器
 * @returns 返回回到顶部按钮的React组件
 */
export const BackToTop = ({ scrollRef }: BackToTopProps) => {
  const pathname = usePathname()

  // 特别注意：useScroll 用的是 document 而不是 document.documentElement
  // useScroll 如果设置的是 document.documentElement，scroll.top 会一直为 0
  const scroll = useScroll(() => scrollRef?.current || document)

  const handleClick = useMemoizedFn(() => {
    if (scrollRef?.current) {
      scrollRef?.current.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // 这里回到顶部使用 document.documentElement，因为 document 上没有 scrollTo 这个方法
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" })
  })

  const hidden = useMemo(
    () =>
      pathname === "/daily" ||
      pathname === "/dailies/history" ||
      pathname.startsWith("/meme/create") ||
      (scroll?.top ?? 0) < 100,
    [pathname, scroll?.top],
  )

  return (
    <Button
      className={cn("fixed bottom-8 right-8", {
        hidden,
      })}
      variant="outline"
      size={"icon"}
      onClick={handleClick}
    >
      <ChevronUp className="size-4" />
    </Button>
  )
}
