import {
  Mic,
  Building2,
  BadgeCheck,
  UserRound,
  CircleHelp,
  Asterisk,
} from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Label } from "../../common/ui/label"
import { RadioGroup, RadioGroupItem } from "../../common/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../common/ui/tooltip"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../common/ui/form"

const accountTypes = [
  {
    value: "媒体",
    id: "radio-media",
    label: "媒体",
    tip: "由媒体机构运营的账户。这类账号的特点在于更新频率高、发布的内容多为追逐新闻热点。例如量子位、新智元。",
    Icon: Mic,
  },
  {
    value: "机构",
    id: "radio-organization",
    label: "机构",
    tip: "指由公司、研究所等运营的账号。例如 微软亚洲研究院、阿里巴巴 的账号都应该归属于机构。",
    Icon: Building2,
  },
  {
    value: "权威",
    id: "radio-authority",
    label: "权威",
    tip: `如果该账号对应主体在该领域内具备权威性，那么将账号归属到"权威"下。例如，吴恩达在AI领域中属于权威，即使他的账号可以被归类为个人，但是应当把吴恩达的账号归类到权威下。`,
    Icon: BadgeCheck,
  },
  {
    value: "个人",
    id: "radio-personal",
    label: "个人",
    tip: "由主体为个人运营的账户",
    Icon: UserRound,
  },
] as const

interface AccountTypeSelectProps {
  form: UseFormReturn<any>
}

export function AccountTypeSelect({ form }: AccountTypeSelectProps) {
  return (
    <FormField
      control={form.control}
      name="account_type"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="flex items-center gap-1 pl-3">
            <Asterisk className="inline size-3 stroke-red-500" />
            账号类型
          </FormLabel>
          <FormControl className="p-3 mt-0 pt-0">
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              disabled={field.disabled}
              className="grid-cols-4"
              defaultValue="r1"
            >
              {accountTypes.map((item, index) => (
                <Label key={item.id}>
                  <div className="relative flex flex-col gap-4 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
                    <div className="flex justify-between gap-2">
                      <RadioGroupItem
                        id={item.id}
                        value={item.value}
                        className="order-1 cursor-pointer"
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
                      <HintTip>{item.tip}</HintTip>
                    </Label>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function HintTip({
  children,
  side = "top",
}: {
  children: React.ReactNode
  side?: "top" | "right" | "left"
}) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger onClick={(e) => e.preventDefault()}>
          <CircleHelp className="inline size-4 opacity-30" />
        </TooltipTrigger>
        <TooltipContent side={side} sideOffset={5} className="absolute w-40">
          <p className="max-w-60 text-xs">{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
