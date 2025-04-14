"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  ArrowUpFromLine,
  Volume2,
  Volume1,
  VolumeX,
  RotateCcw,
  RotateCw,
  ArrowRight,
  Minimize2,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"

import { Button } from "@/lib/components/common/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/common/ui/tooltip"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/lib/components/common/ui/hover-card"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/lib/components/common/ui/drawer"
import { Skeleton } from "@/lib/components/common/ui/skeleton"
import { usePlayerDisplay } from "@/lib/components/features/prodcast/PlayerContext"
import { usePodcast } from "@/lib/context/podcast/PodcastContext"

const MiniPlayer = () => {
  const router = useRouter()
  const { theme } = useTheme()
  const { status: sessionStatus } = useSession()
  const [mounted, setMounted] = useState(false)
  const { showFloatingPlayer } = usePlayerDisplay()
  const {
    currentPodcast,
    isPlaying,
    progress,
    volume,
    currentTime,
    duration,
    playbackSpeed,
    togglePlay,
    setProgress,
    setVolume,
    setPlaybackSpeed,
    skip,
    isMuted,
    toggleMute,
    pause,
    reset,
  } = usePodcast()

  // 添加加载状态的视觉反馈
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 添加音量弹出框状态
  const [volumePopoverOpen, setVolumePopoverOpen] = useState(false)

  // 添加小屏幕控制面板状态
  const [showMobileControls, setShowMobileControls] = useState(false)

  // 添加抽屉状态
  const [drawerOpen, setDrawerOpen] = useState(false)

  // 修改删除功能
  const handleDelete = useCallback(() => {
    reset() // 使用 context 的 reset 方法
  }, [reset])

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
    if (sessionStatus === "unauthenticated" && currentPodcast) {
      // 暂停播放
      pause()
      // 清除本地存储的播放状态
      localStorage.removeItem("memenews-current-podcast")
      localStorage.removeItem("memenews-playback-state")
    }
  }, [sessionStatus, currentPodcast, pause])

  // 如果未登录或没有播放内容，不渲染播放器
  if (sessionStatus === "unauthenticated" || !currentPodcast) {
    return null
  }

  if (!currentPodcast) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* 背景层 */}
        <div className="absolute inset-0 border-t border-white/[0.12] bg-background/80 shadow-[0_-8px_16px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-black/60" />

        {/* 内容区域 */}
        <div className="relative mx-auto w-full max-w-full px-4">
          <div className="flex h-16 items-center justify-between py-3">
            {/* 左侧：封面和标题 */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2 w-24" />
              </div>
            </div>

            {/* 中间：控制按钮组 */}
            <div className="hidden items-center gap-4 sm:flex">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-[52px] rounded-full" />
            </div>

            {/* 右侧：悬浮模式按钮 */}
            <div className="hidden sm:block">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* 移动端抽屉触发器 */}
            <div className="sm:hidden">
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>

          {/* 进度条 */}
          <div className="absolute inset-x-0 top-0">
            <Skeleton className="h-0.5 w-full rounded-none opacity-30" />
          </div>
        </div>
      </motion.div>
    )
  }

  // 根据主题设置颜色变量
  const isDarkTheme = mounted && theme === "dark"

  // 定义主题相关的样式
  const themeStyles = {
    accent: isDarkTheme ? "white" : "black",
    accentMuted: isDarkTheme ? "white/80" : "black/80",
    accentLight: isDarkTheme ? "white/60" : "black/60",
    accentUltraLight: isDarkTheme ? "white/40" : "black/40",
    accentBg: isDarkTheme ? "white/10" : "black/10",
    accentBgHover: isDarkTheme ? "white/20" : "black/20",
    gradient: isDarkTheme
      ? "linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 100%)"
      : "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 100%)",
    progressGradient: isDarkTheme
      ? "linear-gradient(to right, rgba(255, 255, 255, 0.05), transparent)"
      : "linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent)",
    progressFrom: isDarkTheme ? "from-white/80" : "from-black/80",
    progressVia: isDarkTheme ? "via-white/70" : "via-black/70",
    progressTo: isDarkTheme ? "to-white/60" : "to-black/60",
  }

  const handlePlayerClick = () => {
    if (currentPodcast?.id) {
      router.push(
        `/podcast/${currentPodcast.id}?type=${currentPodcast.type || "official"}`,
      )
    }
  }

  const handleControlClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  // 添加格式化时间的辅助函数
  const formatTime = (time: string) => {
    const [minutes, seconds] = time.split(":")
    return `${minutes}:${seconds.padStart(2, "0")}`
  }

  // 添加播放速度控制
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          delay: 0.2,
        }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* 背景层 - 增强毛玻璃效果 */}
        <div className="absolute inset-0 border-t border-white/[0.12] bg-background/80 shadow-[0_-8px_16px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-black/60 dark:shadow-[0_-8px_16px_rgba(0,0,0,0.2)]" />

        {/* 进度条组 */}
        <div className="group relative">
          {/* 时间指示器 */}
          <motion.div className="absolute -top-6 left-4 right-4 flex items-center justify-between text-[10px] tracking-wider text-muted-foreground/70 opacity-0 transition-all duration-200 group-hover:opacity-100">
            <div className="rounded-full border border-white/[0.08] bg-background/80 px-2 py-0.5 backdrop-blur-sm">
              {formatTime(currentTime)}
            </div>
            <div className="rounded-full border border-white/[0.08] bg-background/80 px-2 py-0.5 backdrop-blur-sm">
              {formatTime(duration)}
            </div>
          </motion.div>

          {/* 进度条容器 */}
          <div className="group/progress relative h-1">
            {/* 缓冲进度背景 - 始终可见 */}
            <motion.div
              className="absolute inset-0 origin-left rounded-full"
              style={{
                backgroundColor: isDarkTheme
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.05)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.min((progress + 15) / 100, 1) }}
              transition={{ duration: 0.5 }}
            />

            {/* 播放进度 - 始终可见 */}
            <motion.div
              className="absolute inset-0 origin-left rounded-full"
              style={{
                scaleX: progress / 100,
                background: isDarkTheme
                  ? "linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.4) 100%)"
                  : "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.4) 100%)",
              }}
              transition={{ type: "spring", bounce: 0 }}
            />

            {/* 交互层 - 悬浮时显示 */}
            <div className="absolute inset-0 -inset-y-2 opacity-0 transition-all duration-200 group-hover/progress:opacity-100">
              {/* 进度把手 - 悬浮时显示 */}
              <motion.div
                className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2"
                style={{
                  left: `${progress}%`,
                }}
              >
                <div
                  className="absolute inset-0 animate-ping rounded-full"
                  style={{
                    backgroundColor: isDarkTheme
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.2)",
                  }}
                />
                <div
                  className="absolute inset-[3px] rounded-full shadow-lg"
                  style={{
                    backgroundColor: isDarkTheme ? "white" : "black",
                  }}
                />
              </motion.div>

              {/* 交互层*/}
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (Number.isFinite(value)) {
                    setProgress(value)
                  }
                }}
              />

              {/* 悬浮渐变 */}
              <div
                className="absolute inset-1"
                style={{
                  background: isDarkTheme
                    ? "linear-gradient(to right, rgba(255, 255, 255, 0.05), transparent)"
                    : "linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent)",
                  clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 内容区域 - 重新设计布局 */}
        <div className="relative mx-auto w-full max-w-full px-4">
          <div className="py-3">
            {/* 小屏幕布局 */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <div className="flex items-center justify-between sm:hidden">
                  {/* 左侧：唱片、标题、内容 */}
                  <div className="flex flex-1 items-center gap-3">
                    {/* 小型唱片样式 */}
                    <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm">
                      {/* 唱片外圈 */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900" />

                      {/* 唱片中心圆 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-zinc-500 shadow-inner" />
                      </div>

                      {/* 封面小图 - 中心位置 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-6 w-6 overflow-hidden rounded-full border border-zinc-700">
                          <Image
                            src={currentPodcast.image || "/placeholder.png"}
                            alt={currentPodcast.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* 播放状态指示器 - 播放时显示 - 增大尺寸 */}
                      {isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="flex h-6 items-center gap-[1.5px]">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                className="h-[8px] w-[1.5px] rounded-full bg-white"
                                initial={{ height: 3 }}
                                animate={{
                                  height: [3, 8, 3],
                                }}
                                transition={{
                                  duration: 0.8,
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

                    {/* 标题和内容 */}
                    <div className="flex-1 truncate">
                      <h4 className="truncate text-sm font-medium">
                        {currentPodcast.title}
                      </h4>
                      <p className="truncate text-xs text-muted-foreground">
                        {currentPodcast.artist || "Memenews"}
                      </p>
                    </div>
                  </div>

                  {/* 右侧：控制按钮 */}
                  <div className="ml-2 flex items-center gap-3">
                    {/* 播放/暂停按钮 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePlay()
                      }}
                      style={{
                        background: isDarkTheme
                          ? "linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
                          : "linear-gradient(145deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
                        color: isDarkTheme
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(0, 0, 0, 0.9)",
                      }}
                    >
                      {isTransitioning ? (
                        <div
                          className="h-3.5 w-3.5 animate-spin rounded-full"
                          style={{
                            border: `1.5px solid ${isDarkTheme ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"}`,
                            borderTopColor: isDarkTheme
                              ? "rgba(255, 255, 255, 0.9)"
                              : "rgba(0, 0, 0, 0.9)",
                          }}
                        />
                      ) : isPlaying ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="ml-0.5 h-3.5 w-3.5" />
                      )}
                    </Button>

                    {/* 展开按钮 - 更加明显 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full transition-all duration-200"
                      style={{
                        background: isDarkTheme
                          ? "linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))"
                          : "linear-gradient(145deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.08))",
                        color: isDarkTheme
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(0, 0, 0, 0.9)",
                        boxShadow: isDarkTheme
                          ? "0 1px 2px rgba(0, 0, 0, 0.2)"
                          : "0 1px 2px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <ArrowUpFromLine className="h-3.5 w-3.5" />
                    </Button>

                    {/* 关闭按钮 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full transition-all duration-200 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete()
                      }}
                      style={{
                        background: "transparent",
                        color: isDarkTheme
                          ? "rgba(255, 255, 255, 0.7)"
                          : "rgba(0, 0, 0, 0.7)",
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </DrawerTrigger>

              <DrawerContent className="bg-background/90 backdrop-blur-2xl dark:bg-black/80">
                <div className="mx-auto w-full max-w-md">
                  <DrawerHeader className="text-center">
                    <DrawerTitle className="text-lg font-medium">
                      正在播放
                    </DrawerTitle>
                  </DrawerHeader>

                  <div className="px-4 pb-8">
                    {/* 封面图片 */}
                    <div className="relative mx-auto mb-6 aspect-square w-64 overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={currentPodcast.image || "/placeholder.png"}
                        alt={currentPodcast.title}
                        fill
                        className="object-cover"
                        quality={95}
                        sizes="256px"
                        priority={true}
                      />

                      {/* 渐变覆盖 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                    </div>

                    {/* 标题和作者 */}
                    <div className="mb-6 text-center">
                      <h3 className="mb-1 text-xl font-bold">
                        {currentPodcast.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentPodcast.artist || "Memenews"}
                      </p>
                    </div>

                    {/* 可滑动的进度条 */}
                    <div className="mb-8 space-y-2">
                      <div className="relative h-1.5 w-full rounded-full bg-muted/50">
                        {/* 已播放部分 */}
                        <div
                          className="absolute h-full rounded-full bg-primary"
                          style={{ width: `${progress}%` }}
                        />

                        {/* 滑块 */}
                        <div
                          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer rounded-full bg-primary shadow-md transition-transform hover:scale-110"
                          style={{ left: `calc(${progress}% - 8px)` }}
                        />

                        {/* 交互层 */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.1"
                          value={progress}
                          className="absolute inset-0 h-8 w-full cursor-pointer opacity-0"
                          style={{ top: "-12px" }}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            if (Number.isFinite(value)) {
                              setProgress(value)
                            }
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{currentTime}</span>
                        <span>{duration}</span>
                      </div>
                    </div>

                    {/* 主控制按钮 */}
                    <div className="mb-8 flex items-center justify-center gap-8">
                      {/* 快退5秒 */}
                      <HoverCard openDelay={0} closeDelay={200}>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group h-9 w-9 rounded-full transition-all duration-300 hover:scale-105"
                            onClick={() => skip(-5)}
                            style={{
                              backgroundColor: "transparent",
                              color: isDarkTheme
                                ? "rgba(255, 255, 255, 0.7)"
                                : "rgba(0, 0, 0, 0.7)",
                            }}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-24 border-white/[0.12] bg-background/90 p-2 text-center backdrop-blur-2xl dark:border-white/[0.08] dark:bg-black/80"
                          side="top"
                          align="center"
                        >
                          <p className="text-sm">快退 5 秒</p>
                        </HoverCardContent>
                      </HoverCard>

                      {/* 播放/暂停 */}
                      <Button
                        variant="default"
                        size="icon"
                        className="h-16 w-16 rounded-full shadow-lg"
                        onClick={togglePlay}
                        disabled={isTransitioning}
                      >
                        {isTransitioning ? (
                          <div
                            className="h-6 w-6 animate-spin rounded-full"
                            style={{
                              border: `2px solid rgba(255, 255, 255, 0.3)`,
                              borderTopColor: "rgba(255, 255, 255, 0.7)",
                            }}
                          />
                        ) : isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="ml-1 h-6 w-6" />
                        )}
                      </Button>

                      {/* 快进5秒 */}
                      <HoverCard openDelay={0} closeDelay={200}>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group h-9 w-9 rounded-full transition-all duration-300 hover:scale-105"
                            onClick={() => skip(5)}
                            style={{
                              backgroundColor: "transparent",
                              color: isDarkTheme
                                ? "rgba(255, 255, 255, 0.7)"
                                : "rgba(0, 0, 0, 0.7)",
                            }}
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-24 border-white/[0.12] bg-background/90 p-2 text-center backdrop-blur-2xl dark:border-white/[0.08] dark:bg-black/80"
                          side="top"
                          align="center"
                        >
                          <p className="text-sm">快进 5 秒</p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>

                    {/* 跳转到详情页 */}
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={handlePlayerClick}
                        className="group relative h-11 w-full overflow-hidden rounded-2xl border-none bg-gradient-to-r from-primary/90 to-primary shadow-lg transition-all hover:opacity-95"
                      >
                        {/* 优化后的背景光效 - 放在文字层下方 */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
                          initial={{ x: "-200%" }}
                          animate={{ x: "200%" }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                        />

                        {/* 文字内容 - 使用z-index确保在动画上方 */}
                        <div className="relative z-10 flex w-full items-center justify-center gap-1">
                          <span className="text-sm font-medium text-white">
                            沉浸式播放
                          </span>
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* 控制按钮组 - 中等屏幕及以上显示完整版 */}
            <div
              className="hidden w-full items-center sm:flex"
              onClick={handleControlClick}
            >
              {/* 创建三列布局，左、中、右各占固定宽度，保证中间真正居中 */}
              <div className="flex w-[100px] justify-start">
                {/* 左侧空间，可以添加其他控件 */}
              </div>

              {/* 中间控制按钮组，使用绝对定位确保始终水平居中 */}
              <div className="relative flex flex-1 items-center justify-center">
                <div className="flex items-center justify-center gap-5">
                  <TooltipProvider>
                    {/* 1. 音量控制 */}
                    <HoverCard openDelay={0} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={toggleMute}
                          style={{
                            backgroundColor: "transparent",
                            color: isDarkTheme
                              ? "rgba(255, 255, 255, 0.7)"
                              : "rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          {getVolumeIcon()}
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-48 border-white/[0.12] bg-background/90 p-3 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-black/80"
                        side="top"
                        align="center"
                      >
                        <div className="flex flex-col space-y-2">
                          {/* 显示当前音量的一行 */}
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium">音量</span>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(isMuted ? 0 : volume * 100)}%
                            </span>
                          </div>

                          {/* 音量滑块 */}
                          <div className="group/volume relative flex h-7 w-full items-center">
                            {/* 背景轨道 */}
                            <div
                              className="absolute h-1.5 w-full rounded-full"
                              style={{
                                backgroundColor: isDarkTheme
                                  ? "rgba(255, 255, 255, 0.2)"
                                  : "rgba(0, 0, 0, 0.2)",
                              }}
                            />

                            {/* 已填充部分 */}
                            <div
                              className="absolute h-1.5 rounded-full"
                              style={{
                                width: `${isMuted ? 0 : volume * 100}%`,
                                background: isDarkTheme
                                  ? "linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))"
                                  : "linear-gradient(90deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))",
                              }}
                            />

                            {/* 滑块 */}
                            <div
                              className="absolute h-4 w-4 -translate-y-[1px] cursor-pointer rounded-full transition-transform duration-150 hover:scale-110"
                              style={{
                                left: `calc(${isMuted ? 0 : volume * 100}% - 8px)`,
                                backgroundColor: isDarkTheme
                                  ? "white"
                                  : "black",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              }}
                            />

                            {/* 交互层 */}
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={isMuted ? 0 : Math.round(volume * 100)}
                              className="absolute inset-0 h-7 w-full cursor-pointer opacity-0"
                              onChange={(e) => {
                                const value = parseInt(e.target.value)
                                if (Number.isFinite(value)) {
                                  setVolume(value / 100)
                                  if (isMuted && value > 0) {
                                    toggleMute()
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>

                    {/* 2. 快退按钮 */}
                    <HoverCard openDelay={0} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="group h-9 w-9 rounded-full transition-all duration-300 hover:scale-105"
                          onClick={() => skip(-5)}
                          style={{
                            backgroundColor: "transparent",
                            color: isDarkTheme
                              ? "rgba(255, 255, 255, 0.7)"
                              : "rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-24 border-white/[0.12] bg-background/90 p-2 text-center backdrop-blur-2xl dark:border-white/[0.08] dark:bg-black/80"
                        side="top"
                        align="center"
                      >
                        <p className="text-sm">快退 5 秒</p>
                      </HoverCardContent>
                    </HoverCard>

                    {/* 3. 播放/暂停按钮 */}
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="group relative mx-2 cursor-pointer">
                          {/* 唱片样式容器 */}
                          <div className="relative h-14 w-14 overflow-hidden rounded-full shadow-lg">
                            {/* 唱片外圈 */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900" />

                            {/* 唱片内圈 */}
                            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800" />

                            {/* 唱片中心圆 */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-4 w-4 rounded-full bg-zinc-500 shadow-inner" />
                            </div>

                            {/* 唱片纹路 - 多个同心圆 */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute inset-[3px] rounded-full border border-white/20" />
                              <div className="absolute inset-[6px] rounded-full border border-white/20" />
                              <div className="absolute inset-[9px] rounded-full border border-white/20" />
                            </div>

                            {/* 封面小图 - 中心位置 */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-zinc-700">
                                <Image
                                  src={
                                    currentPodcast.image || "/placeholder.png"
                                  }
                                  alt={currentPodcast.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>

                            {/* 播放状态指示器 - 播放时显示，不悬浮时 - 增大尺寸 */}
                            {isPlaying && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 group-hover:opacity-0">
                                <div className="flex h-10 items-center gap-[3px]">
                                  {[1, 2, 3].map((i) => (
                                    <motion.div
                                      key={i}
                                      className="h-[14px] w-[3px] rounded-full bg-white"
                                      initial={{ height: 4 }}
                                      animate={{
                                        height: [4, 14, 4],
                                      }}
                                      transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 悬浮时显示的播放/暂停按钮 */}
                            <div
                              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePlay()
                              }}
                            >
                              {isTransitioning ? (
                                <div
                                  className="h-6 w-6 animate-spin rounded-full"
                                  style={{
                                    border: `2px solid rgba(255, 255, 255, 0.3)`,
                                    borderTopColor: "rgba(255, 255, 255, 0.7)",
                                  }}
                                />
                              ) : isPlaying ? (
                                <Pause className="h-6 w-6 text-white" />
                              ) : (
                                <Play className="ml-0.5 h-6 w-6 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-72 border-white/[0.12] bg-background/90 p-0 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-black/80"
                        align="center"
                      >
                        <div className="relative">
                          {/* 悬浮卡片中的唱片样式 */}
                          <div
                            className="relative h-40 w-full cursor-pointer overflow-hidden rounded-t-lg bg-gradient-to-br from-zinc-800 to-zinc-900"
                            onClick={handlePlayerClick}
                          >
                            {/* 大型唱片展示 */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative h-32 w-32">
                                {/* 唱片外圈 */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 shadow-lg" />

                                {/* 唱片内圈 */}
                                <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700" />

                                {/* 唱片中心圆 */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="h-6 w-6 rounded-full bg-zinc-500 shadow-inner" />
                                </div>

                                {/* 唱片纹路 - 多个同心圆 */}
                                <div className="absolute inset-0 opacity-30">
                                  {[...Array(8)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="absolute rounded-full border border-white/20"
                                      style={{
                                        inset: `${(i + 1) * 3}px`,
                                      }}
                                    />
                                  ))}
                                </div>

                                {/* 封面中等图 - 中心位置 */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-zinc-700">
                                    <Image
                                      src={
                                        currentPodcast.image ||
                                        "/placeholder.png"
                                      }
                                      alt={currentPodcast.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>

                                {/* 播放状态指示器 - 播放时显示 - 增大尺寸 */}
                                {isPlaying && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <div className="flex h-12 items-center gap-[4px]">
                                      {[1, 2, 3].map((i) => (
                                        <motion.div
                                          key={i}
                                          className="h-[20px] w-[4px] rounded-full bg-white"
                                          initial={{ height: 6 }}
                                          animate={{
                                            height: [6, 20, 6],
                                          }}
                                          transition={{
                                            duration: 0.8,
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

                            {/* 渐变背景 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                            {/* 跳转提示 - 悬浮时显示 */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                              <div className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                                点击查看详情
                              </div>
                            </div>

                            {/* 标题信息 */}
                            <div className="absolute bottom-0 p-4">
                              <h4 className="mb-1 font-medium text-white">
                                {currentPodcast.title}
                              </h4>
                              <p className="text-sm text-white/70">
                                {currentPodcast.artist || "Memenews"}
                              </p>
                            </div>
                          </div>

                          {/* 只保留进度条 */}
                          <div className="p-4">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{currentTime}</span>
                              <span>{duration}</span>
                            </div>

                            {/* 进度条 */}
                            <div className="relative mt-2 flex h-6 w-full items-center py-2">
                              {/* 背景轨道 */}
                              <div
                                className="absolute h-1 w-full rounded-full"
                                style={{
                                  backgroundColor: isDarkTheme
                                    ? "rgba(255, 255, 255, 0.2)"
                                    : "rgba(0, 0, 0, 0.2)",
                                }}
                              />

                              {/* 已播放部分 */}
                              <div
                                className="absolute h-1 rounded-full"
                                style={{
                                  width: `${progress}%`,
                                  background: isDarkTheme
                                    ? "linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))"
                                    : "linear-gradient(90deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))",
                                }}
                              />

                              {/* 滑块 */}
                              <div
                                className="absolute h-3 w-3 -translate-y-[1px] cursor-pointer rounded-full transition-transform duration-150 hover:scale-110"
                                style={{
                                  left: `calc(${progress}% - 6px)`,
                                  backgroundColor: isDarkTheme
                                    ? "white"
                                    : "black",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                }}
                              />

                              {/* 交互层 */}
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={progress}
                                className="absolute inset-0 h-6 w-full cursor-pointer opacity-0"
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value)
                                  if (Number.isFinite(value)) {
                                    setProgress(value)
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>

                    {/* 4. 快进按钮 */}
                    <HoverCard openDelay={0} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="group h-9 w-9 rounded-full transition-all duration-300 hover:scale-105"
                          onClick={() => skip(5)}
                          style={{
                            backgroundColor: "transparent",
                            color: isDarkTheme
                              ? "rgba(255, 255, 255, 0.7)"
                              : "rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-24 border-white/[0.12] bg-background/90 p-2 text-center backdrop-blur-2xl dark:border-white/[0.08] dark:bg-black/80"
                        side="top"
                        align="center"
                      >
                        <p className="text-sm">快进 5 秒</p>
                      </HoverCardContent>
                    </HoverCard>

                    {/* 5. 播放速度控制 */}
                    <HoverCard openDelay={0} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-[50px] rounded-full text-xs font-normal"
                          style={{
                            backgroundColor: "transparent",
                            color: isDarkTheme
                              ? "rgba(255, 255, 255, 0.7)"
                              : "rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          {playbackSpeed}x
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-20 border-white/[0.12] bg-background/90 p-2 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-black/80"
                        side="top"
                        align="start"
                      >
                        <div className="flex flex-col space-y-1">
                          {[0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((speed) => (
                            <Button
                              key={speed}
                              variant="ghost"
                              size="sm"
                              className={`flex justify-between rounded-md px-2 py-1.5 text-xs ${
                                playbackSpeed === speed
                                  ? "bg-primary/10 font-medium text-primary"
                                  : "text-foreground/80"
                              }`}
                              onClick={() => handleSpeedChange(speed)}
                            >
                              <span>{speed}x</span>
                              {playbackSpeed === speed && <span>✓</span>}
                            </Button>
                          ))}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TooltipProvider>
                </div>
              </div>

              {/* 右侧按钮组，固定宽度 */}
              <div className="flex w-[100px] items-center justify-end gap-2">
                {/* 悬浮模式按钮 */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group h-9 w-9 rounded-full transition-all duration-300 hover:scale-105"
                        onClick={showFloatingPlayer}
                        style={{
                          backgroundColor: "transparent",
                          color: isDarkTheme
                            ? "rgba(255, 255, 255, 0.7)"
                            : "rgba(0, 0, 0, 0.7)",
                        }}
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>悬浮模式</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* 分隔线 */}
                <div
                  className="h-5 w-[1px]"
                  style={{
                    backgroundColor: isDarkTheme
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.2)",
                  }}
                />

                {/* 关闭按钮 */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group h-9 w-9 rounded-full transition-all duration-300 hover:scale-105 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete()
                        }}
                        style={{
                          backgroundColor: "transparent",
                          color: isDarkTheme
                            ? "rgba(255, 255, 255, 0.7)"
                            : "rgba(0, 0, 0, 0.7)",
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>关闭播放</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MiniPlayer
