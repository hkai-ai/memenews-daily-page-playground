import {
  Brain,
  Coins,
  Gamepad2,
  Clapperboard,
  Asterisk,
  CircleHelp,
  MessageCircleQuestion,
} from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Label } from "../../common/ui/label"
import { Checkbox } from "../../common/ui/checkbox"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../common/ui/form"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/common/ui/tooltip"
import { DOMAINS } from "@/app/(dashboard)/memes/create/_components/CreatePlanFlow/constants"

interface DomainSelectProps {
  form: UseFormReturn<any>
}

export function DomainSelect({ form }: DomainSelectProps) {
  return (
    <FormField
      control={form.control}
      name="domain"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="flex items-center gap-1">
            <Asterisk className="inline size-3 stroke-red-500" />
            所属领域
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                  <CircleHelp className="inline size-4" />
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  <div>
                    <p>
                      所属领域指的是该信息源平常发布的信息主要分布在哪个领域。
                    </p>
                    <p>如果信息源存在交叉情况，可以多选。</p>
                    <p>如果您不清楚选择哪个领域，选择【其他】即可。</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl className="mt-0 pt-0">
            <div className="grid grid-cols-4 gap-4">
              {DOMAINS.map((item) => (
                <Label
                  key={item.id}
                  className="relative flex cursor-pointer flex-col gap-4 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring"
                >
                  <div className="flex justify-between gap-2">
                    <Checkbox
                      id={item.id}
                      value={item.value}
                      className="order-1 after:absolute after:inset-0"
                      checked={field.value.includes(item.value)}
                      disabled={field.disabled}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, item.value]
                          : field.value.filter((v: string) => v !== item.value)
                        field.onChange(newValue)
                      }}
                    />

                    <item.Icon
                      className="opacity-60"
                      size={24}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                  <Label
                    htmlFor={item.id}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    {item.label}
                  </Label>
                </Label>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
