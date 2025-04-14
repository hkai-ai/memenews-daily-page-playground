import { Newspaper } from "lucide-react"
import Link from "next/link"

import { formatIndex } from "../dailyContent/NewsContent"

import { Icons } from "@/lib/components/common/icon"
import { Card, CardContent, CardHeader } from "@/lib/components/common/ui/card"
import { cn } from "@/lib/utils"
import { UserRefFrom } from "@/types/daily"

export function DailyNewsCard({
  id,
  title,
  date,
  newsItems,
  week,
  className,
  titleClassName,
  dateClassName,
  onLinkClick,
}: {
  id: string
  title: string
  date: string
  newsItems: { id?: string; content?: string; isRelated?: boolean }[]
  week?: string
  className?: string
  titleClassName?: string
  dateClassName?: string
  onLinkClick?: () => void
}) {
  return (
    <Card className={cn("min-w-max", className)}>
      <CardHeader className="flex flex-col items-start justify-between space-y-0 p-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h2
            className={cn(
              "font-bold tracking-tight ~text-sm/base",
              titleClassName,
            )}
          >
            {title}
          </h2>
          <p
            className={cn("text-muted-foreground ~text-xsm/xs", dateClassName)}
          >
            {date}
            <span className="ml-2">{week}</span>
          </p>
        </div>
        <Link
          href={`/daily/${id}?ref=${UserRefFrom.WEBSITE}`}
          onClick={onLinkClick}
          className="ml-auto text-red-500 transition-colors ~text-xsm/xs hover:text-red-600"
        >
          阅读全篇早报 {">"}
        </Link>
      </CardHeader>

      {!!newsItems.length ? (
        <CardContent className="grid gap-4 p-4 pt-0 md:grid-cols-[150px,1fr]">
          <div className="hidden aspect-square items-center justify-center rounded-lg bg-red-100 md:flex">
            <div className="relative flex size-24 items-center justify-center">
              <Newspaper className="size-full text-red-400" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {newsItems.map((item, index) => {
              let normalArticleCount = -1
              newsItems.slice(0, index + 1).forEach((newsItem) => {
                if (!newsItem.isRelated) {
                  normalArticleCount++
                }
              })

              const strIndex = String(normalArticleCount)
              const formattedIndex = item.isRelated
                ? "related"
                : formatIndex(strIndex)

              return (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="font-medium text-red-500 ~text-xsm/xs">
                    {formattedIndex === "related" ? (
                      <Icons.fire className="inline-block size-3" />
                    ) : (
                      formattedIndex
                    )}
                  </span>
                  <p className="text-gray-700 ~text-xsm/xs dark:text-gray-300">
                    {item.content}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      ) : (
        <div className="flex min-w-96 justify-center p-4">
          <span className="text-gray-700 ~text-xsm/xs dark:text-gray-300">
            暂无条目
          </span>
        </div>
      )}
    </Card>
  )
}
