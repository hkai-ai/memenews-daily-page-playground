"use client"

import { motion } from "framer-motion"

interface PlayerSkeletonProps {
  theme?: "light" | "dark"
  style?: React.CSSProperties
}

export const PlayerSkeleton = ({
  theme = "light",
  style,
}: PlayerSkeletonProps) => {
  const bgColor = theme === "light" ? "bg-black/[0.12]" : "bg-white/[0.12]"
  const shimmerColor = theme === "light" ? "via-black/[0.2]" : "via-white/[0.2]"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative w-full max-w-[88%] overflow-hidden rounded-2xl backdrop-blur-2xl transition-all duration-500 sm:max-w-[90%] sm:rounded-3xl md:max-w-4xl ${
        theme === "light"
          ? "border-black/10 bg-black/5"
          : "border-white/10 bg-white/5"
      } border shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
    >
      <div className="relative flex flex-col p-4 sm:p-7 md:flex-row">
        {/* 左侧封面骨架 */}
        <div className="w-full flex-shrink-0 md:w-[320px]">
          <div className="relative mx-auto aspect-square max-w-[280px] md:max-w-none">
            <div
              className={`absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl ${bgColor} animate-pulse`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent ${shimmerColor} -translate-x-full animate-[shimmer_2s_infinite] to-transparent`}
              />
            </div>
          </div>
        </div>

        {/* 右侧内容骨架 */}
        <div className="mt-5 flex min-w-0 flex-1 flex-col sm:mt-7 md:ml-7 md:mt-0">
          <div className="flex min-h-0 flex-1 flex-col">
            {/* 用户信息骨架 */}
            <div className="mb-3 sm:mb-5">
              <div className="mb-2 flex items-center sm:mb-3">
                <div
                  className={`h-6 w-6 rounded-full sm:h-8 sm:w-8 ${bgColor} mr-2 animate-pulse`}
                />
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <div
                    className={`h-2.5 w-16 sm:h-3 sm:w-24 ${bgColor} animate-pulse rounded`}
                  />
                  <div
                    className={`h-2 w-24 sm:w-32 ${bgColor} animate-pulse rounded`}
                  />
                </div>
              </div>

              {/* 标题骨架 */}
              <div className="space-y-1 sm:space-y-2">
                <div
                  className={`h-5 w-3/4 sm:h-8 ${bgColor} animate-pulse rounded`}
                />
                <div
                  className={`h-5 w-1/2 sm:h-8 ${bgColor} animate-pulse rounded`}
                />
              </div>

              {/* 日期骨架 */}
              <div
                className={`mt-1.5 h-2.5 w-24 sm:mt-3 sm:h-3 sm:w-32 ${bgColor} animate-pulse rounded`}
              />
            </div>

            {/* 描述文本骨架 */}
            <div className="mb-3 space-y-1 sm:mb-6 sm:space-y-2">
              <div
                className={`h-2.5 w-full sm:h-4 ${bgColor} animate-pulse rounded`}
              />
              <div
                className={`h-2.5 w-3/4 sm:h-4 ${bgColor} animate-pulse rounded`}
              />
            </div>

            {/* 控制区域骨架 */}
            <div className="mt-auto space-y-3 sm:space-y-5">
              {/* 进度条骨架 */}
              <div className="space-y-1 sm:space-y-2">
                <div
                  className={`h-1 w-full ${bgColor} animate-pulse rounded-full`}
                />
                <div className="flex justify-between">
                  <div
                    className={`h-2 w-8 sm:h-3 sm:w-12 ${bgColor} animate-pulse rounded`}
                  />
                  <div
                    className={`h-2 w-8 sm:h-3 sm:w-12 ${bgColor} animate-pulse rounded`}
                  />
                </div>
              </div>

              {/* 控制按钮组骨架 */}
              <div className="mt-1 flex items-center justify-center gap-2 sm:mt-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* 播放控制按钮骨架 */}
                  <div
                    className={`h-7 w-7 rounded-full sm:h-10 sm:w-10 ${bgColor} animate-pulse`}
                  />
                  <div
                    className={`h-10 w-10 rounded-full sm:h-14 sm:w-14 ${bgColor} animate-pulse`}
                  />
                  <div
                    className={`h-7 w-7 rounded-full sm:h-10 sm:w-10 ${bgColor} animate-pulse`}
                  />
                </div>

                {/* 音量和速度控制骨架 */}
                <div className="ml-3 flex items-center gap-2 sm:ml-6 sm:gap-3">
                  <div
                    className={`h-7 w-7 rounded-full sm:h-10 sm:w-10 ${bgColor} animate-pulse`}
                  />
                  <div
                    className={`h-7 w-7 rounded-full sm:h-10 sm:w-10 ${bgColor} animate-pulse`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
