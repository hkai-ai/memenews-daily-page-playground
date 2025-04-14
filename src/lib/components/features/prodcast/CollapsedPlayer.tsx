"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Headphones } from "lucide-react"
import { useTheme } from "next-themes"

import { usePodcast } from "@/lib/context/podcast/PodcastContext"
import { usePlayerDisplay } from "@/lib/components/features/prodcast/PlayerContext"
import { Button } from "@/lib/components/common/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/common/ui/tooltip"

const CollapsedPlayer: React.FC = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { currentPodcast, isPlaying, progress } = usePodcast()
  const { expandPlayer } = usePlayerDisplay()

  // 确保组件挂载后再获取主题
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!currentPodcast) return null

  // 根据主题设置颜色变量
  const isDarkTheme = mounted && theme === "dark"

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className="fixed bottom-6 right-0 z-50"
      >
        {/* 主体部分 - 仅显示一个固定在右侧的按钮，使用反差色 */}
        <div className="relative">
          {/* 展开按钮 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={expandPlayer}
                  className={`group relative h-10 w-8 rounded-l-md border-y border-l backdrop-blur-sm transition-all duration-300 ${
                    isDarkTheme
                      ? "border-gray-200 bg-gray-100 text-gray-700 hover:bg-white hover:text-black"
                      : "border-gray-800 bg-gray-900 text-gray-300 hover:bg-black hover:text-white"
                  }`}
                >
                  <Headphones className="h-3 w-3 transition-colors" />

                  {/* 播放状态指示器 */}
                  {isPlaying && (
                    <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-[1px]">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className={`h-[3px] w-[1px] rounded-full ${
                            isDarkTheme ? "bg-gray-700" : "bg-gray-300"
                          }`}
                          initial={{ height: 1 }}
                          animate={{
                            height: [1, 3, 1],
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
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">
                <p>展开播放器</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 进度指示条 */}
          <div className="absolute left-0 top-0 h-full w-0.5 overflow-hidden">
            <div
              className={`absolute bottom-0 left-0 w-full ${
                isDarkTheme ? "bg-gray-700" : "bg-gray-300"
              }`}
              style={{
                height: `${progress}%`,
                transition: "height 0.3s ease-out",
              }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CollapsedPlayer
