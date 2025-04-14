import { Search, Trash, Asterisk } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { useState, useRef, useEffect } from "react"

import { SearchList } from "./SearchList"

import { cn } from "@/lib/utils"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/common/ui/form"
import { Input } from "@/lib/components/common/ui/input"

interface NameInputFieldProps {
  form: UseFormReturn<any>
  validateResult: any
  loadingValidateSource: boolean
  runAiSuggestion: (name: string) => void
  className?: string
}

/**
 * 用于名称查询的输入框
 * @param param0 
 * @returns 
 */
export function NameInputField({
  form,
  validateResult,
  loadingValidateSource,
  runAiSuggestion,
  className,
}: NameInputFieldProps) {
  const [focusNameInput, setFocusNameInput] = useState(false)
  const nameInputRef = useRef<HTMLDivElement>(null)
  const selectedPlatform = form.watch("platform")

  const getSearchListPlaceholder = () => {
    if (validateResult === undefined) {
      return selectedPlatform === "wechat" ? "😺请输入公众号名称" : "😺请输入搜索的用户名"
    }

    if (
      Array.isArray(validateResult.data.matchedSources) &&
      validateResult.data.matchedSources.length === 0
    ) {
      return selectedPlatform === "wechat" ? "😭未找到该公众号，如果您确认公众号名称无误，说明它不在我们的支持范围内。" : "😭未找到该用户，如果您确认用户名无误，说明它不在我们的支持范围内。"
    }

    return "请输入用户名"
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        nameInputRef.current &&
        !nameInputRef.current.contains(event.target as Node) &&
        focusNameInput
      ) {
        setFocusNameInput(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [focusNameInput])

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className={cn("flex flex-col items-start gap-2", className)}>
          <FormLabel className="flex items-center gap-1">
            <Asterisk className="inline size-3 stroke-red-500" />
            名称
          </FormLabel>
          <FormControl className="w-full">
            <div className="relative w-full" ref={nameInputRef}>
              <div className="relative w-full">
                <div className="relative">
                  <Input
                    {...field}
                    onFocus={() => {
                      setFocusNameInput(true)
                    }}
                    className={`peer pe-9 ps-9 text-xs w-full ${validateResult?.data?.isValid ? 'border-green-500' : ''}`}
                    disabled={!form.watch("platform")}
                    placeholder={
                      selectedPlatform === "wechat"
                        ? "请输入公众号名称"
                        : "请输入用户名"
                    }
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Search size={16} strokeWidth={2} />
                  </div>
                  <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="清空"
                    disabled={!form.watch("name")}
                    onClick={(e) => {
                      e.preventDefault()
                      setFocusNameInput(false)
                      field.onChange("")
                    }}
                  >
                    <Trash size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              </div>
              {focusNameInput && (
                <SearchList
                  placeholder={getSearchListPlaceholder()}
                  form={form}
                  loading={loadingValidateSource}
                  validateResult={validateResult!}
                  onItemClick={(item) => {
                    // runAiSuggestion(item.name)
                    form.setValue("name", item.name)
                    form.setValue("id", item.identifyId)
                    // if (selectedPlatform === "twitter") {
                    //   form.setValue("url", `https://x.com/${item.identifyId}`)
                    // }
                    setFocusNameInput(false)
                  }}
                  onClose={() => setFocusNameInput(false)}
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}