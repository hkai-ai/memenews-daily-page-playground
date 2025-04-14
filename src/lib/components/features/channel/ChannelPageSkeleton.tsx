import { Shell } from "../../common/layout/Shell"

import { Skeleton } from "@/lib/components/common/ui/skeleton"

export function ChannelPageSkeleton() {
  return (
    <Shell
      variant="sidebar"
      className="container ml-0 w-full max-w-4xl justify-start space-y-4 p-4 pt-6"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="w-full space-y-4 rounded-md border p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="space-y-3">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-4 w-60" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
        </div>
      </div>
    </Shell>
  )
}
