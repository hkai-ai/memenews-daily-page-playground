"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"

interface ScrollContainerProps {
  children: ReactNode
  className?: string
}

/**
 * 滚动容器组件
 * @description 用于在容器内实现滚动效果，并添加渐变背景
 * @param children 子组件
 * @param className 容器类名
 */
export function ScrollContainer({ children, className }: ScrollContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isEndReached, setIsEndReached] = useState(false)
  const [isStartReached, setIsStartReached] = useState(true)

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current
      if (container) {
        // 计算是否滚动到末端（考虑误差值1px）
        const isAtEnd =
          Math.abs(
            container.scrollWidth -
              container.clientWidth -
              container.scrollLeft,
          ) < 1
        setIsEndReached(isAtEnd)

        // 检查是否在起始位置
        const isAtStart = container.scrollLeft === 0
        setIsStartReached(isAtStart)
      }
    }

    // 处理滚轮事件的函数
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current) {
        e.preventDefault()
        const container = scrollContainerRef.current

        // 如果有水平滚动（触控板），优先使用水平滚动
        if (Math.abs(e.deltaX) > 0) {
          container.scrollLeft += e.deltaX
        } else {
          // 处理垂直滚动（鼠标滚轮）
          const scrollAmount =
            e.deltaMode === 1
              ? e.deltaY * 20 // 行模式（鼠标滚轮）
              : e.deltaY // 像素模式（触控板）

          container.scrollLeft += scrollAmount
        }

        checkScroll()
      }
    }

    // 获取当前容器的引用
    const currentRef = scrollContainerRef.current
    if (currentRef) {
      // 添加事件监听器
      // passive: false 允许我们调用 preventDefault()
      currentRef.addEventListener("wheel", handleWheel, { passive: false })
      currentRef.addEventListener("scroll", checkScroll)
      // 初始化检查滚动状态
      checkScroll()
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleWheel)
        currentRef.removeEventListener("scroll", checkScroll)
      }
    }
  }, [])

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className={`hide-scrollbar overflow-x-auto ${className}`}
      >
        {children}
      </div>
      <div
        className={`pointer-events-none absolute left-0 top-0 z-40 h-full w-12 bg-gradient-to-r from-background to-transparent transition-opacity duration-200 ${
          isStartReached ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`pointer-events-none absolute right-0 top-0 z-40 h-full w-12 bg-gradient-to-l from-background to-transparent transition-opacity duration-200 ${
          isEndReached ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  )
}
