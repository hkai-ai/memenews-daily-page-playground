"use client"

import Link from "next/link"

import { Button } from "../../common/ui/button"
import { showInfoToast } from "../../common/ui/toast"

import { SITE_URL } from "@/config"
import { formatNumber } from "@/utils/format"

interface DailyPageFooterProps {
  id: string
  title: string
  noContent: boolean
  shareCount: string
  views: number
}

export function DailyPageFooter({
  id,
  title,
  noContent,
  shareCount,
  views,
}: DailyPageFooterProps) {
  return (
    <footer className="mt-6 flex w-full flex-col justify-center gap-6 border-t pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-red-500">
              {shareCount}
            </span>
            <span className="text-gray-500">SHARES</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-700">
              {formatNumber(views)}
            </span>
            <span className="text-gray-500">VIEWS</span>
          </div>
        </div>

        {/* <ShareDaily id={id} title={title} /> */}
      </div>
      <div className="mb-6 space-y-2 text-sm text-primary/70">
        <p className="font-bold text-primary">感谢您的阅读！</p>
        <p>
          对内容有反馈？
          <a
            href="#"
            onClick={() => showInfoToast("开发中")}
            className="text-blue-500 hover:underline"
          >
            意见修改订阅偏好链接
          </a>
        </p>
        <p>
          想要更多精彩内容？查看更多 meme：
          <a
            href={`${SITE_URL}/meme`}
            className="text-blue-500 hover:underline"
          >
            探索 meme
          </a>
        </p>
        <p>
          有任何问题？联系我们：
          <a
            href="mailto:official@hkai.ai"
            onClick={() => showInfoToast("开发中")}
            className="text-blue-500 hover:underline"
          >
            official@hkai.ai
          </a>
        </p>
      </div>
      <span className="mb-6 text-right text-gray-500">源于：Memenews</span>
      <Button
        variant="secondary"
        className="mx-auto mb-16 w-fit px-8 py-2"
        asChild
      >
        <Link href="/home">回到首页</Link>
      </Button>
    </footer>
  )
}
