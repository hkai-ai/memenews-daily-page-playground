import { ImageAssets } from "@/lib/constants"
import { cn } from "@/lib/utils"

/**
 * 即将到来
 */
export function ComingSoon({
  children,
  className,
  title = "即将到来...",
}: {
  children: React.ReactNode
  className?: string
  title?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative z-30">{children}</div>
      <div className="absolute inset-0 z-[100] cursor-not-allowed rounded-md bg-gray-50 opacity-75" />
      <div className="absolute inset-0 z-[101] flex cursor-not-allowed items-center justify-center">
        <div className="space-x-4 text-xs text-primary">
          <span>{title}</span>

          <img
            src={ImageAssets.loadingCat}
            className="inline size-6"
            alt="喵喵喵喵喵"
          />
        </div>
      </div>
    </div>
  )
}
