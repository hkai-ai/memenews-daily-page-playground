"use client"

import { Bookmark } from "lucide-react"
import { useRequest } from "ahooks"
import { format } from "date-fns"

import { Button } from "../../common/ui/button"
import { showErrorToast, showSuccessToast } from "../../common/ui/toast"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../common/ui/card"

import { HistoryRecords } from "@/types/daily"
import { cn } from "@/lib/utils"
import { addDailyFavoriteAction } from "@/lib/api/daily/add-daily-favorite"
import { deleteDailyFavoriteAction } from "@/lib/api/daily/delete-daily-favorite"

interface DailyListCardItemProps {
  daily: HistoryRecords
  userId: string
  onFavoriteChangeCallback?: (id: string, isFavorited: boolean) => void
}

export function DailyListCardItem({
  daily,
  userId,
  onFavoriteChangeCallback,
}: DailyListCardItemProps) {
  const { runAsync: addDailyFavorite } = useRequest(addDailyFavoriteAction, {
    manual: true,
    ready: !!userId,
    onSuccess: (res) => {
      onFavoriteChangeCallback?.(res.data.summaryId, true)
      showSuccessToast("收藏成功")
    },
    onError: (error: any) => {
      showErrorToast(error.data.message)
    },
  })

  const { runAsync: deleteDailyFavorite } = useRequest(
    deleteDailyFavoriteAction,
    {
      manual: true,
      ready: !!userId,
      onSuccess: (res) => {
        onFavoriteChangeCallback?.(res.data.summaryId, false)
        showSuccessToast("取消收藏成功")
      },
      onError: (error: any) => {
        showErrorToast(error.data.message)
      },
    },
  )

  return (
    <Card className="h-60 cursor-pointer transition-all duration-200 hover:bg-accent">
      <CardHeader>
        <CardTitle>
          <h1 className="line-clamp-1 text-sm font-semibold sm:text-xs md:text-base">
            {daily.summaryTitle}
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex p-3">
        <div className="flex flex-1 flex-col justify-between gap-2">
          <div className="space-y-1.5">
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {daily.contentSummary}
            </p>
          </div>
        </div>

        <div className="ml-3 h-24 w-24">
          <img
            src="/placeholder.svg"
            alt=""
            className="h-full w-full rounded-md object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {format(daily.timestamp, "yyyy-MM-dd")}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.preventDefault()
            if (daily.isFavorited) {
              deleteDailyFavorite({ userId, summaryId: daily.id })
            } else {
              addDailyFavorite({ userId, summaryId: daily.id })
            }
          }}
        >
          <Bookmark
            className={cn(
              "size-4",
              daily.isFavorited && "fill-orange-500 stroke-orange-500",
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  )
}
