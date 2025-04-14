"use client"

import { useEffect, useRef } from "react"
import { Search } from "lucide-react"

import { showInfoToast } from "../../common/ui/toast"

import { Input } from "@/lib/components/common/ui/input"
import { cn } from "@/lib/utils"

export function SearchPlanInput({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 size-3 -translate-y-1/2 text-gray-400" />

      <Input
        placeholder="搜索 meme..."
        size={28}
        className="h-10 pl-8 text-base"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            showInfoToast("开发中")
          }
        }}
        ref={inputRef}
      />
    </div>
  )
}
