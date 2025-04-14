"use client"

import Link from "next/link"
import { Plus, SquarePen } from "lucide-react"
import { useRequest } from "ahooks"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { match } from "ts-pattern"

import { CreateMyPlanButton, PlanCard } from "../plan"
import { PlanCardSkeleton } from "../plan/PlanCardSkeleton"
import { ClonePlanButton, DeletePlanAlert, OpenPlanButton } from "../myPlan"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../common/ui/dropdown-menu"

import { FavoriteButton } from "./FavoriteButton"
import { ActivePushPopover } from "./ActivePushPopover"

import { Button } from "@/lib/components/common/ui/button"
import { IllustrationNoContent } from "@/lib/components/common/illustrations"
import { SubscribeDialog } from "@/lib/components/features/subscriptions"
import { getFavoritePlansAction } from "@/lib/api/plan/get-favorite-plans"
import { cn } from "@/lib/utils"
import { Separator } from "@/lib/components/common/ui/separator"
import { useSubscribeStateStore } from "@/lib/store/subscribeState"
import { useCreatePlanStore } from "@/lib/store/createPlan"
import { usePlanDialog } from "@/lib/context/plan/PlanDialogContext"

export function FavoritePlansPage({ className }: { className?: string }) {
  const { data: session } = useSession()
  const userId = session?.user?.id as string
  const { setIsPlanDialogOpen, setPlanDialogId } = usePlanDialog()
  const { subscribeState } = useSubscribeStateStore()
  const {
    setPlanName,
    setPlanDescription,
    setPlanAvatarUrl,
    setIsPublic,
    setSelectedAccounts,
    setDomain,
    setSelectedChannel,
    setPlanId,
  } = useCreatePlanStore()
  const [favoritePlans, setFavoritePlans] = useState<
    Awaited<ReturnType<typeof getFavoritePlansAction>>["data"]
  >([])

  const {
    run: getFavoritePlans,
    data: getFavoritePlansQuery,
    loading: loadingFavoritePlans,
  } = useRequest(() => getFavoritePlansAction({ userId }), {
    ready: !!userId,
    onSuccess(data) {
      setFavoritePlans(data.data)
    },
  })

  useEffect(() => {
    if (subscribeState.planId) {
      setFavoritePlans((prev) => {
        return prev.map((plan) => {
          if (plan.planId === subscribeState.planId) {
            return {
              ...plan,
              isSubscribed: subscribeState.isSubscribed,
              channel: subscribeState.selectedChannel,
              originalChannels: subscribeState.selectedChannel,
            }
          }
          return plan
        })
      })
    }
  }, [subscribeState])

  const emptyFavoritePlans = !favoritePlans.length

  const handlePlanDialogOpen = (planId: string) => {
    setPlanDialogId(planId)
    setIsPlanDialogOpen(true)
  }

  return (
    <div className={cn(className)}>
      {match(loadingFavoritePlans)
        .with(true, () => <LoadingPlanList />)
        .otherwise(() => (
          <>
            {emptyFavoritePlans ? (
              <EmptyCreatedPlan />
            ) : (
              <div className="grid grid-cols-2 ~gap-4/10 lg:grid-cols-3 xl:grid-cols-4">
                {favoritePlans.map((plan) => {
                  return (
                    <PlanCard
                      className="mb-4"
                      onSuccessDeleteCallback={getFavoritePlans}
                      isOwner={plan.userId === userId}
                      key={plan.planId}
                      {...plan}
                      onFavoriteSuccessCallback={(planId, isFavorite) => {
                        getFavoritePlans()
                      }}
                      expandedMenuChildren={(() => {
                        const isOwner = plan.userId === userId
                        const hasSubscription = plan.isSubscribed

                        return (
                          <>
                            {isOwner && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedAccounts(
                                      plan.subscribeSource.map((item) => ({
                                        ...item,
                                        isSub: true,
                                      })),
                                    )
                                    setPlanId(plan.planId)
                                    setPlanName(plan.planName)
                                    setPlanDescription(plan.planDescription)
                                    setPlanAvatarUrl(plan.planAvatarUrl)
                                    setIsPublic(plan.isShared)
                                    setDomain(plan.domain)
                                    if (plan.channel) {
                                      setSelectedChannel(plan.channel)
                                    }
                                    handlePlanDialogOpen(plan.planId)
                                  }}
                                >
                                  <SquarePen className="size-4" />
                                  编辑
                                </DropdownMenuItem>

                                {/* <CheckAccountSheet
                                  planName={plan.planName}
                                  planDescription={plan.planDescription}
                                  accounts={plan.subscribeSource}
                                /> */}

                                {/* <OpenPlanButton
                                  userId={userId}
                                  variant="ghost"
                                  className="justify-start"
                                  planId={plan.planId}
                                  isShared={plan.isShared}
                                  onSharePlanCallback={(planId) => {
                                    setFavoritePlans((prev) =>
                                      prev.map((plan) => {
                                        if (plan.planId === planId) {
                                          return {
                                            ...plan,
                                            isShared: !plan.isShared,
                                          }
                                        }
                                        return plan
                                      }),
                                    )
                                  }}
                                /> */}

                                {/* <ClonePlanButton
                                  userId={userId}
                                  defaultValue={{
                                    ...plan,
                                    planSourceId: plan.planSourceId,
                                    subscribeSource:
                                      plan.subscribeSource?.map((item) =>
                                        Number(item.id),
                                      ) || [],
                                  }}
                                  onClonePlanSuccessCallback={getFavoritePlans}
                                /> */}
                              </>
                            )}

                            {/* {hasSubscription && (
                              <SubscribeDialog
                                isSubscribed={plan.isSubscribed}
                                variant="ghost"
                                type="change"
                                className="w-full justify-start"
                                planId={plan.planId}
                                beSubscribedId={plan.beSubscribedId}
                                originalChannels={plan.channel}
                                onSubscribeSuccessCallback={(
                                  planId,
                                  isSubscribed,
                                  selectedChannel,
                                ) => {
                                  setFavoritePlans((prev) =>
                                    prev.map((plan) => {
                                      if (plan.planId === planId) {
                                        return {
                                          ...plan,
                                          isSubscribed,
                                          channel: selectedChannel ?? [],
                                        }
                                      }
                                      return plan
                                    }),
                                  )
                                }}
                              />
                            )}

                            <FavoriteButton
                              planId={plan.planId}
                              isFavorite={plan.isFavorite}
                              onFavoriteSuccessCallback={getFavoritePlans}
                            /> */}

                            <DropdownMenuItem asChild>
                              <FavoriteButton
                                size="sm"
                                className="w-full justify-start"
                                planId={plan.planId}
                                isFavorite={plan.isFavorite}
                                onFavoriteSuccessCallback={getFavoritePlans}
                              />
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <ActivePushPopover
                                variant="ghost"
                                className="w-full justify-start gap-2"
                                size="sm"
                                planId={plan.planId}
                              />
                            </DropdownMenuItem>

                            {isOwner && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" asChild>
                                  <DeletePlanAlert
                                    userId={userId}
                                    size="sm"
                                    className="w-full justify-start"
                                    planId={plan.planId}
                                    planName={plan.planName}
                                    onSuccessDeleteCallback={(planId) => {
                                      setFavoritePlans((prev) =>
                                        prev.filter(
                                          (plan) => plan.planId !== planId,
                                        ),
                                      )
                                    }}
                                  />
                                </DropdownMenuItem>
                              </>
                            )}
                          </>
                        )
                      })()}
                    >
                      <SubscribeDialog
                        preview
                        isSubscribed={plan.isSubscribed}
                        size="icon"
                        planId={plan.planId}
                        beSubscribedId={plan.beSubscribedId}
                        originalChannels={plan.channel}
                      />
                    </PlanCard>
                  )
                })}
              </div>
            )}
          </>
        ))}
    </div>
  )
}

function EmptyCreatedPlan() {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 py-40">
      <IllustrationNoContent />
      <p>您还没有任何 meme，快去创建吧！</p>
      <CreateMyPlanButton
        variant="secondary"
        align="center"
        className="w-fit"
      />
    </div>
  )
}

function LoadingPlanList() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex h-[280px] animate-pulse flex-col p-4">
          <div className="mb-4 h-32 rounded-md bg-muted-foreground/20" />
          <div className="mb-2 h-4 w-2/3 rounded bg-muted-foreground/20" />
          <div className="mb-4 h-4 w-1/2 rounded bg-muted-foreground/20" />
          <div className="mt-auto flex items-center justify-between">
            <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
            <div className="h-8 w-24 rounded bg-muted-foreground/20" />
          </div>
        </div>
      ))}
    </div>
  )
}
