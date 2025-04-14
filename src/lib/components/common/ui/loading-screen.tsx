"use client"

import { cn } from "@/lib/utils"

export function LoadingScreen({
  children,
  className,
  loading,
}: {
  children: React.ReactNode
  className?: string
  loading: boolean
}) {
  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-[9999] h-screen w-screen">
          <div
            className={cn(
              "flex size-full items-center justify-center bg-white/30 text-primary-foreground dark:bg-black/30",
              className,
            )}
          ></div>
        </div>
      ) : (
        children
      )}
    </>
  )
}
