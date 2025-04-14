"use client"

import { SquarePen } from "lucide-react"
import { useRequest } from "ahooks"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { match } from "ts-pattern"

import { CreateMyPlanButton, PlanCard } from "../plan"
import { FavoriteButton } from "../plan/FavoriteButton"
import { ActivePushPopover } from "../plan/ActivePushPopover"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../common/ui/dropdown-menu"

import { OpenPlanButton } from "./OpenPlanButton"
import { ClonePlanButton } from "./ClonePlanButton"
import { DeletePlanAlert } from "./DeletePlanAlert"

import { Button } from "@/lib/components/common/ui/button"
import { IllustrationNoContent } from "@/lib/components/common/illustrations"
import { getMyPlansAction } from "@/lib/api/plan"
import { SubscribeDialog } from "@/lib/components/features/subscriptions"
import { Separator } from "@/lib/components/common/ui/separator"
import { cn } from "@/lib/utils"
import { useSubscribeStateStore } from "@/lib/store/subscribeState"
import { useCreatePlanStore } from "@/lib/store/createPlan"
import { usePlanDialog } from "@/lib/context/plan/PlanDialogContext"

export function MyPlanPage({ className }: { className?: string }) {
  const { data: session } = useSession()
  const userId = session?.user?.id as string
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [myPlans, setMyPlans] = useState<
    Awaited<ReturnType<typeof getMyPlansAction>>["data"]
  >([])
  const { subscribeState } = useSubscribeStateStore()
  const { setIsPlanDialogOpen, setPlanDialogId } = usePlanDialog()
  const {
    setPlanName,
    setPlanDescription,
    setPlanAvatarUrl,
    setIsPublic,
    setSelectedAccounts,
    setDomain,
    setSelectedChannel,
    setPlanId,
    reset,
  } = useCreatePlanStore()

  const { run: getMyPlans, loading: loadingMyGetPlans } = useRequest(
    () => getMyPlansAction({ userId }),
    {
      ready: !!userId,
      onSuccess(data) {
        setMyPlans(data.data)
      },
    },
  )

  useEffect(() => {
    if (subscribeState.planId) {
      setMyPlans((prev) => {
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

  const emptyMyPlan = !myPlans.length

  const handlePlanDialogOpen = (planId: string) => {
    setPlanDialogId(planId)
    setIsPlanDialogOpen(true)
  }

  return (
    <div className={cn(className)}>
      {match(loadingMyGetPlans)
        .with(true, () => <LoadingPlanList />)
        .otherwise(() => (
          <>
            {emptyMyPlan ? (
              <EmptyCreatedPlan />
            ) : (
              <div className="grid grid-cols-2 ~gap-4/10 lg:grid-cols-3 xl:grid-cols-4">
                {myPlans.map((plan) => {
                  return (
                    <PlanCard
                      className="mb-4"
                      onSuccessDeleteCallback={getMyPlans}
                      isOwner={plan.userId === userId}
                      key={plan.planId}
                      showBadge={["shared"]}
                      {...plan}
                      onFavoriteSuccessCallback={(planId, isFavorite) => {
                        getMyPlans()
                      }}
                      expandedMenuChildren={
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
                              setIsEditDialogOpen(true)
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

                          {/* <OpenPlanButton
                            userId={userId}
                            variant="ghost"
                            className="justify-start"
                            planId={plan.planId}
                            isShared={plan.isShared}
                            onSharePlanCallback={(planId) => {
                              setMyPlans((prev) =>
                                prev.map((plan) => {
                                  if (plan.planId === planId) {
                                    return { ...plan, isShared: !plan.isShared }
                                  }
                                  return plan
                                }),
                              )
                            }}
                          /> */}

                          <DropdownMenuItem asChild>
                            <ClonePlanButton
                              size="sm"
                              userId={userId}
                              defaultValue={{
                                ...plan,
                                planSourceId: plan.planSourceId,
                                subscribeSource: plan.subscribeSource.map(
                                  (item) => Number(item.id),
                                ),
                              }}
                              onClonePlanSuccessCallback={getMyPlans}
                            />
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <FavoriteButton
                              size="sm"
                              planId={plan.planId}
                              isFavorite={plan.isFavorite}
                              onFavoriteSuccessCallback={getMyPlans}
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

                          {/* {plan.isSubscribed && (
                            <>
                              <SubscribeDialog
                                isSubscribed={plan.isSubscribed}
                                type="change"
                                variant="ghost"
                                beSubscribedId={plan.beSubscribedId}
                                originalChannels={plan.channel}
                                planId={plan.planId}
                              />

                              <SubscribeDialog
                                isSubscribed
                                cancelBtnVariant="ghost"
                                planId={plan.planId}
                                beSubscribedId={plan.beSubscribedId}
                                originalChannels={plan.channel}
                                onSubscribeSuccessCallback={(
                                  planId,
                                  isSubscribed,
                                  selectedChannel,
                                ) => {
                                  setMyPlans((prev) =>
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
                            </>
                          )} */}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem asChild variant="destructive">
                            <DeletePlanAlert
                              size="sm"
                              userId={userId}
                              onSuccessDeleteCallback={(planId) => {
                                setMyPlans((prev) =>
                                  prev.filter((plan) => plan.planId !== planId),
                                )
                              }}
                              className="w-full justify-start"
                              planId={plan.planId}
                              planName={plan.planName}
                            />
                          </DropdownMenuItem>
                        </>
                      }
                    >
                      <SubscribeDialog
                        preview
                        size="icon"
                        isSubscribed={plan.isSubscribed}
                        planId={plan.planId}
                        beSubscribedId={plan.beSubscribedId}
                        originalChannels={plan.channel}
                        onSubscribeSuccessCallback={(
                          planId,
                          isSubscribed,
                          selectedChannel,
                        ) => {
                          console.log(isSubscribed, selectedChannel, planId)

                          setMyPlans((prev) => {
                            return prev.map((plan) => {
                              if (plan.planId === planId) {
                                return {
                                  ...plan,
                                  isSubscribed,
                                  channel: selectedChannel ?? [],
                                }
                              }
                              return plan
                            })
                          })
                        }}
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
