import { XCircle } from "lucide-react"
import { motion } from "framer-motion"

import { Skeleton } from "@/lib/components/common/ui/skeleton"
import { Button } from "@/lib/components/common/ui/button"

export const OfficialPodcastSkeleton = () => (
  <div className="h-full w-full">
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gradient-to-br from-neutral-100/10 to-neutral-100/5 dark:from-neutral-800/20 dark:to-neutral-900/10">
      {/* 主体背景 */}
      <Skeleton className="animate-skeleton-pulse absolute inset-0 bg-neutral-200/40 dark:bg-neutral-800/40" />

      {/* 光效扫过动画 */}
      <div className="skeleton-shine absolute inset-0" />

      {/* 内容区域 */}
      <div className="absolute inset-x-0 bottom-0 space-y-2.5 p-4">
        {/* 标题 */}
        <Skeleton className="animate-skeleton-pulse h-6 w-4/5 rounded-md bg-neutral-300/50 dark:bg-neutral-700/50" />

        {/* 描述 */}
        <Skeleton className="animate-skeleton-pulse h-4 w-full rounded-md bg-neutral-200/50 dark:bg-neutral-800/50" />

        {/* 元数据 */}
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="animate-skeleton-pulse h-4 w-14 rounded-full bg-neutral-200/40 dark:bg-neutral-700/30" />
          <div className="h-3 w-[1px] rounded-full bg-neutral-300/20 dark:bg-neutral-600/20" />
          <Skeleton className="animate-skeleton-pulse h-4 w-16 rounded-full bg-neutral-200/40 dark:bg-neutral-700/30" />
        </div>
      </div>

      {/* 顶部渐变阴影 */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-100/10 to-transparent dark:from-neutral-900/10" />

      {/* 底部渐变阴影 */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  </div>
)

export const HotPodcastSkeleton = () => (
  <div className="h-full w-full">
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-neutral-100/10 to-neutral-100/5 dark:from-neutral-800/20 dark:to-neutral-900/10">
      {/* 主体背景 */}
      <Skeleton className="animate-skeleton-pulse absolute inset-0 bg-neutral-200/40 dark:bg-neutral-800/40" />

      {/* 光效扫过动画 */}
      <div className="skeleton-shine absolute inset-0" />

      {/* 内容区域 */}
      <div className="absolute inset-x-0 bottom-0 space-y-2 p-3">
        {/* 元数据 */}
        <Skeleton className="animate-skeleton-pulse h-3 w-2/3 rounded-full bg-neutral-200/40 dark:bg-neutral-700/30" />

        {/* 标题 */}
        <Skeleton className="animate-skeleton-pulse h-5 w-4/5 rounded-md bg-neutral-300/50 dark:bg-neutral-700/50" />

        {/* 底部元数据 */}
        <div className="mt-1.5 flex items-center gap-2">
          <Skeleton className="animate-skeleton-pulse h-3 w-10 rounded-full bg-neutral-200/40 dark:bg-neutral-700/30" />
          <div className="h-2 w-[1px] rounded-full bg-neutral-300/20 dark:bg-neutral-600/20" />
          <Skeleton className="animate-skeleton-pulse h-3 w-12 rounded-full bg-neutral-200/40 dark:bg-neutral-700/30" />
        </div>
      </div>

      {/* 顶部渐变阴影 */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-neutral-100/10 to-transparent dark:from-neutral-900/10" />

      {/* 底部渐变阴影 */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  </div>
)

export const ErrorPodcastSkeleton = () => (
  <div className="w-full p-8 text-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-center">
        <div className="relative rounded-full bg-red-500/10 p-5 shadow-sm">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/5 to-red-600/5" />
          <XCircle className="relative h-8 w-8 text-red-500" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-medium text-foreground/90">加载失败</h3>
        <p className="text-sm text-muted-foreground">请检查网络连接后重试</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mx-auto shadow-sm transition-all hover:bg-muted/80"
        onClick={() => window.location.reload()}
      >
        重新加载
      </Button>
    </motion.div>
  </div>
)
