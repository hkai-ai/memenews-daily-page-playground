import { cn } from "@/lib/utils"

interface LoadingCatProps {
  className?: string

  children?: React.ReactNode
}

export function LoadingCat({
  className,
  children = "加载中",
}: LoadingCatProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full cursor-pointer select-none py-40 text-muted-foreground",
        className,
      )}
    >
      <span className="flex flex-col items-center justify-center gap-2 text-xs">
        <img
          src="/loading.gif"
          alt="loading"
          className="size-10 dark:invert dark:filter md:size-20"
        />
        <span>{children}...</span>
      </span>
    </div>
  )
}
