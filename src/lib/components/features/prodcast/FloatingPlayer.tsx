"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, MinusCircle, PanelRightClose } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"

import { usePodcast } from "@/lib/context/podcast/PodcastContext"
import { usePlayerDisplay } from "@/lib/components/features/prodcast/PlayerContext"
import { Button } from "@/lib/components/common/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/common/ui/tooltip"

interface FloatingPlayerProps {
  onClose: () => void // 关闭悬浮播放器的回调
}

const FloatingPlayer: React.FC<FloatingPlayerProps> = ({ onClose }) => {
  const router = useRouter()
  const { theme } = useTheme()
  const { status: sessionStatus } = useSession()
  const [mounted, setMounted] = useState(false)
  const { currentPodcast, isPlaying, progress, togglePlay, setProgress } =
    usePodcast()
  const { collapsePlayer } = usePlayerDisplay()

  // 添加加载状态的视觉反馈
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 确保组件挂载后再获取主题
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (currentPodcast) {
      setIsTransitioning(true)
      const timer = setTimeout(() => setIsTransitioning(false), 300)
      return () => clearTimeout(timer)
    }
  }, [currentPodcast?.id])

  // 监听登录状态，退出登录时关闭播放器
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      onClose()
    }
  }, [sessionStatus, onClose])

  if (!currentPodcast) return null

  // 根据主题设置颜色变量
  const isDarkTheme = mounted && theme === "dark"

  const handlePlayerClick = () => {
    if (currentPodcast?.id) {
      router.push(
        `/podcast/${currentPodcast.id}?type=${currentPodcast.type || "official"}`,
      )
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="fixed bottom-6 right-6 z-50 flex overflow-hidden rounded-full shadow-xl"
        style={{ maxWidth: "320px" }}
      >
        {/* 背景层 - 毛玻璃效果 */}
        <div className="absolute inset-0 border border-white/[0.12] bg-background/90 backdrop-blur-xl dark:border-white/[0.08] dark:bg-black/70" />

        {/* 进度条 - 顶部边缘 */}
        <div className="absolute left-0 right-0 top-0 z-10 h-0.5 bg-muted/50">
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            className="absolute inset-0 h-1 w-full cursor-pointer opacity-0"
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              if (Number.isFinite(value)) {
                setProgress(value)
              }
            }}
          />
        </div>

        {/* 内容区域 - 单行布局 */}
        <div className="relative z-10 flex items-center py-2 pl-2 pr-3">
          {/* 1. 封面图片 */}
          <div
            onClick={handlePlayerClick}
            className="flex-shrink-0 cursor-pointer"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 dark:border-white/5">
              <Image
                src={currentPodcast.image || "/placeholder.png"}
                alt={currentPodcast.title}
                fill
                className="object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="flex h-4 items-center gap-[1px]">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="h-[5px] w-[1px] rounded-full bg-white"
                        initial={{ height: 2 }}
                        animate={{
                          height: [2, 5, 2],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. 标题和创建者 */}
          <div
            className="ml-2 flex-1 cursor-pointer overflow-hidden pr-2"
            onClick={handlePlayerClick}
          >
            <h4 className="truncate text-xs font-medium text-foreground/90">
              {currentPodcast.title.length > 20
                ? `${currentPodcast.title.substring(0, 20)}...`
                : currentPodcast.title}
            </h4>
            <p className="truncate text-[10px] text-muted-foreground">
              {currentPodcast.artist || "Memenews"}
            </p>
          </div>

          {/* 3. 播放/暂停按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="mx-0.5 h-7 w-7 flex-shrink-0 rounded-full"
            onClick={togglePlay}
            disabled={isTransitioning}
          >
            {isTransitioning ? (
              <div
                className="h-3 w-3 animate-spin rounded-full"
                style={{
                  border: `1.5px solid rgba(255, 255, 255, 0.3)`,
                  borderTopColor: "rgba(255, 255, 255, 0.7)",
                }}
              />
            ) : isPlaying ? (
              <Pause className="h-3.5 w-3.5 text-foreground/80" />
            ) : (
              <Play className="ml-0.5 h-3.5 w-3.5 text-foreground/80" />
            )}
          </Button>

          {/* 4. 恢复默认模式按钮 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-0.5 h-6 w-6 flex-shrink-0 rounded-full"
                  onClick={onClose}
                >
                  <MinusCircle className="h-3 w-3 text-foreground/60 transition-colors hover:text-foreground/80" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p>默认模式</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 5. 折叠按钮 - 移至最右侧 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-0.5 h-6 w-6 flex-shrink-0 rounded-full"
                  onClick={collapsePlayer}
                >
                  <PanelRightClose className="h-3 w-3 text-foreground/60 transition-colors hover:text-foreground/80" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p>折叠播放器</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingPlayer
