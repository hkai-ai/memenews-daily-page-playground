"use client"

import { Copy, Check, X, Facebook, Twitter } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/lib/components/common/ui/button"
import { Input } from "@/lib/components/common/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/lib/components/common/ui/dialog"
import Notification from "@/lib/components/features/prodcast/Notifacation"

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
  description?: string
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shareUrl: string
  podcast: PodcastData | null
}

// 分享对话框组件
const ShareDialog = ({
  open,
  onOpenChange,
  shareUrl,
  podcast,
}: ShareDialogProps) => {
  const [localIsCopied, setLocalIsCopied] = useState(false)
  const [wechatCopied, setWechatCopied] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // 通用复制函数
  const copyText = () => {
    // 先获取输入框元素
    const inputElement = document.getElementById("link") as HTMLInputElement
    if (!inputElement) {
      console.error("找不到输入框元素")
      return false
    }

    try {
      // 选中输入框的文本
      inputElement.select()
      // 直接复制选中的文本
      document.execCommand("copy")
      // 取消选中状态
      window.getSelection()?.removeAllRanges()
      return true
    } catch (err) {
      console.error("复制失败:", err)
      return false
    }
  }

  // 处理复制按钮点击
  const handleLocalCopy = () => {
    if (copyText()) {
      setLocalIsCopied(true)
      setTimeout(() => setLocalIsCopied(false), 2000)
    }
  }

  // 处理微信分享
  const handleLocalWechatShare = () => {
    if (copyText()) {
      setWechatCopied(true)
      setNotification("由于微信限制，链接已复制，请打开微信手动分享哟~")
      setTimeout(() => {
        setWechatCopied(false)
        setNotification(null)
      }, 2000)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="mt-2 max-w-[90%] rounded-xl border-black/5 bg-white/95 p-4 shadow-[0_0_30px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:max-w-lg sm:p-6">
          {/* 标题区域 */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <DialogTitle className="mb-2 text-lg font-bold text-black/80 sm:text-xl">
                分享播客
              </DialogTitle>
              <DialogDescription className="text-xs text-black/50 sm:text-sm">
                将此播客分享给朋友
              </DialogDescription>
            </div>
          </div>

          {/* 分享内容预览 */}
          <div className="rounded-lg border border-black/5 bg-black/[0.02] p-3">
            <div className="flex items-center gap-3">
              {podcast?.image?.memenew && (
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md sm:h-14 sm:w-14">
                  <img
                    src={podcast.image.memenew}
                    alt={podcast.title || ""}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold font-medium text-black/80 sm:text-base">
                  {podcast?.title || "Memenews播客"}
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-black/50">
                  {podcast?.data?.username}・{podcast?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* 链接复制区域 */}
            <div className="rounded-lg border border-black/5 bg-black/[0.02] p-3 sm:p-4">
              <p className="mb-2 text-xs text-black/40">分享播客链接</p>
              <div className="flex items-center space-x-2">
                <Input
                  id="link"
                  value={shareUrl}
                  readOnly
                  className="h-9 select-none border-black/5 bg-white/80 text-xs text-black/70 focus-visible:ring-purple-500/20 sm:h-10 sm:text-sm"
                />
                <Button
                  onClick={handleLocalCopy}
                  size="sm"
                  className={cn(
                    "h-9 border-none bg-black/5 px-3 text-black/60 transition-all duration-300 hover:bg-black/10 sm:h-10",
                    localIsCopied &&
                      "bg-green-500/10 text-green-600 hover:bg-green-500/20",
                  )}
                >
                  {localIsCopied ? (
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="text-xs">成功</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="text-xs">复制</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* 社交分享区域 */}
            <div className="rounded-lg border border-black/5 bg-black/[0.02] p-3 sm:p-4">
              <p className="mb-3 text-xs text-black/40">分享到社交媒体</p>
              <div className="grid grid-cols-3 gap-2">
                {/* QQ */}
                <Button
                  variant="ghost"
                  className="flex h-14 flex-col items-center justify-center space-y-1 rounded-lg bg-black/[0.02] p-0 text-black/50 hover:bg-black/[0.05] hover:text-black/70 sm:h-16"
                  onClick={() => {
                    const title = podcast?.title
                      ? `正在收听: ${podcast.title}`
                      : "正在收听: Memenews播客"
                    const summary = podcast?.description || ""
                    const imageUrl = podcast?.image?.memenew || ""

                    const shareLink = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURI(shareUrl)}&title=${encodeURI(title)}&desc=${encodeURI(summary)}&summary=${encodeURI(summary)}&site=Memenews&pics=${encodeURI(imageUrl)}`

                    window.open(shareLink, "_blank")
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-4 w-4 sm:h-6 sm:w-6"
                  >
                    <path
                      fill="#FFC107"
                      d="M17.5,44c-3.6,0-6.5-1.6-6.5-3.5s2.9-3.5,6.5-3.5s6.5,1.6,6.5,3.5S21.1,44,17.5,44z M37,40.5c0-1.9-2.9-3.5-6.5-3.5S24,38.6,24,40.5s2.9,3.5,6.5,3.5S37,42.4,37,40.5z"
                    />
                    <path
                      fill="#37474F"
                      d="M37.2,22.2c-0.1-0.3-0.2-0.6-0.3-1c0.1-0.5,0.1-1,0.1-1.5c0-1.4-0.1-2.6-0.1-3.6C36.9,9.4,31.1,4,24,4S11,9.4,11,16.1c0,0.9,0,2.2,0,3.6c0,0.5,0,1,0.1,1.5c-0.1,0.3-0.2,0.6-0.3,1c-1.9,2.7-3.8,6-3.8,8.5C7,35.5,8.4,35,8.4,35c0.6,0,1.6-1,2.5-2.1C13,38.8,18,43,24,43s11-4.2,13.1-10.1C38,34,39,35,39.6,35c0,0,1.4,0.5,1.4-4.3C41,28.2,39.1,24.8,37.2,22.2z"
                    />
                    <path
                      fill="#ECEFF1"
                      d="M14.7,23c-0.5,1.5-0.7,3.1-0.7,4.8C14,35.1,18.5,41,24,41s10-5.9,10-13.2c0-1.7-0.3-3.3-0.7-4.8H14.7z"
                    />
                    <path
                      fill="#FFF"
                      d="M23,13.5c0,1.9-1.1,3.5-2.5,3.5S18,15.4,18,13.5s1.1-3.5,2.5-3.5S23,11.6,23,13.5z M27.5,10c-1.4,0-2.5,1.6-2.5,3.5s1.1,3.5,2.5,3.5s2.5-1.6,2.5-3.5S28.9,10,27.5,10z"
                    />
                    <path
                      fill="#37474F"
                      d="M22,13.5c0,0.8-0.4,1.5-1,1.5s-1-0.7-1-1.5s0.4-1.5,1-1.5S22,12.7,22,13.5z M27,12c-0.6,0-1,0.7-1,1.5s0.4-0.5,1-0.5s1,1.3,1,0.5S27.6,12,27,12z"
                    />
                    <path
                      fill="#FFC107"
                      d="M32,19.5c0,0.8-3.6,2.5-8,2.5s-8-1.7-8-2.5s3.6-1.5,8-1.5S32,18.7,32,19.5z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M38.7,21.2c-0.4-1.5-1-2.2-2.1-1.3c0,0-5.9,3.1-12.5,3.1v0.1l0-0.1c-6.6,0-12.5-3.1-12.5-3.1c-1.1-0.8-1.7-0.2-2.1,1.3c-0.4,1.5-0.7,2,0.7,2.8c0.1,0.1,1.4,0.8,3.4,1.7c-0.6,3.5-0.5,6.8-0.5,7c0.1,1.5,1.3,1.3,2.9,1.3c1.6-0.1,2.9,0,2.9-1.6c0-0.9,0-2.9,0.3-5c1.6,0.3,3.2,0.6,5,0.6l0,0v0c7.3,0,13.7-3.9,13.9-4C39.3,23.3,39,22.8,38.7,21.2z"
                    />
                    <path
                      fill="#DD2C00"
                      d="M13.2,27.7c1.6,0.6,3.5,1.3,5.6,1.7c0-0.6,0.1-1.3,0.2-2c-2.1-0.5-4-1.1-5.5-1.7C13.4,26.4,13.3,27.1,13.2,27.7z"
                    />
                  </svg>
                  <span className="text-[10px] sm:text-xs">QQ</span>
                </Button>

                {/* 微信 */}
                <Button
                  variant="ghost"
                  className={cn(
                    "flex h-14 flex-col items-center justify-center space-y-1 rounded-lg bg-black/[0.02] p-0 text-black/50 hover:bg-black/[0.05] hover:text-black/70 sm:h-16",
                    wechatCopied &&
                      "bg-green-500/10 text-green-600 hover:bg-green-500/20",
                  )}
                  onClick={handleLocalWechatShare}
                >
                  {wechatCopied ? (
                    <div className="flex flex-col items-center space-y-1">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-[10px] sm:text-xs">已复制</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path
                          fill="#8BC34A"
                          d="M18,6C9.2,6,2,12,2,19.5c0,4.3,2.3,8,6,10.5l-2,6l6.3-3.9C14,32.7,16,33,18,33c8.8,0,16-6,16-13.5C34,12,26.8,6,18,6z"
                        />
                        <path
                          fill="#7CB342"
                          d="M20,29c0-6.1,5.8-11,13-11c0.3,0,0.6,0,0.9,0c-0.1-0.7-0.3-1.4-0.5-2c-0.1,0-0.3,0-0.4,0c-8.3,0-15,5.8-15,13c0,1.4,0.3,2.7,0.7,4c0.7,0,1.4-0.1,2.1-0.2C20.3,31.6,20,30.3,20,29z"
                        />
                        <path
                          fill="#CFD8DC"
                          d="M46,29c0-6.1-5.8-11-13-11c-7.2,0-13,4.9-13,11s5.8,11,13,11c1.8,0,3.5-0.3,5-0.8l5,2.8l-1.4-4.8C44.3,35.2,46,32.3,46,29z"
                        />
                        <path
                          fill="#33691E"
                          d="M14,15c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S14,13.9,14,15z M24,13c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S25.1,13,24,13z"
                        />
                        <path
                          fill="#546E7A"
                          d="M30,26.5c0,0.8-0.7,1.5-1.5,1.5S27,27.3,27,26.5s0.7-1.5,1.5-1.5S30,25.7,30,26.5z M37.5,25c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S38.3,25,37.5,25z"
                        />
                      </svg>
                      <span className="text-[10px] sm:text-xs">微信</span>
                    </>
                  )}
                </Button>

                {/* 微博 */}
                <Button
                  variant="ghost"
                  className="flex h-14 flex-col items-center justify-center space-y-1 rounded-lg bg-black/[0.02] p-0 text-black/50 hover:bg-black/[0.05] hover:text-black/70 sm:h-16"
                  onClick={() =>
                    window.open(
                      `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`正在收听: ${podcast?.title || "Memenews播客"}`)}`,
                      "_blank",
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  >
                    <path
                      fill="#FFF"
                      d="M34,29c-0.6-5.8-7.6-9.8-16-8.9c-4.9,0.5-9.4,2.6-11.9,5.6C4.5,27.6,3.8,29.8,4,32c0.5,5.3,6.4,9,13.8,9c0.7,0,1.4,0,2.2-0.1c4.9-0.5,9.4-2.6,11.9-5.6C33.5,33.4,34.2,31.2,34,29z"
                    ></path>
                    <path
                      fill="#D32F2F"
                      d="M19.8,38.9C12.7,39.6,6.5,36.4,6,31.8c-0.5-4.6,5-9,12.1-9.7c7.2-0.7,13.3,2.5,13.8,7.1C32.4,33.9,27,38.2,19.8,38.9 M34.7,23.9c-0.6-0.2-1-0.3-0.7-1.1c0.7-1.7,0.8-3.2,0-4.3c-1.4-2-5.3-1.9-9.7-0.1c0,0-1.4,0.6-1-0.5c0.7-2.2,0.6-4-0.5-5C20.4,10.5,14,13,8.5,18.4C4.4,22.5,2,26.8,2,30.5C2,37.7,11.2,42,20.3,42C32.1,42,40,35.2,40,29.8C40,26.5,37.2,24.7,34.7,23.9"
                    ></path>
                    <path
                      fill="#263238"
                      d="M20.9,30.4c-0.3,0.5-0.9,0.8-1.4,0.6c-0.5-0.2-0.6-0.8-0.4-1.3c0.3-0.5,0.9-0.8,1.3-0.5C21,29.3,21.1,29.8,20.9,30.4 M17.6,32.8c-0.7,1-2.3,1.5-3.5,1c-1.2-0.5-1.5-1.7-0.8-2.6c0.7-1,2.2-1.4,3.4-1C18,30.6,18.4,31.8,17.6,32.8 M20.5,25.2c-3.5-0.9-7.4,0.8-8.9,3.8c-1.5,3.1-0.1,6.5,3.5,7.6c3.6,1.2,7.9-0.6,9.4-3.9C26,29.5,24.1,26.1,20.5,25.2"
                    ></path>
                    <path
                      fill="#F9A825"
                      d="M43.9 20A1.5 1.5 0 1 0 43.9 23A1.5 1.5 0 1 0 43.9 20Z"
                    ></path>
                    <path
                      fill="#F9A825"
                      d="M45.3,22C45.3,22,45.3,22,45.3,22c-0.2,0.6-0.8,1-1.4,1c-0.8,0-1.5-0.7-1.5-1.5c0-0.2,0-0.4,0.1-0.6C42.8,20,43,19,43,18c0-5-4-9-9-9c-0.4,0-0.9,0-1.3,0.1c0,0,0,0-0.1,0c0,0-0.1,0-0.1,0c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5c0,0,0,0,0,0C33,6,33.5,6,34,6c6.6,0,12,5.4,12,12C46,19.4,45.8,20.7,45.3,22z M40,18c0-3.3-2.7-6-6-6c-0.2,0-0.4,0-0.7,0c0,0,0,0-0.1,0c-0.7,0.1-1.3,0.7-1.3,1.5c0,0.8,0.7,1.5,1.5,1.5c0,0,0.1,0,0.1,0c0,0,0,0,0,0c0.1,0,0.3,0,0.4,0c1.7,0,3,1.3,3,3c0,0.3-0.1,0.7-0.2,1c0,0,0,0,0,0c-0.1,0.2-0.1,0.3-0.1,0.5c0,0.8,0.7,1.5,1.5,1.5c0.6,0,1.1-0.4,1.4-0.9c0,0,0,0,0,0c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0.1-0.2C39.9,19.2,40,18.6,40,18z"
                    ></path>
                  </svg>
                  <span className="text-[10px] sm:text-xs">微博</span>
                </Button>

                {/* Telegram */}
                <Button
                  variant="ghost"
                  className="flex h-14 flex-col items-center justify-center space-y-1 rounded-lg bg-black/[0.02] p-0 text-black/50 hover:bg-black/[0.05] hover:text-black/70 sm:h-16"
                  onClick={() =>
                    window.open(
                      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`正在收听: ${podcast?.title || "Memenews播客"}`)}`,
                      "_blank",
                    )
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.056-.056-.212s-.041-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.12.13.145.309.157.401-.002.068.005.157-.012.359z" />
                  </svg>
                  <span className="text-[10px] sm:text-xs">Telegram</span>
                </Button>

                {/* Twitter */}
                <Button
                  variant="ghost"
                  className="flex h-14 flex-col items-center justify-center space-y-1 rounded-lg bg-black/[0.02] p-0 text-black/50 hover:bg-black/[0.05] hover:text-black/70 sm:h-16"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`正在收听: ${podcast?.title || "Memenews播客"}`)}`,
                      "_blank",
                    )
                  }
                >
                  <Twitter className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
                  <span className="text-[10px] sm:text-xs">Twitter</span>
                </Button>

                {/* Facebook */}
                <Button
                  variant="ghost"
                  className="flex h-14 flex-col items-center justify-center space-y-1 rounded-lg bg-black/[0.02] p-0 text-black/50 hover:bg-black/[0.05] hover:text-black/70 sm:h-16"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                      "_blank",
                    )
                  }
                >
                  <Facebook className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
                  <span className="text-[10px] sm:text-xs">Facebook</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Notification message={notification} />
    </>
  )
}

export default ShareDialog
