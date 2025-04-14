"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-slot="textarea"
        className={cn(
          // UI bug：当使用shadcn/ui时，如果Textarea组件在Dialog中，并设置rounded，当内容溢出时会造成内容有一层模糊滤镜
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive min-h-19.5 shadow-xs flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
