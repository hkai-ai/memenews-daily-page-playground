"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { QRCodeCanvas } from "qrcode.react"

import { Button } from "../../common/ui/button"
import { Icons } from "../../common/icon/index"
import { Input } from "../../common/ui/input"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "../../common/ui/dialog"
import { showSuccessToast } from "../../common/ui/toast"

import { SITE_URL } from "@/config"
import { getDailyDetailByIdAction } from "@/lib/api/daily"

export function ShareDailyDialog({
  getDailyDetailQuery,
  slug,
}: {
  getDailyDetailQuery: Awaited<ReturnType<typeof getDailyDetailByIdAction>>
  slug: string
}) {
  const dailyDetail = getDailyDetailQuery.data
  const qrRef = useRef<HTMLCanvasElement>(null)
  const [isQrOpen, setIsQrOpen] = useState(false)

  const ShareWechatQrCode = () => {
    const [showQr, setShowQr] = useState(false)
    const qrContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          qrContainerRef.current &&
          !qrContainerRef.current.contains(event.target as Node)
        ) {
          setShowQr(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
      <div className="relative">
        <Button
          variant="outline"
          className="hover:bg-current/50 flex items-center gap-2 bg-green-600 text-xs text-primary-foreground hover:text-primary-foreground"
          onClick={() => setShowQr(!showQr)}
        >
          <Icons.wechat className="size-3.5" />
          分享至微信
        </Button>

        {showQr && (
          <div
            ref={qrContainerRef}
            className="absolute left-1/2 top-[calc(100%+8px)] z-50 -translate-x-1/2 transform"
          >
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <QRCodeCanvas
                ref={qrRef}
                value={window.location.href}
                size={150}
              />
              <p className="mt-2 text-center text-sm text-gray-600">
                扫描二维码分享
              </p>
            </div>
            <div
              className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border bg-white shadow-lg"
              style={{ zIndex: -1 }}
            />
          </div>
        )}
      </div>
    )
  }

  const ShareWeiboButton = () => (
    <Button
      variant="outline"
      className="hover:bg-current/50 flex items-center gap-2 bg-[#4F6DA8] text-xs text-primary-foreground hover:text-primary-foreground"
      asChild
    >
      <Link
        href={`http://service.weibo.com/share/share.php?url=https://http://${SITE_URL}/daily/${dailyDetail.id}&title=${dailyDetail.title}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icons.weibo className="inline size-3.5" />
        分享至微博
      </Link>
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer space-y-3 text-center">
          <Icons.share className="size-12 rounded-full p-4" aria-label="分享" />
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-none p-0">
        <DialogHeader></DialogHeader>
        <div className="p-4">
          <div className="flex gap-2">
            <ShareWechatQrCode />
            <ShareWeiboButton />
          </div>

          <div className="mt-4 flex h-11">
            <Input
              placeholder="请输入分享的标题"
              className="h-full w-full flex-1 rounded-none border-none bg-gray-100"
              value={`${SITE_URL}/daily/${slug}`}
              disabled
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`${SITE_URL}/daily/${slug}`)
                showSuccessToast("复制成功")
              }}
              size="icon"
              className="h-full w-11 rounded-none"
            >
              <Icons.copy className="size-3" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
