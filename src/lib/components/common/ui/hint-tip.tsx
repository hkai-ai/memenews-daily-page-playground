import * as React from "react"
import type { ComponentPropsWithoutRef } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

import { cn } from "@/lib/utils"

export interface HintProps
  extends ComponentPropsWithoutRef<typeof TooltipContent> {
  disabled?: boolean
  label: string | React.ReactNode
  children: React.ReactNode
  delayDuration?: number
}

/**
 * 提示框组件的简化封装版本
 *
 * @param disabled 是否禁用提示框
 * @param label 提示框内容
 * @param children 提示框触发器
 * @param delayDuration 提示框延迟时间
 * @param props 提示框其他属性
 * @returns 提示框组件
 */
export function HintTip({
  disabled = false,
  label,
  children,
  delayDuration = 20,
  ...props
}: HintProps) {
  if (disabled) {
    return children
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger className="cursor-pointer" asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          {...props}
          className={cn("px-2 py-1 text-xs", props.className)}
        >
          {typeof label === "string" ? (
            <p className={cn(props.className)}>{label}</p>
          ) : (
            label
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
