"use client"
import * as React from "react"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"
import { useRequest } from "ahooks"
import { QRCodeSVG } from "qrcode.react"

import { Icons } from "../../common/icon"
import { Skeleton } from "../../common/ui/skeleton"

import { WechatState } from "./AddChannelDialog"

import { getWechatUserlinkCallbackAction } from "@/lib/api/channel/get-wechat-userlink-callback"
import { getWechatServiceStateQrcodeAction } from "@/lib/api/channel/get-wechat-service-state-qrccode"

export function WechatServiceCard({ userId }: { userId: string }) {
  const [wechatState, setWechatState] = useState<WechatState | null>(null)
  const { loading, run: getWechatState } = useRequest(
    () => getWechatServiceStateQrcodeAction({ userId }),
    {
      onSuccess: (data) => {
        setWechatState(data.data)
      },
    },
  )
  const { run: checkWechatCallback } = useRequest(
    () => getWechatUserlinkCallbackAction({ userId }),
    {
      manual: true,
      pollingInterval: 3000,
      pollingWhenHidden: false,
      ready: !wechatState?.isBound,
      onSuccess: (data) => {
        if (data.statusCode === 200) {
          getWechatState()
        }
      },
    },
  )
  useEffect(() => {
    if (userId) {
      getWechatState()
    }
  }, [userId])
  useEffect(() => {
    if (userId && wechatState?.qrCode && !wechatState?.isBound) {
      checkWechatCallback()
    }
  }, [userId, wechatState])

  return (
    <div
      className={`rounded-lg ${wechatState?.isBound ? "w-full p-0" : "aspect-square w-40 p-4"}`}
    >
      {wechatState?.isBound ? (
        // Bound account - Microsoft-inspired style with subtle background and dark mode support
        <div className="mb-5 flex flex-col items-center justify-center">
          <div className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                <Icons.wechat className="size-6 fill-green-500 dark:fill-green-400" />
              </div>
              <span className="text-sm text-foreground">
                {wechatState.userName || "用户已连接"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-green-600 dark:bg-green-900 dark:text-green-400">
              <Check className="size-4" />
              <span className="text-sm font-medium">已激活</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="size-[160px] rounded">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    请扫描二维码进行激活
                  </p>
                </div>
              ) : wechatState?.qrCode ? (
                <div className="flex flex-col items-center gap-2">
                  <QRCodeSVG
                    value={wechatState.qrCode.url}
                    size={160}
                    level="H"
                    className="dark:rounded dark:bg-white dark:p-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    请扫描二维码进行激活
                  </p>
                </div>
              ) : (
                <span>未激活</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
