"use client"

import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import React from "react"

import {
  NewsContentItemProps,
  preProcessContent,
} from "../dailyContent/NewsContent"

import { dailyPageMarkdownConvertComponents } from "@/lib/markdown/converter"
import { cn } from "@/lib/utils"

const MOCK_COMMENTS = [
  {
    id: 1,
    content: "这是一条评论",
  },
  {
    id: 2,
    content: "这是另一条评论",
  },
  {
    id: 3,
    content: "这是第三条评论",
  },
]

const MOCK_TAGS = ["标签1", "标签2", "标签3"]

const TAG_COLORS = [
  "bg-red-300",
  "bg-yellow-300",
  "bg-green-300",
  "bg-blue-300",
  "bg-indigo-300",
  "bg-purple-300",
  "bg-pink-300",
]

/**
 * 日报详情页单项, Product Hunt 版本
 */
export function DailyContentItemPH({
  id,
  summaryId,
  title,
  content,
  referenceLinks = [],
  tags,
  index,
  image,
  ...props
}: NewsContentItemProps) {
  /**
   * @description 获取随机颜色
   */
  const getRandomColor = (availableColors: string[]) => {
    const randomIndex = Math.floor(Math.random() * availableColors.length)
    const color = availableColors[randomIndex]
    availableColors.splice(randomIndex, 1)
    return color
  }

  // 保证颜色不会重复
  const availableColors = [...TAG_COLORS]

  return (
    <main
      {...props}
      className={cn(
        "my-4 flex w-full flex-col md:w-5/6 2xl:w-8/12",
        props.className,
      )}
    >
      <div className="space-y-4 leading-relaxed">
        <div>
          <a
            href={referenceLinks[0] || "#"}
            id={`section${index}`}
            target="_blank"
            rel="noopener noreferrer"
            className="leading-1 group text-2xl font-bold"
          >
            <span className="text-sky-400">{Number(index) + 1} </span>
            <h1 className="relative ml-1 inline">
              <span className="relative z-10">{title}</span>
              <span className="absolute bottom-0 left-0 right-0 hidden h-0.5 origin-left scale-x-0 transform bg-current transition-transform duration-300 group-hover:scale-x-100 md:block" />
            </h1>
            {/* <MoveUpRight className="ml-1.5 inline size-4 -translate-y-1.5" /> */}
          </a>

          {!!referenceLinks.length && (
            <>
              {referenceLinks.length === 1 ? (
                <a
                  className="ml-2 inline -translate-y-0.5 cursor-pointer border-b border-b-sky-600 text-sm font-normal hover:border-b-sky-400"
                  href={referenceLinks[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  来源
                </a>
              ) : (
                <details className="relative ml-2 inline -translate-y-0.5 cursor-pointer border-b border-b-sky-600 text-sm font-normal hover:border-b-sky-400">
                  <summary className="inline">来源</summary>
                  <div className="absolute text-xs font-thin">
                    <a
                      href={referenceLinks[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      View on Product Hunt
                    </a>
                  </div>
                </details>
              )}
            </>
          )}
        </div>

        <Markdown
          className="ml-5"
          components={dailyPageMarkdownConvertComponents()}
          remarkPlugins={[remarkGfm]}
        >
          {preProcessContent(content ?? "")}
        </Markdown>

        <div className="border-l-2 indent-5 text-sm font-thin">
          {MOCK_COMMENTS.map((comment) => (
            <div key={comment.id} className="">
              {comment.content}
            </div>
          ))}
        </div>

        <div className="space-x-2 text-xs">
          {MOCK_TAGS.map((tag, index) => (
            <span
              key={index}
              className={`rounded-full px-2 py-1 ${getRandomColor(availableColors)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <img
          src="/placeholder.svg"
          alt={`${title}'s image`}
          className="h-80 w-full object-cover"
        />
      </div>
    </main>
  )
}
