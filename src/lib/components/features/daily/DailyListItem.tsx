"use client"

import { Bookmark, Loader2 } from "lucide-react"
import { useRequest } from "ahooks"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"

import { Button } from "../../common/ui/button"
import { showErrorToast, showSuccessToast } from "../../common/ui/toast"
import { Card } from "../../common/ui/card"
import { HintTip } from "../../common/ui/hint-tip"
import { ActivePushPopover } from "../plan/ActivePushPopover"

import { HistoryRecords, UserRefFrom } from "@/types/daily"
import { cn } from "@/lib/utils"
import { addDailyFavoriteAction } from "@/lib/api/daily/add-daily-favorite"
import { deleteDailyFavoriteAction } from "@/lib/api/daily/delete-daily-favorite"
import { activePushAction } from "@/lib/api/daily/active-push"

interface DailyListItemProps {
  className?: string
  daily: HistoryRecords
  userId: string
  onFavoriteChangeCallback?: (id: string, isFavorited: boolean) => void
}

export function DailyListItem({
  className,
  daily,
  userId,
  onFavoriteChangeCallback,
}: DailyListItemProps) {
  const [open, setOpen] = useState(false)

  const { loading: loadingFavorite, runAsync: addDailyFavorite } = useRequest(
    addDailyFavoriteAction,
    {
      manual: true,
      ready: !!userId,
      onSuccess: (res) => {
        onFavoriteChangeCallback?.(res.data.summaryId, true)
        showSuccessToast("收藏成功")
      },
      onError: (error: any) => {
        showErrorToast(error.data.message)
      },
    },
  )

  const { loading: loadingDeleteFavorite, runAsync: deleteDailyFavorite } =
    useRequest(deleteDailyFavoriteAction, {
      manual: true,
      ready: !!userId,
      onSuccess: (res) => {
        onFavoriteChangeCallback?.(res.data.summaryId, false)
        showSuccessToast("取消收藏成功")
      },
      onError: (error: any) => {
        showErrorToast(error.data.message)
      },
    })

  const { loading: loadingPush, runAsync: pushDaily } = useRequest(
    activePushAction,
    {
      manual: true,
      ready: !!userId,
      onSuccess: (res) => {
        showSuccessToast("推送成功")
      },
      onError: (error: any) => {
        showErrorToast(error.data.message)
      },
      onFinally: () => {
        setOpen(false)
      },
    },
  )

  return (
    <div className={cn("flex gap-2", className)}>
      <Link
        href={`/daily/${daily?.id}?ref=${UserRefFrom.WEBSITE}`}
        className="flex-1"
      >
        <Card className="flex cursor-pointer gap-2 shadow-md transition-all duration-200 hover:bg-accent md:h-36">
          <div className="flex w-10 grow flex-col justify-between p-4">
            <div className="flex-1 space-y-2">
              <h1 className="w-full font-semibold ~text-sm/base md:line-clamp-1">
                {daily.title || "无标题"}
              </h1>

              <p className="line-clamp-3 w-full text-muted-foreground ~text-xsm/xs">
                {daily.contentSummary || "无内容"}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold ~text-xsm/xs">
                {format(daily.timestamp, "yyyy-MM-dd")} {daily.week}
              </span>
            </div>
          </div>

          <img
            src={daily.avatar}
            alt="日报的封面"
            className="hidden aspect-video h-full rounded-r-lg object-cover md:block"
          />
        </Card>
      </Link>

      <div className="flex flex-col justify-end gap-2">
        <ActivePushPopover
          variant="ghost"
          size="icon"
          planId={daily.id}
        />

        <HintTip label="收藏" side="bottom">
          <Button
            variant={
              loadingFavorite || loadingDeleteFavorite
                ? "secondary"
                : "secondary"
            }
            size="icon"
            disabled={loadingFavorite || loadingDeleteFavorite}
            onClick={(e) => {
              e.preventDefault()
              if (daily.isFavorited) {
                deleteDailyFavorite({ userId, summaryId: daily.id })
              } else {
                addDailyFavorite({ userId, summaryId: daily.id })
              }
            }}
          >
            {loadingFavorite || loadingDeleteFavorite ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Bookmark
                className={cn(
                  "size-4",
                  daily.isFavorited && "fill-orange-500 stroke-orange-500",
                )}
              />
            )}
          </Button>
        </HintTip>
      </div>
    </div>
  )
}
