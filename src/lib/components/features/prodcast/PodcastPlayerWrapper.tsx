"use client"

import React, { useEffect } from "react"
import { usePathname } from "next/navigation"

import MiniPlayer from "@/lib/components/features/prodcast/MiniPlayer"
import FloatingPlayer from "@/lib/components/features/prodcast/FloatingPlayer"
import CollapsedPlayer from "@/lib/components/features/prodcast/CollapsedPlayer"
import { usePlayerDisplay } from "@/lib/components/features/prodcast/PlayerContext"
import { usePodcast } from "@/lib/context/podcast/PodcastContext"
const PodcastPlayerWrapper: React.FC = () => {
  const { displayMode, showMiniPlayer } = usePlayerDisplay()
  const { currentPodcast } = usePodcast()
  const pathname = usePathname()

  // 如果没有播客数据，不显示任何播放器
  if (!currentPodcast) {
    return null
  }

  // 如果是播客详情页，不显示播放器
  if (pathname && pathname.startsWith("/podcast/") && pathname.length > 9) {
    return null
  }

  // 根据显示模式渲染不同的播放器
  switch (displayMode) {
    case "mini":
      return <MiniPlayer />
    case "floating":
      return <FloatingPlayer onClose={showMiniPlayer} />
    case "collapsed":
      return <CollapsedPlayer />
    case "hidden":
    default:
      return null
  }
}

export default PodcastPlayerWrapper
