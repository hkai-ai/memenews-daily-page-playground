"use client"

import { useRequest } from "ahooks"
import { useSession } from "next-auth/react"
import { match } from "ts-pattern"
import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

import { ImageAssets } from "../../../constants/assets"
import { LoadingCat } from "../../common/ui/loading-cat"
import { DailyListItem } from "../daily"
import { Avatar, AvatarFallback, AvatarImage } from "../../common/ui/avatar"
import { IllustrationNoContent } from "../../common/illustrations/illustration-no-content/index"
import { Button } from "../../common/ui/button"
import { Skeleton } from "../../common/ui/skeleton"

import { getPlanAction } from "@/lib/api/plan"
import { getDailiesHistoryAction } from "@/lib/api/daily"
import { HistoryRecords } from "@/types/daily"
import { usePlanOperateStore } from "@/lib/store/planOperate"
import { usePlanDialog } from "@/lib/context/plan/PlanDialogContext"
import { WEBSITE_NAME } from "@/lib/constants"

// Skeleton component for plan details during loading
function PlanDetailsSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-8 flex w-full flex-col items-center">
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="mb-4 h-16 w-3/4" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-2">
        <Skeleton className="h-6 w-40" />
      </div>
    </div>
  )
}

function DailiesListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
    </div>
  )
}

export function PlanDetails({ planId }: { planId: string }) {
  const { data } = useSession()
  const userId = data?.user?.id || ""

  const [planDetail, setPlanDetail] =
    useState<Awaited<ReturnType<typeof getPlanAction>>["data"]>()
  const [dailies, setDailies] = useState<HistoryRecords[]>([])
  const { setPlanOperateState } = usePlanOperateStore()
  const { setPlanDialogId, setIsPlanDialogOpen } = usePlanDialog()

  const { loading: loadingPlan } = useRequest(
    () =>
      getPlanAction({
        userId,
        planId,
      }),
    {
      ready: !!planId && !!userId,
      onSuccess(res) {
        setPlanDetail(res.data)
      },
    },
  )

  const { loading: loadingDailies } = useRequest(
    () =>
      getDailiesHistoryAction({
        userId,
        planId: planId,
        start: 0,
        end: 10,
      }),
    {
      ready: !!userId && !!planId,
      refreshDeps: [planId, userId],
      onSuccess(res) {
        setDailies(res.data.historyRecords)
      },
    },
  )

  useEffect(() => {
    if (loadingPlan) return

    setPlanOperateState({
      planId,
      isSubscribed: planDetail?.isSubscribed!,
      originalChannels: planDetail?.channel!,
    })
  }, [planDetail])

  const handleCardClick = () => {
    setTimeout(() => {
      setPlanDialogId(planId || null)
      setIsPlanDialogOpen(true)
    }, 0)
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {match(loadingPlan)
        .with(true, () => <PlanDetailsSkeleton />)
        .otherwise(() => (
          <div className="p-6">
            <div className="mb-8 flex w-full flex-col items-center">
              <h1 className="relative mb-2 text-3xl font-bold">
                {planDetail?.planName}

                <span className="absolute -right-8 -top-4 rounded-full bg-white px-2 py-1 text-sm text-neutral-500 shadow-lg dark:text-neutral-500">
                  {planDetail?.domain}
                </span>
              </h1>

              <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                <Avatar className="size-4">
                  <AvatarImage
                    className="object-cover"
                    src={planDetail?.avatar}
                    alt="avatar"
                  />
                  <AvatarFallback className="skeleton size-full">
                    {planDetail?.userName?.charAt(0).toUpperCase() ?? ""}
                  </AvatarFallback>
                </Avatar>
                {planDetail?.userName}
              </div>

              <p className="mb-4 text-sm text-gray-600">
                {planDetail?.planDescription}
              </p>

              {!planDetail?.isSubscribed && (
                <Button onClick={handleCardClick} className="gap-2">
                  <Bell className="size-4" />
                  订阅
                </Button>
                // <SubscribeDialog
                //   preview
                //   className="mx-auto"
                //   isSubscribed={planDetail?.isSubscribed!}
                //   planId={planId}
                //   beSubscribedId={planDetail?.beSubscribedId!}
                //   originalChannels={planDetail?.channel!}
                //   onSubscribeSuccessCallback={(
                //     planId,
                //     isSubscribed,
                //     selectedChannel,
                //   ) => {
                //     setPlanDetail((prev) => {
                //       if (!prev) return prev
                //       return {
                //         ...prev,
                //         isSubscribed,
                //         channel: selectedChannel || [],
                //       }
                //     })
                //   }}
                // />
              )}
            </div>

            {match(loadingDailies)
              .with(true, () => <DailiesListSkeleton />)
              .otherwise(() =>
                match(!dailies.length)
                  .with(true, () => (
                    <div className="flex flex-col items-center justify-center py-40">
                      <IllustrationNoContent className="size-40" />
                      <span className="text-sm text-gray-600">
                        该meme暂未生成任何日报
                      </span>
                    </div>
                  ))
                  .otherwise(() => (
                    <ol className="flex flex-col gap-4">
                      {dailies.map((daily, index) => (
                        <li key={index}>
                          {/* <Link href={`/daily/${daily.id}`} target="_blank"> */}
                          <DailyListItem
                            daily={daily}
                            userId={userId}
                            onFavoriteChangeCallback={(id, isFavorited) => {
                              setDailies(
                                dailies.map((daily) =>
                                  daily.id === id
                                    ? { ...daily, isFavorited }
                                    : daily,
                                ),
                              )
                            }}
                          />
                          {/* </Link> */}
                        </li>
                      ))}
                    </ol>
                  )),
              )}

            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>由</span>
              <span className="flex items-center gap-1 text-base font-bold text-primary">
                <img src={ImageAssets.logo} alt="logo" className="size-4" />
                {WEBSITE_NAME}
              </span>
              <span>提供</span>
            </div>
          </div>
        ))}
    </div>
  )
}
