import { UseFormReturn } from "react-hook-form"
import { Asterisk } from "lucide-react"

import { Label } from "../../common/ui/label"
import {
  FormItem,
  FormControl,
  FormField,
  FormLabel,
} from "../../common/ui/form"
import { Switch } from "../../common/ui/switch"

import { cn } from "@/lib/utils"

interface PublicSwitchProps {
  form: UseFormReturn<any>
}

export function PublicSwitch({ form }: PublicSwitchProps) {
  return (
    <FormField
      control={form.control}
      name="public"
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex w-full flex-col gap-2",
            field.disabled &&
            "pointer-events-none cursor-not-allowed opacity-40",
          )}
        >
          <FormLabel className="flex w-24 shrink-0 items-center justify-end gap-1">
          </FormLabel>

          <FormControl className="flex-1">
            <div className="relative flex w-full items-start gap-2 rounded-lg  p-4 pt-0 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
              <Switch
                id="public"
                checked={field.value}
                disabled={field.disabled}
                onCheckedChange={field.onChange}
                className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 [&_span]:data-[state=checked]:translate-x-2 rtl:[&_span]:data-[state=checked]:-translate-x-2"
                aria-describedby="switch-15-description"
              />
              <div className="grid grow gap-2">
                <Label htmlFor="checkbox-13">是否公开信息源</Label>
                <p
                  id="checkbox-13-description"
                  className="text-xs text-muted-foreground"
                >
                  选择公开信息源后，您的信息源会进入到我们的审核队列，审核通过后所有人都能看到该信息源。
                </p>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
