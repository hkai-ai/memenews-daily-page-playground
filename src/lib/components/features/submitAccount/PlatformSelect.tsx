import { UseFormReturn } from "react-hook-form"
import { Asterisk } from "lucide-react"

import { Icons } from "../../common/icon"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../common/ui/form"
import { RadioGroup, RadioGroupItem } from "../../common/ui/radio-group"

export const platforms = [
  {
    id: "platform-wechat",
    value: "wechat",
    label: "公众号",
    Icon: Icons.wechat,
    iconColor: "text-green-500",
  },
  {
    id: "platform-twitter",
    value: "twitter",
    label: "Twitter",
    Icon: Icons.twitter,
    iconColor: "text-gray-900",
  },
  {
    id: "platform-weibo",
    value: "weibo",
    label: "微博",
    Icon: Icons.weibo,
    iconColor: "text-red-500",
  },
  {
    id: "platform-rss",
    value: "rss",
    label: "RSS",
    Icon: Icons.rss,
    iconColor: "text-orange-500",
  },
] as const

interface PlatformSelectorProps {
  form: UseFormReturn<any>
}

export function PlatformSelector({ form }: PlatformSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="platform"
      render={({ field }) => (
        <FormItem className="text-xs my-2">
          <FormLabel>
            <Asterisk className="inline size-3 stroke-red-500" />
            选择平台
          </FormLabel>
          <FormControl>
            <RadioGroup
              className="mx-auto grid-cols-4"
              value={field.value}
              onValueChange={field.onChange}
            >
              {platforms.map(({ id, value, label, Icon, iconColor }) => (
                <label
                  key={id}
                  className="relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-input px-2 py-3 text-center shadow-sm shadow-black/5 ring-offset-background transition-colors has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/70 has-[:focus-visible]:ring-offset-2"
                >
                  <RadioGroupItem
                    id={id}
                    value={value}
                    className="sr-only after:absolute after:inset-0"
                  />
                  <Icon className={`size-5 ${iconColor}`} aria-hidden="true" />
                  <p className="text-xs font-medium leading-none text-foreground">
                    {label}
                  </p>
                </label>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
