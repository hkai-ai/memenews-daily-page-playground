"use client"

import { useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ChevronDown } from "lucide-react"

import { Icons } from "@/lib/components/common/icon"
import { CheckReferenceLinks } from "@/lib/components/CheckReferenceLinks"
import { RelationArticleViewer } from "@/lib/components/RelationArticleViewer"
import { dailyPageMarkdownConvertComponents } from "@/lib/markdown/converter"
import { DailyPageContentResponse } from "@/lib/types/DailyPageContent"
import { DetailContent } from "@/lib/types/DetailContent"
import { AssociatedContent } from "@/lib/types/AssociatedContent"


interface NewsContentProps {
  dailies: DailyPageContentResponse["data"]["content"]
  hideAssociatedContent?: boolean
}

// 扩展AssociatedContent接口以支持子项
interface AssociatedContentWithChildren extends AssociatedContent {
  children?: AssociatedContentWithChildren[]
}

export interface NewsContentItemProps extends DetailContent {
  className?: string
  index: string
  image?: string
  associatedContent?: AssociatedContent[]
}

/**
 * 预处理 markdown 内容
 * @param markdownContent 原始 markdown 内容
 * @returns 处理后的 markdown 内容
 */
export const preProcessContent = (markdownContent: string) => {
  return markdownContent.replace(
    /(\*\*)([^*]+?)(\*\*)/g,
    (match, p1, p2, p3) => {
      return ` ${p1}${p2}${p3} `
    },
  ).replace(/\\n/g, "\n")
}

export const formatIndex = (index: string): string => {
  const num = parseInt(index) + 1

  return num < 10 ? `0${num}` : `${num}`
}

/**
 * 构建转发链结构
 * @param items 原始关联内容数组
 * @returns 带有层级结构的关联内容数组
 */
const buildRepostChain = (
  items: AssociatedContent[],
): AssociatedContentWithChildren[] => {
  const itemMap = new Map<string, AssociatedContentWithChildren>()
  const rootItems: AssociatedContentWithChildren[] = []

  // 首先转换所有项为带children的格式
  items.forEach((item) => {
    itemMap.set(item.sourceId, { ...item, children: [] })
  })

  // 构建层级关系
  items.forEach((item) => {
    const currentItem = itemMap.get(item.sourceId)!

    // 查找是否有其他项转发了这条内容
    let isChild = false
    const allItems = Array.from(itemMap.values())

    for (const potentialParent of allItems) {
      if (
        potentialParent.sourceId !== item.sourceId &&
        potentialParent.recordText === item.parsedText
      ) {
        potentialParent.children?.push(currentItem)
        isChild = true
        break
      }
    }

    // 如果没有父项，则为根节点
    if (!isChild) {
      rootItems.push(currentItem)
    }
  })

  return rootItems
}

export function NewsContent({
  dailies,
  hideAssociatedContent = false,
}: NewsContentProps) {
  const [showAllMap, setShowAllMap] = useState<Record<string, boolean>>({})
  let normalArticleCount = -1

  const toggleShowAll = (index: string) => {
    setShowAllMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // 递归渲染关联内容
  const renderAssociatedContent = (
    items: AssociatedContentWithChildren[],
    level: number = 0,
  ) => {
    return items.map((item) => (
      <div key={item.sourceId} className={`ml-${level * 3}`}>
        <div className="mb-4">
          <RelationArticleViewer data={item} />
        </div>
        {item.children && item.children.length > 0 && (
          <div className="ml-8 border-l-2 border-zinc-200/70 pl-4 dark:border-zinc-700/70">
            {renderAssociatedContent(item.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <>
      {dailies.map((article, index) => {
        const {
          id,
          summaryId,
          title,
          content,
          referenceLinks = [],
          associatedContent,
          isRelated,
          dictionaryTerms,
          isDailyPush,
        } = article

        if (!isRelated) {
          normalArticleCount++
        }

        const strIndex = String(normalArticleCount)
        const formattedIndex = isRelated ? "related" : formatIndex(strIndex)
        const showAll = showAllMap[strIndex] || false

        // 构建转发链结构
        const repostChain = associatedContent
          ? buildRepostChain(associatedContent)
          : []

        const displayedContent = repostChain
          ? showAll
            ? repostChain
            : repostChain.slice(0, 5)
          : []

        return (
          <div key={index} className="w-full">
            <h2
              id={`section${index}`}
              className="relative mb-4 pt-[60px] font-read-title text-lg font-semibold leading-[25px]"
            >
              {!isDailyPush && (
                <span className="float-left mr-2 text-red-500">
                  {formattedIndex === "related" ? (
                    <Icons.fire className="mt-1 size-4" />
                  ) : (
                    formattedIndex
                  )}
                </span>
              )}
              <span className="block">{title}</span>
            </h2>

            {/* <div className="mb-6 border-l-4 border-gray-300 pl-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
                tenetur autem excepturi accusantium aliquid ea voluptate optio
                quibusdam eveniet aliquam dolore adipisci id, enim quia
                doloribus ipsum est voluptates rem.
              </p>
            </div> */}

            <Markdown
              components={dailyPageMarkdownConvertComponents(dictionaryTerms)}
              remarkPlugins={[remarkGfm]}
              className="bilingual-text"
            >
              {preProcessContent(content ?? "")}
            </Markdown>

            {referenceLinks.length > 0 ? (
              <>
                <CheckReferenceLinks
                  className="mt-8 border-t pt-4"
                  referenceLinks={referenceLinks}
                />
              </>
            ) : (
              <div className="my-4" />
            )}

            {associatedContent && !hideAssociatedContent && (
              <div className="space-y-2">
                <div className="space-y-4">
                  {renderAssociatedContent(displayedContent)}
                </div>
                {repostChain.length > 3 && (
                  <button
                    onClick={() => toggleShowAll(strIndex)}
                    className="mt-2 flex w-full items-center justify-end text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showAll ? "收起" : `显示更多 (${repostChain.length - 5})`}
                    <ChevronDown
                      className={`ml-1 size-4 transition-transform ${showAll ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

