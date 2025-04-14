"use client"

import { ArrowUpDown, Bookmark } from "lucide-react"
import { match } from "ts-pattern"
import { type DateRange } from "react-day-picker"

import { Button } from "../../common/ui/button"

import { DailyListDateFilter } from "./DailyListDateFilter"

import { Tabs, TabsList, TabsTrigger } from "@/lib/components/common/ui/tabs"
import { PlanBasis } from "@/types/plan"
import { Skeleton } from "@/lib/components/common/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/common/ui/select"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface DailyListFilterProps {
  className?: string
  noAnySubscribe: boolean
  isFavorited: boolean
  setIsFavorited: React.Dispatch<React.SetStateAction<boolean>>
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  loadingGetUserPlans: boolean
  plans: Partial<PlanBasis>[]
  selectedPlan: Partial<PlanBasis>
  setSelectPlan: React.Dispatch<React.SetStateAction<Partial<PlanBasis>>>
  dateOrder: "desc" | "asc"
  setDateOrder: (value: "desc" | "asc") => void
}

export function DailyListFilter({
  className,
  isFavorited,
  setIsFavorited,
  noAnySubscribe,
  date,
  setDate,
  loadingGetUserPlans,
  plans,
  selectedPlan,
  setSelectPlan,
  dateOrder = "desc",
  setDateOrder,
}: DailyListFilterProps) {
  const isMobile = useIsMobile()

  return (
    <section
      className={cn(
        "flex flex-col items-start justify-between md:flex-row md:items-center",
        className,
      )}
    >
      <menu className="hide-scrollbar overflow-x-scroll">
        {match(loadingGetUserPlans)
          .with(true, () => (
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-8 w-12 rounded-sm" />
              <Skeleton className="h-8 w-16 rounded-sm" />
              <Skeleton className="h-8 w-16 rounded-sm" />
            </div>
          ))
          .otherwise(() => (
            <Tabs
              defaultValue={selectedPlan.planId || "all"}
              value={selectedPlan.planId || "all"}
            >
              <TabsList className="h-9">
                <TabsTrigger
                  value="all"
                  className="text-xs"
                  onClick={() => {
                    setSelectPlan({})
                  }}
                >
                  全部
                </TabsTrigger>
                {plans?.map((plan) => (
                  <TabsTrigger
                    key={plan.planId}
                    value={plan.planId!}
                    className="text-xs"
                    onClick={() => {
                      setSelectPlan({
                        planName: plan.planName,
                        planId: plan.planId,
                      })
                    }}
                  >
                    {plan.planName}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ))}
      </menu>

      <div className="flex justify-end gap-2 p-2">
        <DailyListDateFilter date={date} setDate={setDate} />

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Bookmark
            className={cn(
              "size-4",
              isFavorited && "fill-orange-500 stroke-orange-500",
            )}
          />
        </Button>

        <div className="flex flex-col gap-2">
          <label htmlFor="sortOrder" className="hidden">
            排序方式
          </label>
          <Select value={dateOrder} onValueChange={setDateOrder}>
            <SelectTrigger
              hideIcon
              className="size-8 flex-1 justify-center p-0"
            >
              <ArrowUpDown className="size-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc" className="text-xs">
                从新到旧
              </SelectItem>
              <SelectItem value="asc" className="text-xs">
                从旧到新
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}
