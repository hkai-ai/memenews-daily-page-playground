"use client"

import { Asterisk, CircleHelp } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { useEffect, useRef, useState } from "react"

import { SearchList } from "./SearchList"
import { helpTipContent } from "./HelpTipContent"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/common/ui/form"
import { Input } from "@/lib/components/common/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/common/ui/tooltip"
import { cn } from "@/lib/utils"

interface UidInputProps {
  form: UseFormReturn<any>
  className?: string
  loadingValidateUid: boolean
  validateResult: any
}

export function UidInput({
  form,
  loadingValidateUid,
  validateResult,
  className,
}: UidInputProps) {
  const [focusUidInput, setFocusUidInput] = useState(false)
  const uidInputRef = useRef<HTMLDivElement>(null)
  const selectedPlatform = form.watch("platform")

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        uidInputRef.current &&
        !uidInputRef.current.contains(event.target as Node) &&
        focusUidInput
      ) {
        setFocusUidInput(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [focusUidInput])

  return (
    <FormField
      control={form.control}
      name="id"
      render={({ field }) => (
        <>
          <FormItem
            className={cn(
              "flex w-full flex-col items-start gap-2 rounded-md",
              className,
            )}
          >
            <FormLabel className="flex items-center gap-1">
              <Asterisk className="inline size-3 stroke-red-500" />
              UID
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                    <CircleHelp className="inline size-4" />
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {
                      helpTipContent[
                      selectedPlatform as keyof typeof helpTipContent
                      ]
                    }
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>

            <FormControl className="w-full">
              <div className="relative w-full" ref={uidInputRef}>
                <Input
                  className="text-xs w-full"
                  {...field}
                  onFocus={() => {
                    setFocusUidInput(true)
                  }}
                  placeholder="请输入用户UID进行验证"
                />

                {focusUidInput && (
                  <SearchList
                    placeholder="请输入用户UID进行验证"
                    form={form}
                    loading={loadingValidateUid}
                    validateResult={validateResult}
                    onItemClick={(item) => {
                      setFocusUidInput(false)
                      form.setValue("name", item.name)
                      form.setValue("id", item.identifyId)
                      switch (form.watch("platform")) {
                        case "twitter":
                          form.setValue(
                            "url",
                            `https://x.com/${item.identifyId}`,
                          )
                          return
                        case "weibo":
                          form.setValue(
                            "url",
                            `https://weibo.com/${item.identifyId}`,
                          )
                          return
                        default:
                          return
                      }
                    }}
                    onClose={() => setFocusUidInput(false)}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  )
}