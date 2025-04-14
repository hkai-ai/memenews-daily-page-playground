"use client"

import React from "react"

import { cn } from "@/lib/utils"

type HighlightTextProps = {
  className?: string
  highlightMarkClassName?: string
  sourceString: string
  searchWords?: string[]
  caseSensitive?: boolean
  onClick?: () => void
}

type HighlightMarkProps = {
  text: string
  className?: string
}

export const HighlightMark = ({ text, className }: HighlightMarkProps) => {
  return (
    <span
      className={cn(
        "mx-1 scale-110 bg-green-300/20 font-bold dark:bg-green-100/60",
        className,
      )}
    >
      {text}
    </span>
  )
}

/**
 * 高亮文本组件, 用于在文本中高亮显示指定的关键词
 *
 * @param sourceString 源字符串
 * @param searchWords 需要高亮的关键词数组
 * @param className 组件类名
 * @param highlightMarkClassName 高亮标记类名
 * @param caseSensitive 是否区分大小写
 * @returns 返回高亮后的文本
 */
export const HighlightText = ({
  className,
  sourceString,
  searchWords,
  highlightMarkClassName,
  caseSensitive = true,
  onClick,
}: HighlightTextProps) => {
  if (!searchWords?.length) {
    return sourceString
  }

  if (!sourceString?.trim()) {
    return ""
  }

  // Chat GPT: 将正则表达式改为(${searchWords.join('|')})，这样可以将searchWords作为捕获组，从而在拆分后的数组中保留匹配到的searchWords
  const regex = new RegExp(
    `(${searchWords.join("|")})`,
    // gi 全局匹配且不区分大小写
    caseSensitive ? "gi" : "g",
  )

  // 使用正则表达式将sourceString根据searchWords拆分成数组
  const splitArray = sourceString.split(regex)

  return (
    <div onClick={onClick} className={cn("", className)}>
      {splitArray.map((el, idx) => {
        if (
          searchWords.find((curr) => curr.toLowerCase() === el.toLowerCase())
        ) {
          return (
            <HighlightMark
              key={el + idx}
              text={el}
              className={highlightMarkClassName}
            />
          )
        } else {
          return el
        }
      })}
    </div>
  )
}
