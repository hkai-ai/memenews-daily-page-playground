import { Card, CardContent } from "./card"
import { Skeleton } from "./skeleton"

interface StatCardProps {
  label: string
  value?: string
  trend?: string
  loading?: boolean
}

export function StatCard({ label, value, trend, loading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold">
                {value?.toLocaleString() ?? "-"}
              </p>
              {trend && <span className="text-xs text-green-500">{trend}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
