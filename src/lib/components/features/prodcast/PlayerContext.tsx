"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

// 定义播放器显示模式的类型
export type PlayerDisplayMode = "hidden" | "mini" | "floating" | "collapsed"

// 存储键名常量
const STORAGE_KEY = "memenews-player-display-mode"

// 播放器上下文类型定义
interface PlayerContextType {
  displayMode: PlayerDisplayMode
  showMiniPlayer: () => void
  showFloatingPlayer: () => void
  hidePlayer: () => void
  togglePlayerMode: () => void
  collapsePlayer: () => void
  expandPlayer: () => void
}

// 创建上下文
const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

// 上下文提供者组件
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayMode, setDisplayMode] = useState<PlayerDisplayMode>("mini")
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [manualOverride, setManualOverride] = useState(false)

  // 初始化 - 从本地存储恢复显示模式
  useEffect(() => {
    if (typeof window === "undefined" || isInitialized) return

    try {
      const savedMode = localStorage.getItem(
        STORAGE_KEY,
      ) as PlayerDisplayMode | null
      if (
        savedMode &&
        (savedMode === "mini" ||
          savedMode === "floating" ||
          savedMode === "hidden" ||
          savedMode === "collapsed")
      ) {
        setDisplayMode(savedMode)
      }
    } catch (error) {
      console.error("无法从存储中恢复播放器模式:", error)
    }

    setIsInitialized(true)
  }, [isInitialized])

  // 路径变化时的处理逻辑
  useEffect(() => {
    if (!isInitialized) return

    // 保存当前路径
    if (previousPath !== pathname) {
      setPreviousPath(pathname)

      // 如果当前是折叠状态，保持折叠状态，不重置手动覆盖状态
      if (displayMode === "collapsed") {
        // 保持折叠状态，不做任何改变
        setManualOverride(true)
        return
      } else {
        // 非折叠状态下，路径变化时重置手动覆盖状态
        setManualOverride(false)
      }
    }

    // 只有在没有手动切换的情况下才自动调整模式
    if (!manualOverride) {
      // 播客详情页时隐藏播放器
      if (pathname && pathname.startsWith("/podcast/") && pathname.length > 9) {
        setDisplayMode("hidden")
      }
      // 离开播客详情页时恢复显示
      else if (
        displayMode === "hidden" &&
        (!pathname || !pathname.startsWith("/podcast/") || pathname.length <= 9)
      ) {
        // 恢复之前存储的显示模式
        try {
          const savedMode = localStorage.getItem(
            STORAGE_KEY,
          ) as PlayerDisplayMode | null
          if (
            savedMode &&
            (savedMode === "mini" ||
              savedMode === "floating" ||
              savedMode === "collapsed")
          ) {
            setDisplayMode(savedMode)
          } else {
            // 如果没有存储或存储的是hidden模式，默认为mini模式
            setDisplayMode("mini")
          }
        } catch (error) {
          setDisplayMode("mini")
        }
      }
      // 在主播客页面使用迷你播放器，但要检查是否已经是折叠状态
      else if (
        (pathname === "/podcast" || pathname === "/podcast/") &&
        displayMode !== "collapsed"
      ) {
        setDisplayMode("mini")
      }
      // 在其他非播客页面使用悬浮播放器，但要检查是否已经是折叠状态
      else if (
        pathname &&
        !pathname.startsWith("/podcast") &&
        displayMode !== "collapsed"
      ) {
        setDisplayMode("floating")
      }
    }
  }, [pathname, displayMode, previousPath, isInitialized, manualOverride])

  // 当显示模式变化时保存到本地存储
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized) return

    try {
      localStorage.setItem(STORAGE_KEY, displayMode)
    } catch (error) {
      console.error("无法保存播放器模式到本地存储:", error)
    }
  }, [displayMode, isInitialized])

  // 显示迷你播放器
  const showMiniPlayer = () => {
    setManualOverride(true)
    setDisplayMode("mini")
  }

  // 显示悬浮播放器
  const showFloatingPlayer = () => {
    setManualOverride(true)
    setDisplayMode("floating")
  }

  // 隐藏播放器
  const hidePlayer = () => {
    setManualOverride(true)
    setDisplayMode("hidden")
  }

  // 切换播放器模式
  const togglePlayerMode = () => {
    setManualOverride(true)
    setDisplayMode((prev) => (prev === "mini" ? "floating" : "mini"))
  }

  // 折叠播放器到边缘
  const collapsePlayer = () => {
    setManualOverride(true)
    setDisplayMode("collapsed")
  }

  // 展开折叠的播放器
  const expandPlayer = () => {
    setManualOverride(true)
    setDisplayMode("floating")
  }

  // 提供上下文值
  const value = {
    displayMode,
    showMiniPlayer,
    showFloatingPlayer,
    hidePlayer,
    togglePlayerMode,
    collapsePlayer,
    expandPlayer,
  }

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  )
}

// 使用播放器上下文的钩子
export function usePlayerDisplay() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error("usePlayerDisplay must be used within a PlayerProvider")
  }
  return context
}
