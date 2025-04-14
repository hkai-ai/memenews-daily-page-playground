import { Loader2, Asterisk, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"

import { Button } from "../../common/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../common/ui/form"
import { Textarea } from "../../common/ui/textarea"

interface AiSuggestionInputProps {
  form: UseFormReturn<any>
  suggestionValue: string
  accountName: string
  loading?: boolean
  onGenerate: (prompt: string) => void
  showAiButton?: boolean
}

export function AiSuggestionInput({
  form,
  suggestionValue,
  accountName,
  loading,
  onGenerate,
  showAiButton = true,
}: AiSuggestionInputProps) {
  const [extraInfo, setExtraInfo] = useState("")

  // 当AI生成新的建议时，更新表单值
  useEffect(() => {
    if (suggestionValue && !loading) {
      form.setValue("introduction", suggestionValue)
    }
  }, [suggestionValue, loading])

  return (
    <FormField
      control={form.control}
      name="introduction"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="flex items-center gap-1 pl-3">
            <Asterisk className="inline size-3 stroke-red-500" />
            介绍
          </FormLabel>
          <FormControl style={{ marginTop: 0 }}>
            <div className="relative p-3 mt-0 pt-0">
              <Textarea
                placeholder="写几句简短的话介绍这个账号是谁，身份职业"
                className="min-h-28 rounded-md text-xs"
                {...field}
                disabled={loading}
                value={loading ? "正在生成AI介绍..." : field.value}
              />

              {showAiButton && (
                <Button
                  size="icon"
                  disabled={loading || !accountName}
                  title="使用AI生成介绍"
                  onClick={(e) => {
                    e.preventDefault()
                    onGenerate(`
                          # 账号名
                          ${accountName}
                          # 平台
                          ${form.watch("platform")}
                          # 额外帮助信息
                          ${extraInfo ? `这是一些能够额外帮助你信息：${extraInfo}` : ""}
                        `)
                  }}
                  variant="ghost"
                  className="absolute bottom-1 right-1 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4 stroke-purple-500" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
