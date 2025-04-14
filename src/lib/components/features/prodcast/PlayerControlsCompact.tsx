"use client"

import { memo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Gauge,
  Check,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/common/ui/dropdown-menu"
import { Button } from "@/lib/components/common/ui/button"
import { usePodcast } from "@/lib/context/podcast/PodcastContext"

// 常量配置
// 播放速度选项
const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

// 播放控制组件接口
export interface PlayerControlsProps {
  isPlaying: boolean
  isLoading: boolean
  onTogglePlay: () => void
  onSkip: (seconds: number) => void
  volume: number
  isMuted: boolean
  onVolumeChange: (value: number) => void
  onToggleMute: () => void
  playbackSpeed: number
  onSpeedChange: (speed: number) => void
  theme?: "dark" | "light"
  textColor?: {
    primary: string
    secondary: string
    tertiary: string
    icon: string
    iconHover: string
  }
  bgColor?: {
    primary: string
    secondary: string
    border: string
  }
}

export const PlayerControlsCompact = memo(
  ({
    isPlaying,
    isLoading,
    onTogglePlay,
    onSkip,
    playbackSpeed,
    onSpeedChange,
    theme = "dark",
    textColor = {
      primary: "text-white/90",
      secondary: "text-white/70",
      tertiary: "text-white/40",
      icon: "text-white/70",
      iconHover: "text-white/90",
    },
    bgColor = {
      primary: "bg-white/10",
      secondary: "bg-white/5",
      border: "border-white/10",
    },
  }: PlayerControlsProps) => {
    const { volume, isMuted, setVolume, toggleMute } = usePodcast()

    // 跟踪滑块值 - 直接使用 volume 的值，确保实时同步
    const [sliderValue, setSliderValue] = useState(isMuted ? 0 : volume * 100)

    // 全局 volume 或 isMuted 变化时更新滑块值
    useEffect(() => {
      setSliderValue(isMuted ? 0 : volume * 100)
    }, [volume, isMuted])

    // 根据主题动态计算按钮样式
    const getButtonStyles = () => {
      if (theme === "dark") {
        return {
          ghost: "hover:bg-black/5 text-black/70 hover:text-black/90",
          primary:
            "bg-black hover:bg-black/90 text-white hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]",
        }
      } else {
        return {
          ghost: "hover:bg-white/5 text-white/70 hover:text-white/90",
          primary:
            "bg-white hover:bg-white/90 text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]",
        }
      }
    }

    const buttonStyles = getButtonStyles()

    // 确保播放速度按钮使用传入的 playbackSpeed
    const handleSpeedClick = () => {
      // 循环切换播放速度：1 -> 1.25 -> 1.5 -> 2 -> 1
      const speeds = [1, 1.25, 1.5, 2]
      const currentIndex = speeds.indexOf(playbackSpeed)
      const nextIndex = (currentIndex + 1) % speeds.length
      onSpeedChange(speeds[nextIndex])
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-4"
      >
        {/* 音量控制 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full ${buttonStyles.ghost} transition-colors duration-200`}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`${theme === "light" ? "border-black/10 bg-white/95" : "border-white/10 bg-zinc-900/95"} min-w-[60px] p-2 backdrop-blur-xl`}
            align="center"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <span
                  className={`text-xs ${theme === "light" ? "text-black/60" : "text-white/40"}`}
                >
                  {Math.round(sliderValue)}%
                </span>
              </div>

              <div className="relative mx-auto my-4 h-24 w-6">
                {/* 背景轨道 */}
                <div
                  className="absolute bottom-0 left-1/2 top-0 w-1 -translate-x-1/2 rounded-full"
                  style={{
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                  }}
                />

                {/* 已填充部分 */}
                <div
                  className="absolute bottom-0 left-1/2 w-1 -translate-x-1/2 rounded-full"
                  style={{
                    height: `${sliderValue}%`,
                    background:
                      theme === "dark"
                        ? "linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))"
                        : "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))",
                  }}
                />

                {/* 滑块 */}
                <div
                  className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full transition-transform duration-150 hover:scale-110"
                  style={{
                    bottom: `calc(${sliderValue}% - 6px)`,
                    backgroundColor: theme === "dark" ? "white" : "black",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />

                {/* 交互层 - 修复滑动 BUG */}
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={(e) => {
                    // 计算点击位置相对于容器的百分比
                    const rect = e.currentTarget.getBoundingClientRect()
                    const clickY = e.clientY - rect.top
                    const height = rect.height

                    // 将点击位置转换为音量值 (从下到上增加)
                    const newValue = 100 - Math.round((clickY / height) * 100)
                    const clampedValue = Math.max(0, Math.min(100, newValue))

                    // 更新状态
                    setSliderValue(clampedValue)
                    if (isMuted && clampedValue > 0) {
                      toggleMute()
                    }
                    setVolume(clampedValue / 100)
                  }}
                  onMouseDown={(e) => {
                    // 初始点击处理
                    const rect = e.currentTarget.getBoundingClientRect()
                    const startY = e.clientY
                    const startValue = sliderValue
                    const height = rect.height

                    // 鼠标移动处理函数
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      // 计算鼠标移动的距离
                      const deltaY = startY - moveEvent.clientY
                      // 将移动距离转换为音量变化
                      const valueChange = Math.round((deltaY / height) * 100)
                      const newValue = Math.max(
                        0,
                        Math.min(100, startValue + valueChange),
                      )

                      // 更新状态
                      setSliderValue(newValue)
                      if (isMuted && newValue > 0) {
                        toggleMute()
                      }
                      setVolume(newValue / 100)
                    }

                    // 鼠标释放处理函数
                    const handleMouseUp = () => {
                      // 移除事件监听器
                      document.removeEventListener("mousemove", handleMouseMove)
                      document.removeEventListener("mouseup", handleMouseUp)
                    }

                    // 添加事件监听器
                    document.addEventListener("mousemove", handleMouseMove)
                    document.addEventListener("mouseup", handleMouseUp)
                  }}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleMute()
                }}
                className={`h-6 w-full rounded-md ${theme === "light" ? "text-black/70 hover:bg-black/5 hover:text-black/90" : "text-white/70 hover:bg-white/5 hover:text-white/90"} text-xs font-medium`}
              >
                静音
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 后退按钮 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSkip(-5)}
          className={`h-10 w-10 rounded-full ${buttonStyles.ghost} transition-colors duration-200`}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* 播放按钮 */}
        <Button
          variant="default"
          size="icon"
          onClick={onTogglePlay}
          disabled={isLoading}
          className={`group relative h-14 w-14 overflow-hidden rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-0`}
          style={{
            backgroundColor:
              theme === "light"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.08)",
            color:
              theme === "light"
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(0, 0, 0, 0.8)",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                theme === "light"
                  ? "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)"
                  : "radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
            }}
          />

          <div
            className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              boxShadow:
                theme === "light"
                  ? "0 0 15px rgba(255, 255, 255, 0.2)"
                  : "0 0 15px rgba(0, 0, 0, 0.15)",
            }}
          />

          {isLoading ? (
            <div
              className="h-6 w-6 animate-spin rounded-full"
              style={{
                border: `2px solid ${theme === "light" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"}`,
                borderTopColor:
                  theme === "light"
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(0, 0, 0, 0.8)",
              }}
            />
          ) : isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="ml-0.5 h-6 w-6" />
          )}
        </Button>

        {/* 前进按钮 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSkip(5)}
          className={`h-10 w-10 rounded-full ${buttonStyles.ghost} transition-colors duration-200`}
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        {/* 播放速度控制*/}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full ${buttonStyles.ghost} transition-colors duration-200`}
            >
              <Gauge className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`${theme === "light" ? "border-black/10 bg-white/95" : "border-white/10 bg-zinc-900/95"} min-w-[80px] p-1 backdrop-blur-xl`}
            align="center"
          >
            {PLAYBACK_SPEEDS.map((speed) => (
              <DropdownMenuItem
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`flex items-center justify-between px-2 py-2 ${theme === "light" ? "text-black/70 hover:bg-black/5 hover:text-black" : "text-white/70 hover:bg-white/5 hover:text-white"} rounded-lg transition-colors duration-200`}
              >
                <span className="text-xs">{speed}x</span>
                {Math.abs(speed - playbackSpeed) < 0.01 && (
                  <Check className="h-2 w-2" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    )
  },
)
PlayerControlsCompact.displayName = "PlayerControlsCompact"
