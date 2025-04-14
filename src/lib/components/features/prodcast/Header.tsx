"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Download, FileText, Share2 } from "lucide-react"

import { Button } from "@/lib/components/common/ui/button"

// 播客数据接口
interface PodcastData {
  created_at: string
  image: {
    memenew: string
    article: string
    theme: "light" | "dark"
  }
  mp3_url: string
  text_url: string
  status: string
  title: string
  setting: {
    rate: string
    style: string
    type: string
    voice: {
      F: string
      M: string
    }
  }
  data?: {
    avatar?: string
    username?: string
    header?: string
  }
}

interface HeaderProps {
  router: any
  podcast: PodcastData | null
  textColor: {
    primary: string
    secondary: string
    tertiary: string
    icon: string
    iconHover: string
  }
  bgColor: {
    primary: string
    secondary: string
    border: string
  }
  handleAudioDownload: () => void
  handleScriptDownload: () => void
  handleContextMenu: (e: React.MouseEvent, url: string, type: string) => void
  copyLink: () => void
}

/**
 * 头部导航组件
 */
const Header = ({
  router,
  podcast,
  textColor,
  bgColor,
  handleAudioDownload,
  handleScriptDownload,
  handleContextMenu,
  copyLink,
}: HeaderProps) => (
  <header className="fixed left-0 right-0 top-0 z-50">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:h-20 sm:px-7">
      <div className="flex items-center gap-2 sm:gap-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.replace("/podcast")}
          className={`h-8 w-8 rounded-full sm:h-10 sm:w-10 hover:${bgColor.secondary} transition-colors duration-200`}
        >
          <ArrowLeft className={`h-4 w-4 ${textColor.icon}`} />
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center"
        >
          <h1
            className={`text-base font-bold sm:text-xl ${textColor.primary} tracking-tight`}
          >
            Memenews Podcast
          </h1>
        </motion.div>
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        {/* 下载音频按钮 */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAudioDownload}
            onContextMenu={(e) =>
              podcast?.mp3_url && handleContextMenu(e, podcast.mp3_url, "音频")
            }
            disabled={!podcast?.mp3_url}
            className={`h-8 w-8 rounded-full sm:h-10 sm:w-10 hover:${bgColor.secondary} group relative transition-colors duration-200 disabled:opacity-50`}
          >
            <Download
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor.icon} group-hover:${textColor.iconHover}`}
            />
            <div className="pointer-events-none absolute -bottom-14 left-1/2 hidden -translate-x-1/2 transform rounded-lg bg-zinc-800/90 px-3 py-1.5 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 sm:block">
              <p className="whitespace-nowrap text-sm text-white/90">
                下载音频
              </p>
            </div>
          </Button>
        </div>

        {/* 下载文稿按钮 */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleScriptDownload}
            onContextMenu={(e) =>
              podcast?.text_url &&
              handleContextMenu(e, podcast.text_url, "文稿")
            }
            disabled={!podcast?.text_url}
            className={`h-8 w-8 rounded-full sm:h-10 sm:w-10 hover:${bgColor.secondary} group relative transition-colors duration-200 disabled:opacity-50`}
          >
            <FileText
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor.icon} group-hover:${textColor.iconHover}`}
            />
            <div className="pointer-events-none absolute -bottom-14 left-1/2 hidden -translate-x-1/2 transform rounded-lg bg-zinc-800/90 px-3 py-1.5 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 sm:block">
              <p className="whitespace-nowrap text-sm text-white/90">
                下载文稿
              </p>
            </div>
          </Button>
        </div>

        {/* 分享链接按钮 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={copyLink}
          className={`h-8 w-8 rounded-full sm:h-10 sm:w-10 hover:${bgColor.secondary} group relative transition-colors duration-200`}
        >
          <Share2
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor.icon} group-hover:${textColor.iconHover}`}
          />
          <div className="pointer-events-none absolute -bottom-14 left-1/2 hidden -translate-x-1/2 transform rounded-lg bg-zinc-800/90 px-3 py-1.5 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 sm:block">
            <p className="whitespace-nowrap text-sm text-white/90">复制链接</p>
          </div>
        </Button>
      </div>
    </div>
  </header>
)

export default Header
