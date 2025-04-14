"use client"

import { useState } from "react"
import { useRequest } from "ahooks"

import { LoadingSkeleton } from "@/lib/components/common/ui/loading-skeleton"
import { Button } from "@/lib/components/common/ui/button"
import { Input } from "@/lib/components/common/ui/input"
import {
  showInfoToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { sendSampleMailAction } from "@/lib/api/home"

/**
 * 向该邮箱发送一份示例日报
 */
export function SendEmailForm({ userId }: { userId: string }) {
  const [email, setEmail] = useState("")

  const { run: sendSampleMail, loading: loadingSendSampleEmail } = useRequest(
    sendSampleMailAction,
    {
      manual: true,
      ready: !!email,
      onSuccess: () => showSuccessToast("发送成功"),
      onError: () => showInfoToast("发送失败"),
    },
  )

  return (
    <div className="flex h-10 max-w-xl gap-4 text-sm">
      <Input
        value={email}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        size={32}
        placeholder="输入您的邮箱，接收一篇示例日报"
        className="h-full rounded-lg bg-primary/5 text-sm placeholder:text-sm"
      />
      <Button
        size="sm"
        disabled={loadingSendSampleEmail}
        onClick={() => {
          if (!email.length) return showInfoToast("请输入邮箱")
          sendSampleMail({ email, userId })
        }}
        className="h-full rounded-lg px-8 text-xs"
      >
        {loadingSendSampleEmail ? (
          <LoadingSkeleton>发送中</LoadingSkeleton>
        ) : (
          "发送"
        )}
      </Button>
    </div>
  )
}
