"use client"

import { useState } from "react"
import { useRequest } from "ahooks"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../common/ui/dialog"
import { Button } from "../../common/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../common/ui/card"
import { Skeleton } from "../../common/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../common/ui/chart"

import { getPlanStatisticsAction } from "@/lib/api/plan"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#a4de6c"]

interface PlanStatisticsDialogProps {
  planId: string
  trigger?: React.ReactNode
}

export function PlanStatisticsDialog({
  planId,
  trigger,
}: PlanStatisticsDialogProps) {
  const [open, setOpen] = useState(false)

  const { data: statistics, loading } = useRequest(
    () => getPlanStatisticsAction({ planId }),
    {
      ready: open,
      refreshDeps: [planId],
      cacheKey: `plan-statistics-${planId}`,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  )

  const sourceData = statistics?.data.sourceKindStatistics.items
    ? Object.entries(statistics.data.sourceKindStatistics.items).map(
        ([name, value]) => ({
          name,
          value,
        }),
      )
    : []

  const tagData = statistics?.data.tagStatistics.items
    ? Object.entries(statistics.data.tagStatistics.items).map(
        ([name, value]) => ({
          name,
          value,
        }),
      )
    : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="secondary">
            数据统计
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[75vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>数据统计</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              loading={loading}
              label="订阅人数"
              value={`${statistics?.data.beSubscribedPlanNum} 人`}
            />
            <StatCard
              loading={loading}
              label="信息源数量"
              value={`${statistics?.data.subscribeSourcesCount} 个`}
            />
            <StatCard
              loading={loading}
              label="推送次数"
              value={`${statistics?.data.informationPush} 次`}
            />
            <StatCard
              loading={loading}
              label="已生成日报"
              value={`${statistics?.data.briefSummaryNum} 份`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <Card className="flex flex-col lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  订阅源平台分布
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                {loading ? (
                  <div className="h-[300px]">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <ChartContainer
                    className="mx-auto aspect-square max-h-[300px]"
                    config={{
                      twitter: { label: "Twitter" },
                      weibo: { label: "微博" },
                      wechat: { label: "微信" },
                      rss: { label: "RSS" },
                      dailypush: { label: "每日推送" },
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={sourceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => (
                          <ChartTooltipContent
                            active={active}
                            payload={payload}
                            labelKey="name"
                          />
                        )}
                      />
                      <ChartLegend
                        content={<ChartLegendContent nameKey="name" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center sm:[&>*]:basis-1/4"
                      />
                    </PieChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  覆盖领域标签分布
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {loading ? (
                  <div className="h-[300px]">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <ChartContainer
                    className="h-[300px] w-full"
                    config={{
                      value: { label: "数量" },
                    }}
                  >
                    <BarChart data={tagData} accessibilityLayer>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis tickLine={false} axisLine={false} />
                      <Bar
                        dataKey="value"
                        fill="#8884d8"
                        barSize={30}
                        radius={[4, 4, 0, 0]}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={false}
                      />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({
  label,
  value,
  trend,
  loading,
}: {
  label: string
  value?: string
  trend?: string
  loading?: boolean
}) {
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
