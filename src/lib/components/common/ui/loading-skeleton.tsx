"use client"

import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  textClassName?: string
  children?: React.ReactNode
}

export function LoadingSkeleton({
  className,
  children = "加载中",
  textClassName,
}: LoadingSkeletonProps) {
  return (
    <div
      className={
        (cn("mx-auto w-fit cursor-pointer text-primary-foreground outline"),
        className)
      }
    >
      <span className={cn("flex items-center gap-2", textClassName)}>
        <Loader2 className="size-3.5 animate-spin" />
        {children}...
      </span>
    </div>
  )
}
