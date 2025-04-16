"use client"

import { useEffect, useState, useRef } from "react"
import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

import { Icons } from "../../common/icon"

import { formatIndex } from "./NewsContent"

import { cn } from "@/lib/utils"
import { getDailyDetailByIdAction } from "@/lib/api/daily"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/common/ui/tooltip"

interface DailyDesktopCatalogProps {
  catalogs: {
    title: string
    isRelated: boolean
    id: number
  }[]
  contents: Awaited<
    ReturnType<typeof getDailyDetailByIdAction>
  >["data"]["content"]
  getDailyDetailQuery: Awaited<ReturnType<typeof getDailyDetailByIdAction>>
}

/**
 * 在用户点进一个日报页后，在右侧出现的目录导航
 * 仅在 lg 及以上屏幕显示
 */
export function DailyDesktopCatalog({
  // catalogs,
  contents,
  getDailyDetailQuery,
}: DailyDesktopCatalogProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const catalogContainerRef = useRef<HTMLUListElement>(null)

  // 页面初始时，依然显示所有目录，只有滚动后，才只显示5个
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(true)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 当活动目录项发生变化时，保证其在目录视图中可见
  useEffect(() => {
    const catalogContainer = catalogContainerRef.current
    const activeItem = document.getElementById(`nav-catalog-${activeIndex}`)

    if (catalogContainer && activeItem) {
      // 获取容器和目录项的位置信息
      const containerRect = catalogContainer.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()

      // 检查目录项是否在容器可视区域内
      const isItemInView =
        itemRect.top >= containerRect.top &&
        itemRect.bottom <= containerRect.bottom

      // 如果不在可视区域内，将其滚动到视图内
      if (!isItemInView) {
        // 滚动到当前活动项
        activeItem.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [activeIndex])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleIndexes = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => parseInt(entry.target.id.replace("section", "")))
          .sort((a, b) => a - b)

        setVisibleSections(visibleIndexes)

        if (visibleIndexes.length > 0) {
          let closestIndex = visibleIndexes[0]
          let minDistance = Infinity

          visibleIndexes.forEach((index) => {
            const element = document.getElementById(`section${index}`)
            if (element) {
              const distance = Math.abs(element.getBoundingClientRect().top)
              if (distance < minDistance) {
                minDistance = distance
                closestIndex = index
              }
            }
          })

          setActiveIndex(closestIndex)
        }
      },
      {
        rootMargin: "-10% 0px -80% 0px",
      },
    )

    getDailyDetailQuery.data.content.forEach((_, index) => {
      const element = document.getElementById(`section${index}`)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [getDailyDetailQuery.data.content])

  const shouldShowTitle = (index: number) => {
    if (!hasScrolled) return 1
    const totalItems = getDailyDetailQuery.data.content.length

    if (isHovering) {
      const centerIndex = Math.floor(totalItems / 2)
      const distance = Math.abs(index - centerIndex)
      const maxDistance = Math.max(centerIndex, totalItems - centerIndex)
      // 使用非线性函数使动画效果更平滑
      return 1 - (Math.pow(distance, 1.5) / Math.pow(maxDistance, 1.5)) * 0.5
    }

    // 非hover时的逻辑 - 确保始终显示9个目录项，但有渐变效果
    if (visibleSections.length === 0) {
      // 使用activeIndex作为中心，显示前后总共9个项目
      const startIndex = Math.max(0, activeIndex - 4)
      const endIndex = Math.min(totalItems - 1, startIndex + 8)

      // 如果endIndex达到了上限，需要向前调整startIndex
      const adjustedStartIndex = Math.max(0, endIndex - 8)

      // 超出显示范围则隐藏
      if (index < adjustedStartIndex || index > endIndex) return 0

      // 以活跃项为中心的渐变效果
      const distance = Math.abs(index - activeIndex)
      return 1 - Math.min(0.7, distance * 0.15) // 较缓和的渐变，最多减少70%透明度
    }

    const firstVisible = Math.min(...visibleSections)
    const lastVisible = Math.max(...visibleSections)

    // 计算中心位置，确保显示9个项目
    const centerIndex = Math.floor((firstVisible + lastVisible) / 2)
    const startIndex = Math.max(0, centerIndex - 4)
    const endIndex = Math.min(totalItems - 1, startIndex + 8)

    // 如果endIndex达到了上限，需要向前调整startIndex
    const adjustedStartIndex = Math.max(0, endIndex - 8)

    // 超出显示范围则隐藏
    if (index < adjustedStartIndex || index > endIndex) return 0

    // 以中心位置为基准应用渐变效果
    const distance = Math.abs(index - centerIndex)
    return 1 - Math.min(0.7, distance * 0.15) // 较缓和的渐变，最多减少70%透明度
  }

  const handleClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    const section = document.getElementById(`section${index}`)
    if (section) {
      const offset = 40
      const elementPosition = section.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <motion.ul
      ref={catalogContainerRef}
      className="max-h-[28rem] w-80 space-y-2 overflow-auto pl-7 text-xs text-primary/50 transition-all duration-500 ease-in xl:w-96 xl:text-sm [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/50 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      layout
    >
      {getDailyDetailQuery.data.content.map((catalog, index) => {
        let normalArticleCount = -1
        getDailyDetailQuery.data.content.slice(0, index + 1).forEach((item) => {
          if (!item.isRelated) {
            normalArticleCount++
          }
        })

        const strIndex = String(normalArticleCount)
        const formattedIndex = catalog.isRelated
          ? "related"
          : formatIndex(strIndex)

        return (
          <motion.li
            key={index}
            className={cn(
              "relative flex items-center hover:text-primary",
              index === activeIndex && "font-medium text-primary",
            )}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              id={`nav-catalog-span-${index}`}
              className={cn(
                "absolute -left-7 h-1 w-3 rounded-lg transition-colors duration-500",
                index === activeIndex ? "bg-primary" : "bg-[#E5E5E5]",
              )}
            />
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <motion.a
                    id={`nav-catalog-${index}`}
                    href={`#section${String(index)}`}
                    className={cn(
                      "line-clamp-1 w-full space-x-2 font-read-title text-xs font-semibold transition-colors duration-300 ease-in-out hover:text-primary",
                    )}
                    onClick={(e) => handleClick(e, index)}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: shouldShowTitle(index),
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    {!catalog.isDailyPush && (
                      <motion.span layout className="font-optima">
                        {formattedIndex === "related" ? (
                          <Icons.fire className="inline-block size-3" />
                        ) : (
                          formattedIndex
                        )}
                      </motion.span>
                    )}

                    <motion.span layout>{catalog.title}</motion.span>
                    {!!Number(contents[index]?.associatedContent?.length) &&
                      Number(contents[index]?.associatedContent?.length) >
                        0 && (
                        <motion.span
                          className="ml-2 inline-flex items-center gap-0.5 text-xs text-gray-500"
                          layout
                        >
                          <MessageCircle className="size-2.5" />
                          {Number(contents[index]?.associatedContent?.length)}
                        </motion.span>
                      )}
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-w-[300px] break-words xl:hidden"
                >
                  {catalog.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
