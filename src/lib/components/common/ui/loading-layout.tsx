import { Shell } from "../layout/Shell"

import { LoadingCat } from "./loading-cat"

import { cn } from "@/lib/utils"

export function LoadingLayout({
  children,
  loading,
  className,
}: {
  children: React.ReactNode
  loading: boolean
  className?: string
}) {
  return (
    <Shell className={cn("lg:size-full", className)}>
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <LoadingCat />
        </div>
      ) : (
        children
      )}
    </Shell>
  )
}
