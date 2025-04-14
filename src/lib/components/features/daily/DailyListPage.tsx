"use client"

import { useRequest } from "ahooks"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { match } from "ts-pattern"
import { type DateRange } from "react-day-picker"
import * as React from "react"
import { Check, ChevronRight, Plus } from "lucide-react"
import type { JSX } from "react"

import { CreateMyPlanButton, PlanCard } from "../plan"
import { SubscribeDialog } from "../subscriptions"
import { showErrorToast } from "../../common/ui/toast"

import { DailyListItem } from "./DailyListItem"
import { DailyListFilter } from "./DailyListFilter"

import { Calendar } from "@/lib/components/common/ui/calendar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/lib/components/common/ui/collapsible"
import {
  SidebarAbsolute,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/lib/components/common/ui/sidebar"
import { Button } from "@/lib/components/common/ui/button"
import { getDailiesHistoryAction } from "@/lib/api/daily"
import {
  getOpenPlansAction,
  getUserBeSubscribedPlansAction,
} from "@/lib/api/plan"
import { IllustrationNoContent } from "@/lib/components/common/illustrations"
import { Pagination } from "@/lib/components/common/pagination"
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { PlanBasis } from "@/types/plan"
import { HistoryRecords } from "@/types/daily"
import { DebugDialog } from "@/lib/components/common/debug/DebugDialog"
import { Skeleton } from "@/lib/components/common/ui/skeleton"

export function DailyListPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const userId = session?.user?.id || ""
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const dateParam = searchParams.get("date")
    return dateParam ? { from: new Date(dateParam) } : undefined
  })
  const timestamp = date?.from
    ? new Date(date.from).setHours(0, 0, 0, 0)
    : undefined

  const [selectedPlan, setSelectPlan] = useState<Partial<PlanBasis>>(() => {
    const planIdParam = searchParams.get("planId")
    return planIdParam ? { planId: planIdParam } : {}
  })
  const [dateOrder, setDateOrder] = useState<"desc" | "asc">("desc")

  const [params, setParams] = useState({
    pageIndex: Number(searchParams.get("pageIndex")) || DEFAULT_PAGE_INDEX,
    pageSize: Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE,
  })
  const [noAnySubscribe, setNoAnySubscribe] = useState(false)
  const [dailies, setDailies] = useState<HistoryRecords[]>([])
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("pageIndex", params.pageIndex.toString())
    newSearchParams.set("pageSize", params.pageSize.toString())
    if (selectedPlan.planId) newSearchParams.set("planId", selectedPlan.planId)
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }, [params, date, selectedPlan, router])

  const { data: plans, loading: loadingGetUserPlans } = useRequest(
    () => getUserBeSubscribedPlansAction({ userId }),
    {
      ready: !!userId,
      onSuccess: (data) => {
        if (data.data === null) {
          setNoAnySubscribe(true)
          return
        }

        setNoAnySubscribe(false)

        const planIdParam = searchParams.get("planId")
        if (planIdParam) {
          const selectedPlan = data.data.find(
            (plan) => plan.planId === planIdParam,
          )
          setSelectPlan(selectedPlan || {})
        }
      },
    },
  )

  const { data: getDailiesQuery, loading: loadingDailies } = useRequest(
    () => {
      const startTime = date?.from
        ? new Date(date.from).setHours(0, 0, 0, 0)
        : undefined
      const endTime = date?.to
        ? new Date(date.to).setHours(23, 59, 59, 999)
        : date?.from // 如果是单天选择，使用 from 作为结束日期
          ? new Date(date.from).setHours(23, 59, 59, 999)
          : undefined

      return getDailiesHistoryAction({
        userId,
        planId: selectedPlan.planId,
        start: (params.pageIndex - 1) * params.pageSize,
        end: params.pageIndex * params.pageSize,
        ...(timestamp ? { timestamp } : {}),
        orderByDate: dateOrder,
        onlyFavorites: isFavorited,
        startDate: startTime?.toString(),
        endDate: endTime?.toString(),
      })
    },
    {
      ready: !!userId,
      refreshDeps: [
        selectedPlan,
        params,
        timestamp,
        dateOrder,
        isFavorited,
        date,
      ],
      onSuccess: (res) => {
        setDailies(res.data.historyRecords)
      },
    },
  )

  // 按日期分组
  const groupedDailies = dailies.reduce(
    (acc, daily) => {
      const date = format(new Date(daily.timestamp), "yyyy-MM-dd")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(daily)
      return acc
    },
    {} as Record<string, typeof dailies>,
  )

  const totalCount = getDailiesQuery?.data.totalCount ?? 0

  const updateParams = (newParams: Partial<typeof params>) => {
    setParams((prev) => ({ ...prev, ...newParams }))
  }

  const loading = loadingDailies || loadingGetUserPlans

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] gap-6">
      <section className="flex w-full flex-col gap-4">
        {noAnySubscribe ||
          match(loadingGetUserPlans)
            .with(true, () => <DailyListFilterSkeleton />)
            .otherwise(() => (
              <DailyListFilter
                isFavorited={isFavorited}
                setIsFavorited={setIsFavorited}
                noAnySubscribe={noAnySubscribe}
                date={date}
                setDate={setDate}
                loadingGetUserPlans={loadingGetUserPlans}
                plans={plans?.data!}
                selectedPlan={selectedPlan}
                setSelectPlan={setSelectPlan}
                dateOrder={dateOrder}
                setDateOrder={setDateOrder}
              />
            ))}

        <div className="flex w-full flex-col gap-10 md:flex-row">
          {match(loading)
            .with(true, () => <DailyGroupSkeleton />)
            .otherwise(() =>
              match(!dailies.length)
                .with(true, () => (
                  <EmptyList type={isFavorited ? "favorites" : "all"} />
                ))
                .otherwise(() => (
                  <ol className="bg-current/90 order-2 flex w-full flex-col gap-8">
                    {Object.entries(groupedDailies).map(
                      ([date, dailyGroup]) => (
                        <li key={date} className="relative">
                          <div className="sticky top-4 mb-4 flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-primary"></div>
                            <time className="text-lg font-medium">{date}</time>
                          </div>
                          <div className="ml-2 border-l-2 border-border pl-8">
                            <ol className="flex flex-col gap-4">
                              {dailyGroup.map((daily, index) => (
                                <li key={daily.id}>
                                  <DailyListItem
                                    daily={daily}
                                    userId={userId}
                                    onFavoriteChangeCallback={(
                                      id,
                                      isFavorited,
                                    ) => {
                                      setDailies((prev) =>
                                        prev.map((daily) =>
                                          daily.id === id
                                            ? { ...daily, isFavorited }
                                            : daily,
                                        ),
                                      )
                                    }}
                                  />
                                </li>
                              ))}
                            </ol>
                          </div>
                        </li>
                      ),
                    )}

                    <Pagination
                      total={totalCount}
                      params={params}
                      updateParams={(newParams) =>
                        updateParams(
                          newParams as Partial<{
                            pageIndex: number
                            pageSize: number
                          }>,
                        )
                      }
                      showQuickJumper
                      showSizeChanger
                    />
                  </ol>
                )),
            )}
        </div>
      </section>

      <DebugDialog isSidebarExist>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Session & User</h3>
            <pre className="mt-2 rounded p-4">
              {JSON.stringify({ session, userId }, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">Filters & Params</h3>
            <pre className="mt-2 rounded p-4">
              {JSON.stringify(
                {
                  date,
                  timestamp,
                  selectedPlan,
                  dateOrder,
                  params,
                  isFavorited,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">Plans Data</h3>
            <pre className="mt-2 rounded p-4">
              {JSON.stringify(
                {
                  plans: plans?.data,
                  noAnySubscribe,
                  loadingGetUserPlans,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">Dailies Data</h3>
            <pre className="mt-2 rounded p-4">
              {JSON.stringify(
                {
                  dailies,
                  groupedDailies,
                  totalCount,
                  loadingDailies,
                  getDailiesQuery: getDailiesQuery?.data,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">URL Params</h3>
            <pre className="mt-2 rounded p-4">
              {JSON.stringify(
                Object.fromEntries(searchParams.entries()),
                null,
                2,
              )}
            </pre>
          </div>
        </div>
      </DebugDialog>
    </div>
  )
}

function EmptyList({ type }: { type: "favorites" | "all" }) {
  return (
    <div className="absolutely-center h-[70vh] w-full flex-col space-y-4">
      <IllustrationNoContent />
      <span className="text-sm">
        您还没有{type === "favorites" ? "收藏任何日报" : "订阅任何meme"}
      </span>
      {type === "all" && (
        <Button variant="secondary" className="text-xs" asChild>
          <Link href="/memes">去订阅 meme</Link>
        </Button>
      )}
    </div>
  )
}

function Calendars({
  calendars,
}: {
  calendars: {
    name: string
    items: string[]
  }[]
}) {
  return (
    <>
      {calendars.map((calendar, index) => (
        <React.Fragment key={calendar.name}>
          <SidebarGroup key={calendar.name} className="py-0">
            <Collapsible
              defaultOpen={index === 0}
              className="group/collapsible"
            >
              <SidebarGroupLabel
                asChild
                className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {calendar.name}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {calendar.items.map((item, index) => (
                      <SidebarMenuItem key={item}>
                        <SidebarMenuButton>
                          <div
                            data-active={index < 2}
                            className="group/calendar-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                          >
                            <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                          </div>
                          {item}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
        </React.Fragment>
      ))}
    </>
  )
}

function DatePicker({
  date,
  setDate,
}: {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}) {
  return (
    <SidebarGroup className="mx-auto">
      <SidebarGroupContent>
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          numberOfMonths={1}
          onSelect={(e) => {
            setDate(e)
          }}
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function RightAppSidebar({
  date,
  setDate,
  userId,
  ...props
}: {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  userId: string
} & React.ComponentProps<typeof SidebarAbsolute>) {
  const {
    run: getPlans,
    data: getPlansQuery,
    loading: loadingPlans,
  } = useRequest(() => getOpenPlansAction({ userId, page: 1, pageSize: 10 }), {
    ready: !!userId,
    onError(error: any) {
      showErrorToast(`获取 meme 失败: ${error.message.statusText}`)
    },
  })

  const emptyPlans = !getPlansQuery?.data.result.length

  return (
    <div
      className="sticky right-0 top-[4rem] hidden h-screen-minus-pt-20 w-80 flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow lg:flex"
      {...props}
    >
      <SidebarContent>
        <DatePicker date={date} setDate={setDate} />

        <SidebarSeparator className="mx-0" />
        {/* <Calendars /> */}
        <div className="h-1/2 px-4">
          <h2 className="leading-10">为您推荐</h2>
          <>
            {loadingPlans ? (
              <PlanCardSkeletonList />
            ) : emptyPlans ? (
              <EmptyPlans />
            ) : (
              <>
                {getPlansQuery.data.result.map((plan) => {
                  return (
                    <PlanCard
                      className="mb-4"
                      key={plan.planId}
                      {...plan}
                      onFavoriteSuccessCallback={(planId, isFavorite) => {
                        getPlans()
                      }}
                    >
                      <SubscribeDialog
                        isSubscribed={plan.isSubscribed}
                        originalChannels={plan.channel?.map((channel) => ({
                          id: channel.id,
                          name: channel.name,
                          address: channel.address,
                        }))}
                        planId={plan.planId}
                        beSubscribedId={plan.beSubscribedId}
                        onSubscribeSuccessCallback={() => getPlans()}
                      />
                    </PlanCard>
                  )
                })}
              </>
            )}
          </>
        </div>
      </SidebarContent>

      <SidebarRail />
    </div>
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

function DailyListItemSkeleton() {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <div className="flex cursor-pointer gap-2 shadow-md md:h-36">
          <div className="flex w-10 grow flex-col justify-between p-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
          <Skeleton className="hidden aspect-video h-full rounded-r-lg md:block" />
        </div>
      </div>
      <div className="flex flex-col justify-end gap-2">
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
      </div>
    </div>
  )
}

function DailyListFilterSkeleton() {
  return (
    <section className="flex flex-col items-start justify-between md:flex-row md:items-center">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="flex justify-end gap-2 p-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </section>
  )
}

function DailyGroupSkeleton() {
  return (
    <ol className="order-2 flex w-full flex-col gap-8">
      {Array(3)
        .fill(null)
        .map((_, groupIndex) => (
          <li key={groupIndex} className="relative">
            <div className="sticky top-4 mb-4 flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="ml-2 border-l-2 border-border pl-8">
              <ol className="flex flex-col gap-4">
                {Array(3)
                  .fill(null)
                  .map((_, itemIndex) => (
                    <li key={itemIndex}>
                      <DailyListItemSkeleton />
                    </li>
                  ))}
              </ol>
            </div>
          </li>
        ))}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    </ol>
  )
}

function PlanCardSkeletonList() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="mb-3 flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="mt-3 flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
    </div>
  )
}
