"use client"

import { useRequest } from "ahooks"
import { Plus, SquarePen } from "lucide-react"
import { useSession } from "next-auth/react"
import { Link } from "next-view-transitions"
import { useEffect, useState, useMemo } from "react"

import { SubscribeDialog } from "../subscriptions/SubscribeDialog"
import { ClonePlanButton, DeletePlanAlert, OpenPlanButton } from "../myPlan"
import { Separator } from "../../common/ui/separator"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../common/ui/dropdown-menu"

import { FavoriteButton } from "./FavoriteButton"
import { ActivePushPopover } from "./ActivePushPopover"

import { CreateMyPlanButton, PlanCard } from "@/lib/components/features/plan"
import { IllustrationNoContent } from "@/lib/components/common/illustrations"
import { Button } from "@/lib/components/common/ui/button"
import { showErrorToast } from "@/lib/components/common/ui/toast"
import { getOpenPlansAction } from "@/lib/api/plan"
import { usePlanOperateStore } from "@/lib/store/planOperate"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/lib/components/common/ui/pagination"
import { useSubscribeStateStore } from "@/lib/store/subscribeState"
import { useCreatePlanStore } from "@/lib/store/createPlan"
import { usePlanDialog } from "@/lib/context/plan/PlanDialogContext"

export function OpendPlanList() {
  const { data: session } = useSession()
  const userId = session?.user?.id || ""
  const { subscribeState, setSubscribeState } = useSubscribeStateStore()
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
  const [openPlanList, setOpenPlanList] = useState<
    Awaited<ReturnType<typeof getOpenPlansAction>>["data"]
  >({
    result: [],
    pagination: { page: 1, pageSize: 12, totalPages: 1, totalPlans: 0 },
  })
  const { planOperateState } = usePlanOperateStore()
  const [page, setPage] = useState(1)
  const pageSize = 12
  const { setIsPlanDialogOpen, setPlanDialogId } = usePlanDialog()
  const { loading: loadingPlans, run: getPlans } = useRequest(
    () => getOpenPlansAction({ userId, page, pageSize }),
    {
      ready: !!userId,
      refreshDeps: [page, pageSize],
      onSuccess(data) {
        setOpenPlanList(data.data || [])
      },
      onError(error: any) {
        showErrorToast(`获取 meme 失败: ${error.message.statusText}`)
      },
    },
  )

  /**
   * 当日报详情页的订阅状态更新后，这里会同步进行更新，而不是直接刷新列表
   */
  useEffect(() => {
    if (planOperateState.planId) {
      setOpenPlanList((prev) => {
        return {
          ...prev,
          result: prev.result.map((plan) =>
            plan.planId === planOperateState.planId
              ? {
                  ...plan,
                  isSubscribed: planOperateState.isSubscribed,
                  originalChannels: planOperateState.originalChannels,
                }
              : plan,
          ),
        }
      })
    }
  }, [planOperateState])

  /**
   * 监听 subscribeState 的变化，当它变化时更新列表
   */
  useEffect(() => {
    if (subscribeState.planId) {
      setOpenPlanList((prev) => {
        return {
          ...prev,
          result: prev.result.map((plan) => {
            if (plan.planId === subscribeState.planId) {
              return {
                ...plan,
                isSubscribed: subscribeState.isSubscribed,
                channel: subscribeState.selectedChannel,
                originalChannels: subscribeState.selectedChannel,
              }
            }
            return plan
          }),
        }
      })
    }
  }, [subscribeState])

  const handlePlanDialogOpen = useMemo(() => {
    return (planId: string) => {
      setTimeout(() => {
        setIsPlanDialogOpen(true)
        setPlanDialogId(planId)
      }, 0)
    }
  }, [setIsPlanDialogOpen, setPlanDialogId])

  const emptyPlans = useMemo(() => {
    return openPlanList?.result?.length === 0
  }, [openPlanList?.result?.length])

  const handlePrevPage = useMemo(() => {
    return () => setPage((p) => Math.max(1, p - 1))
  }, [])

  const handleNextPage = useMemo(() => {
    return () =>
      setPage((p) => Math.min(openPlanList.pagination.totalPages, p + 1))
  }, [openPlanList.pagination.totalPages])

  const handleFavoriteSuccess = useMemo(() => {
    return (planId: string, isFavorite: boolean) => {
      setOpenPlanList((prev) => ({
        ...prev,
        result: prev.result.map((plan) =>
          plan.planId === planId ? { ...plan, isFavorite } : plan,
        ),
      }))
    }
  }, [])

  const handleSharePlanSuccess = useMemo(() => {
    return (planId: string) => {
      setOpenPlanList((prev) => ({
        ...prev,
        result: prev.result.filter((p) => p.planId !== planId),
      }))
    }
  }, [])

  const handleDeleteSuccess = useMemo(() => {
    return (planId: string) => {
      setOpenPlanList((prev) => ({
        ...prev,
        result: prev.result.filter((plan) => plan.planId !== planId),
      }))
    }
  }, [])

  return (
    <>
      <div>
        {loadingPlans ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex h-[280px] animate-pulse flex-col p-4"
              >
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
        ) : emptyPlans ? (
          <EmptyPlans />
        ) : (
          <div
            id="intro-plan-subscribe"
            className="grid grid-cols-2 ~gap-4/10 lg:grid-cols-3 xl:grid-cols-4"
          >
            {openPlanList.result.map((plan) => {
              const isOwner = plan.userId === userId

              return (
                <PlanCard
                  className="mb-4"
                  key={plan.planId}
                  isOwner={isOwner}
                  showBadge={["owner"]}
                  {...plan}
                  onFavoriteSuccessCallback={handleFavoriteSuccess}
                  expandedMenuChildren={
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
                              handlePlanDialogOpen(plan.planId)
                              if (plan.channel) {
                                setSelectedChannel(plan.channel)
                              }
                            }}
                          >
                            <SquarePen className="size-4" />
                            编辑
                          </DropdownMenuItem>
                          {/* <Button
                            variant="ghost"
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
                              handlePlanDialogOpen(plan.planId)
                              if (plan.channel) {
                                setSelectedChannel(plan.channel)
                              }
                            }}
                            className="w-full justify-start gap-2"
                          >
                            <SquarePen className="size-4" />
                            编辑
                          </Button> */}

                          {/* <CheckAccountSheet
                          planName={plan.planName}
                          planDescription={plan.planDescription}
                          accounts={plan.subscribeSource}
                        /> */}

                          {/* <OpenPlanButton
                            variant="ghost"
                            userId={userId}
                            className="justify-start"
                            planId={plan.planId}
                            isShared={plan.isShared}
                            onSharePlanCallback={() =>
                              handleSharePlanSuccess(plan.planId)
                            }
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
                            onClonePlanSuccessCallback={() => {
                              // router.refresh()
                            }}
                          /> */}
                        </>
                      )}

                      {/* <ActivePushPopover
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        size="default"
                        planId={plan.planId}
                      /> */}

                      {/* {plan.isSubscribed && (
                        <SubscribeDialog
                          type="change"
                          isSubscribed={plan.isSubscribed}
                          variant="ghost"
                          planId={plan.planId}
                          beSubscribedId={plan.beSubscribedId}
                          originalChannels={plan.channel}
                        />
                      )} */}

                      <DropdownMenuItem asChild>
                        <FavoriteButton
                          size="sm"
                          planId={plan.planId}
                          isFavorite={plan.isFavorite}
                          onFavoriteSuccessCallback={getPlans}
                        />
                      </DropdownMenuItem>

                      {isOwner && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild variant="destructive">
                            <DeletePlanAlert
                              size="sm"
                              userId={userId}
                              planId={plan.planId}
                              planName={plan.planName}
                              onSuccessDeleteCallback={(planId) => {
                                setOpenPlanList((prev) => ({
                                  ...prev,
                                  result: prev.result.filter(
                                    (plan) => plan.planId !== planId,
                                  ),
                                }))
                              }}
                            />
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  }
                >
                  <SubscribeDialog
                    size="icon"
                    preview
                    isSubscribed={plan.isSubscribed}
                    originalChannels={plan.channel?.map((channel) => ({
                      id: channel.id,
                      name: channel.name,
                      address: channel.address,
                    }))}
                    planId={plan.planId}
                    beSubscribedId={plan.beSubscribedId}
                  />
                </PlanCard>
              )
            })}
          </div>
        )}
      </div>

      {openPlanList.pagination && openPlanList.pagination.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevPage}
                  isActive={page === 1}
                />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink>
                {openPlanList.pagination.page} /{" "}
                {openPlanList.pagination.totalPages}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                isActive={page === openPlanList.pagination.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}

function EmptyPlans() {
  return (
    <div className="mx-auto flex w-fit flex-col items-center space-y-2 py-40">
      <IllustrationNoContent />
      <p>这里空空如也</p>
      <CreateMyPlanButton
        variant="secondary"
        align="center"
        className="w-fit"
      />
    </div>
  )
}
