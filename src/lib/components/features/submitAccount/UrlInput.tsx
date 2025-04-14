import { Asterisk, ChevronDown } from "lucide-react"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"

import { Input } from "../../common/ui/input"

import { cn } from "@/lib/utils"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/common/ui/form"
import { ValidationSourceRes } from "@/types/plan"

interface UrlInputProps {
  form: UseFormReturn<any>
  required?: boolean
  className?: string
  loadingValidateUrl: boolean
  validaeResults: ValidationSourceRes
}

export function UrlInput({ form, className, required, loadingValidateUrl, validaeResults }: UrlInputProps) {
  const [protocol, setProtocol] = useState("https://")

  const formMessageStr = (loadingValidateUrl: boolean, validaeResults: ValidationSourceRes) => {
    if (!loadingValidateUrl && validaeResults === undefined) {
      return <p className="text-xs text-muted-foreground">😺可以复制黏贴RSS链接哦</p>
    }
    if (loadingValidateUrl) {
      return <p className="text-xs text-muted-foreground">🤔正在验证，请稍候...</p>
    }
    return <p className="text-xs text-muted-foreground">😭验证失败，请您检查它是否是有效的 RSS 链接地址；<br />如果确认无误，那么可能是我们暂不支持该规范的 RSS 解析。</p>
  }

  return (
    <FormField
      control={form.control}
      name="url"
      render={({ field }) => (
        <>
          {form.watch("platform") !== "wechat" && (
            <FormItem className={cn("flex flex-col items-start gap-2", className)}>
              <FormLabel className="flex items-center gap-1">
                {required && (
                  <Asterisk className="inline size-3 stroke-red-500" />
                )}
                链接
                <span className="text-xs text-muted-foreground/60">
                  {!required && "（非必填）"}
                </span>
              </FormLabel>

              <FormControl className="w-full">
                <div
                  className={cn(
                    "flex w-full rounded-lg text-sm shadow-sm shadow-black/5",
                    className,
                  )}
                >
                  <div className="relative">
                    <select
                      className="peer inline-flex h-full appearance-none items-center rounded-none rounded-s-lg border border-input bg-background pe-8 ps-3 text-xs text-muted-foreground ring-offset-background transition-shadow hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:text-xs focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Protocol"
                      value={protocol}
                      onChange={(e) => {
                        setProtocol(e.target.value)
                        const domain =
                          field.value?.replace(/^[^:]+:\/\//, "") || ""
                        field.onChange(e.target.value + domain)
                      }}
                    >
                      <option value="https://">https://</option>
                      <option value="http://">http://</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 end-0 z-10 flex h-full w-9 items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50">
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                        role="img"
                      />
                    </span>
                  </div>
                  <Input
                    className="-ms-px rounded-s-none text-xs shadow-none focus-visible:z-10 flex-grow"
                    placeholder="example.com"
                    value={field.value?.replace(/^[^:]+:\/\//, "") || ""}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      const protocolMatch = inputValue.match(/^([^:]+):\/\//)
                      if (protocolMatch) {
                        const newProtocol = protocolMatch[0]
                        setProtocol(newProtocol)
                        const domainPart = inputValue.replace(/^[^:]+:\/\//, "")
                        field.onChange(newProtocol + domainPart)
                      } else {
                        field.onChange(protocol + inputValue)
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage className="mt-0" style={{ marginTop: 0 }}>
                {formMessageStr(loadingValidateUrl, validaeResults)}
              </FormMessage>
            </FormItem>
          )}
        </>
      )
      }
    />
  )
}