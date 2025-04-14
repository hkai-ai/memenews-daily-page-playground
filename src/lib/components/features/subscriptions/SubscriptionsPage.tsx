"use client"

import Link from "next/link"
import { Newspaper, SquarePen } from "lucide-react"
import { useRequest } from "ahooks"
import { useSession } from "next-auth/react"
import { match } from "ts-pattern"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { PlanCard } from "../plan"
import { PlanCardSkeleton } from "../plan/PlanCardSkeleton"
import { ClonePlanButton, DeletePlanAlert, OpenPlanButton } from "../myPlan"
import { Separator } from "../../common/ui/separator"
import { FavoriteButton } from "../plan/FavoriteButton"
import { ActivePushPopover } from "../plan/ActivePushPopover"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../common/ui/dropdown-menu"

import { Button } from "@/lib/components/common/ui/button"
import { IllustrationNoContent } from "@/lib/components/common/illustrations"
import { getSubscribedPlansAction } from "@/lib/api/plan"
import { SubscribeDialog } from "@/lib/components/features/subscriptions"
import { cn } from "@/lib/utils"
import { useCreatePlanStore } from "@/lib/store/createPlan"
import { usePlanDialog } from "@/lib/context/plan/PlanDialogContext"

export interface Field {
  id: string
  channel: {
    name: string
    address: string
  }
}

export function SubscriptionsPage({ className }: { className?: string }) {
  const { data: session } = useSession()
  const userId = session?.user?.id as string
  const [subscribedPlans, setSubscribedPlans] = useState<
    Awaited<ReturnType<typeof getSubscribedPlansAction>>["data"]
  >([])
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
  const { setIsPlanDialogOpen, setPlanDialogId } = usePlanDialog()
  const router = useRouter()

  const { run: getSubscribePlans, loading: loadingGetSubscribedPlans } =
    useRequest(() => getSubscribedPlansAction({ userId }), {
      ready: !!userId,
      onSuccess(data) {
        setSubscribedPlans(data.data)
      },
    })

  const emptySubscribedPlans = !subscribedPlans.length

  const handlePlanDialogOpen = (planId: string) => {
    setPlanDialogId(planId)
    setIsPlanDialogOpen(true)
  }

  return (
    <div className={cn(className)}>
      {match(loadingGetSubscribedPlans)
        .with(true, () => <LoadingPlanList />)
        .otherwise(() => (
          <>
            {emptySubscribedPlans ? (
              <EmptySubscribePlan />
            ) : (
              <div className="grid grid-cols-2 ~gap-4/10 lg:grid-cols-3 xl:grid-cols-4">
                {subscribedPlans.map((plan) => (
                  <PlanCard
                    className="mb-4"
                    isOwner={plan.userId === userId}
                    key={plan.planId}
                    showBadge={["owner"]}
                    {...plan}
                    isShared
                    onFavoriteSuccessCallback={(planId, isFavorite) => {
                      getSubscribePlans()
                    }}
                    expandedMenuChildren={
                      <>
                        {plan.userId === userId && (
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
                          </>
                        )}

                        {/* <SubscribeDialog
                          type="change"
                          variant="ghost"
                          isSubscribed={plan.isSubscribed}
                          beSubscribedId={plan.beSubscribedId}
                          originalChannels={plan.channel.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            address: channel.address,
                          }))}
                          planId={plan.planId}
                          onSubscribeSuccessCallback={(
                            planId,
                            isSubscribed,
                            selectedChannel,
                          ) => {
                            setSubscribedPlans((prev) => {
                              if (!isSubscribed) {
                                return prev.filter(
                                  (plan) => plan.planId !== planId,
                                )
                              }
                              return prev.map((plan) => {
                                if (plan.planId === planId) {
                                  return {
                                    ...plan,
                                    channel: selectedChannel || [],
                                  }
                                }
                                return plan
                              })
                            })
                          }}
                        />

                        <SubscribeDialog
                          isSubscribed={plan.isSubscribed}
                          className="w-full justify-start"
                          cancelBtnVariant="ghost"
                          beSubscribedId={plan.beSubscribedId}
                          originalChannels={plan.channel.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            address: channel.address,
                          }))}
                          planId={plan.planId}
                          onSubscribeSuccessCallback={(
                            planId,
                            isSubscribed,
                            selectedChannel,
                          ) => {
                            setSubscribedPlans((prev) => {
                              if (!isSubscribed) {
                                return prev.filter(
                                  (plan) => plan.planId !== planId,
                                )
                              }
                              return prev.map((plan) => {
                                if (plan.planId === planId) {
                                  return {
                                    ...plan,
                                    channel: selectedChannel || [],
                                  }
                                }
                                return plan
                              })
                            })
                          }}
                        /> */}

                        <DropdownMenuItem asChild>
                          <FavoriteButton
                            size="sm"
                            className="w-full justify-start"
                            planId={plan.planId}
                            isFavorite={plan.isFavorite}
                            onFavoriteSuccessCallback={getSubscribePlans}
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

                        {plan.userId === userId && (
                          <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem variant="destructive" asChild>
                              <DeletePlanAlert
                                size="sm"
                                userId={userId}
                                className="w-full justify-start"
                                onSuccessDeleteCallback={(planId) => {
                                  setSubscribedPlans((prev) =>
                                    prev.filter(
                                      (plan) => plan.planId !== planId,
                                    ),
                                  )
                                }}
                                planId={plan.planId}
                                planName={plan.planName}
                              />
                            </DropdownMenuItem>
                          </>
                        )}
                      </>
                    }
                  >
                    <SubscribeDialog
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
                        setSubscribedPlans((prev) => {
                          if (!isSubscribed) {
                            return prev.filter((plan) => plan.planId !== planId)
                          }
                          return prev.map((plan) => {
                            if (plan.planId === planId) {
                              return { ...plan, channel: selectedChannel || [] }
                            }
                            return plan
                          })
                        })
                      }}
                    />
                  </PlanCard>
                ))}
              </div>
            )}
          </>
        ))}
    </div>
  )
}

function EmptySubscribePlan() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-40">
      <IllustrationNoContent />
      <p>您还没有订阅任何 meme，快去订阅吧！</p>
      <Button variant="outline" className="gap-2" asChild>
        <Link href="/memes">
          <Newspaper className="size-4" />
          探索 meme
        </Link>
      </Button>
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
