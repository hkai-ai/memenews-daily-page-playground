import { Skeleton } from "@/lib/components/common/ui/skeleton"

export function PlanCardSkeleton() {
  return (
    <>
      <div className="flex gap-4">
        <Skeleton className="rounded-full md:size-12" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8"></Skeleton>
          <Skeleton className="h-16"></Skeleton>
        </div>
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </>
  )
}
