"use client"

import { useState, memo, useEffect } from "react"
import { motion } from "framer-motion"

// 格式化时间工具函数
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

/**
 * 频谱柱组件 - 用于音频可视化
 */
export const SpectrumBar = memo(
  ({
    index,
    progress,
    isPlaying,
    total,
    theme = "dark",
  }: {
    index: number
    progress: number
    isPlaying: boolean
    total: number
    theme?: "dark" | "light"
  }) => {
    // 计算基础高度时考虑边缘位置和静态效果
    const getBaseHeight = () => {
      const edgeWidth = 6 // 减小边缘过渡的条数
      let height

      if (index < edgeWidth) {
        height = 15 + (index / edgeWidth) * 10 // 开始时渐入
      } else if (index > total - edgeWidth) {
        height = 15 + ((total - index) / edgeWidth) * 10 // 结束时渐出
      } else {
        // 未播放时的静态波浪效果
        const wave = Math.sin((index / total) * Math.PI * 8) * 5
        height = 20 + wave + Math.abs((index % 20) - 10) * 1.2
      }

      return height
    }

    const baseHeight = getBaseHeight()
    const heightVariation = 15 + Math.abs((index % 20) - 10) * 3

    // 关键修复：确保未播放部分在播放时仍然可见
    const isInPlayedSection = progress > (index / total) * 100

    // 调整透明度计算 - 增加频谱深度
    const getBaseOpacity = () => {
      const edgeWidth = 6

      // 增加透明度，使频谱更深
      let playedOpacity = theme === "dark" ? 0.45 : 0.7
      let unplayedOpacity = theme === "dark" ? 0.15 : 0.08

      // 静态状态下的透明度
      let staticOpacity =
        theme === "dark"
          ? 0.25 + Math.sin((index / total) * Math.PI * 4) * 0.05
          : 0.25 + Math.sin((index / total) * Math.PI * 4) * 0.05

      // 边缘位置的透明度渐变
      if (index < edgeWidth) {
        const edgeFactor = index / edgeWidth
        return isPlaying
          ? (isInPlayedSection ? playedOpacity : unplayedOpacity) * edgeFactor
          : staticOpacity * edgeFactor
      } else if (index > total - edgeWidth) {
        const edgeFactor = (total - index) / edgeWidth
        return isPlaying
          ? (isInPlayedSection ? playedOpacity : unplayedOpacity) * edgeFactor
          : staticOpacity * edgeFactor
      }

      // 非边缘位置的透明度
      return isPlaying
        ? isInPlayedSection
          ? playedOpacity
          : unplayedOpacity
        : staticOpacity
    }

    const baseOpacity = getBaseOpacity()

    // 使用黑色频谱 - 增加颜色深度
    const getBarColor = () => {
      if (theme === "dark") {
        // 暗色模式下使用更深的黑色
        return isInPlayedSection
          ? `rgba(0, 0, 0, ${baseOpacity * 1.5})`
          : `rgba(0, 0, 0, ${baseOpacity * 1.2})`
      } else {
        return isInPlayedSection
          ? `rgba(255, 255, 255, ${baseOpacity})`
          : `rgba(255, 255, 255, ${baseOpacity * 1.2})`
      }
    }

    // 动画延迟和持续时间
    const animationDelay = (index % 6) * 0.1
    const animationDuration = 1.5 + (index % 3) * 0.5

    // 改进播放/暂停动画过渡 - 使用1.5秒过渡时间，添加透明度过渡
    return (
      <motion.div
        className="duration-1500 w-[3px] rounded-full transition-opacity" // 添加透明度过渡
        style={{
          backgroundColor: getBarColor(),
          transformOrigin: index % 2 === 0 ? "bottom" : "center",
        }}
        initial={{ height: `${baseHeight}%`, opacity: baseOpacity }}
        animate={{
          height: isPlaying
            ? isInPlayedSection
              ? [
                  `${baseHeight}%`,
                  `${baseHeight + heightVariation}%`,
                  `${baseHeight - heightVariation / 2}%`,
                  `${baseHeight + heightVariation / 2}%`,
                  `${baseHeight}%`,
                ]
              : [
                  `${baseHeight}%`,
                  `${baseHeight + heightVariation * 0.3}%`,
                  `${baseHeight - heightVariation * 0.2}%`,
                  `${baseHeight + heightVariation * 0.1}%`,
                  `${baseHeight}%`,
                ]
            : `${baseHeight}%`,
          opacity: baseOpacity, // 添加透明度动画
        }}
        transition={{
          height: isPlaying
            ? {
                duration: isInPlayedSection
                  ? animationDuration
                  : animationDuration * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: animationDelay,
                times: [0, 0.25, 0.5, 0.75, 1],
              }
            : {
                duration: 1.5, // 调整为1.5秒
                ease: [0.22, 1, 0.36, 1],
              },
          opacity: {
            duration: 1.5, // 透明度过渡时间为1.5秒
            ease: "easeInOut",
          },
        }}
      />
    )
  },
)
SpectrumBar.displayName = "SpectrumBar"

/**
 * 进度条和时间显示组件
 */
interface ProgressBarProps {
  progress: number
  currentTime: string
  duration: string
  isPlaying: boolean
  theme: "dark" | "light"
  onProgressChange: (values: number[]) => void
  themeStyles: {
    text: {
      primary: string
      secondary: string
      tertiary: string
      icon: string
      iconHover: string
    }
    bg: {
      primary: string
      secondary: string
      border: string
    }
  }
}

export const ProgressBar = memo(
  ({
    progress,
    currentTime,
    duration,
    isPlaying,
    theme,
    onProgressChange,
    themeStyles,
  }: ProgressBarProps) => {
    // 添加播放状态变化检测
    const [prevIsPlaying, setPrevIsPlaying] = useState(isPlaying)
    const [isTransitioning, setIsTransitioning] = useState(false)

    // 检测播放状态变化并设置过渡状态 - 使用1.5秒过渡时间
    useEffect(() => {
      if (prevIsPlaying !== isPlaying) {
        setIsTransitioning(true)
        const timer = setTimeout(() => {
          setIsTransitioning(false)
        }, 1500) // 1.5秒过渡时间

        setPrevIsPlaying(isPlaying)
        return () => clearTimeout(timer)
      }
    }, [isPlaying, prevIsPlaying])

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-1"
      >
        {/* 进度条 - 添加1.5秒过渡时间 */}
        <div
          className={`group relative h-8 overflow-hidden rounded-lg ${
            isTransitioning ? "duration-1500 transition-all" : ""
          }`}
        >
          {/* 背景层 - 使用浅灰色 */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(to right, rgba(180, 180, 180, 0.15), rgba(160, 160, 160, 0.1))"
                  : "linear-gradient(to right, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.06))",
            }}
          />

          {/* 悬停效果 - 使用浅灰色 */}
          <div
            className="absolute inset-0 rounded-lg opacity-0 transition-all duration-500 group-hover:opacity-100"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(to right, rgba(200, 200, 200, 0.2), rgba(180, 180, 180, 0.15))"
                  : "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
            }}
          />

          {/* 频谱动画层 - 添加过渡类 */}
          <div
            className={`absolute inset-0 flex items-center justify-between px-0.5 ${
              isTransitioning ? "duration-1500 transition-all" : ""
            }`}
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <SpectrumBar
                key={i}
                index={i}
                progress={progress}
                isPlaying={isPlaying}
                total={100}
                theme={theme}
              />
            ))}
          </div>

          {/* 进度指示器 - 使用浅灰色 */}
          <motion.div
            className="absolute top-0 h-full overflow-hidden rounded-lg"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          >
            {/* 渐变进度层 - 使用浅灰色 */}
            <div
              className="absolute inset-0 rounded-lg backdrop-blur-[1px]"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(to right, rgba(220, 220, 220, 0.25), rgba(200, 200, 220, 0.2), transparent)"
                    : "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2), transparent)",
              }}
            />

            {/* 高亮边界线 - 暗色模式下为黑色，浅色模式下为白色 */}
            <div className="absolute bottom-0 right-0 top-0 w-[1px]">
              <div
                className="absolute inset-0 blur-[1px]"
                style={{
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(0, 0, 0, 0.4)" // 暗色模式下为黑色，带模糊效果
                      : "rgba(255, 255, 255, 0.3)", // 浅色模式下为白色
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(0, 0, 0, 0.6)" // 暗色模式下为黑色，更深
                      : "rgba(255, 255, 255, 0.5)", // 浅色模式下为白色
                }}
              />
            </div>

            {/* 指示器 - 黑色 */}
            <div className="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <div className="relative">
                <div
                  className="absolute inset-[-4px] rounded-full blur-[4px]"
                  style={{
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(0, 0, 0, 0.4)"
                        : "rgba(255, 255, 255, 0.3)",
                  }}
                />
                <div
                  className="h-2 w-2 rounded-full shadow-lg"
                  style={{
                    backgroundColor:
                      theme === "dark" ? "rgba(0, 0, 0, 0.9)" : "white",
                    boxShadow:
                      theme === "dark"
                        ? "0 0 8px rgba(0, 0, 0, 0.6)"
                        : "0 0 8px rgba(255, 255, 255, 0.3)",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* 可拖动区域 */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => onProgressChange([parseFloat(e.target.value)])}
            className="absolute inset-0 h-full w-full cursor-pointer rounded-lg opacity-0"
            style={{ WebkitAppearance: "none" }}
          />
        </div>

        {/* 时间显示 - 自动适应主题 */}
        <div className="flex items-center justify-between px-0.5">
          <span
            className={`text-[10px] font-medium ${themeStyles.text.tertiary}`}
          >
            {currentTime}
          </span>
          <span
            className={`text-[10px] font-medium ${themeStyles.text.tertiary}`}
          >
            {duration}
          </span>
        </div>
      </motion.div>
    )
  },
)
ProgressBar.displayName = "ProgressBar"

export { formatTime }
