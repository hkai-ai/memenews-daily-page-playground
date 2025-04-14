"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import { zhCN } from "date-fns/locale"
import { type DateRange } from "react-day-picker"

import { Button } from "@/lib/components/common/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/common/ui/popover"
import { Calendar } from "@/lib/components/common/ui/calendar"
import { cn } from "@/lib/utils"

interface DailyListDateFilterProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}

export function DailyListDateFilter({
  date,
  setDate,
}: DailyListDateFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("size-8", date && "bg-accent text-accent-foreground")}
        >
          <CalendarIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={1}
          locale={zhCN}
        />
      </PopoverContent>
    </Popover>
  )
}
