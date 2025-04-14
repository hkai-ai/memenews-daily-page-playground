"use client"

import { Copy, Check, Loader2 } from "lucide-react"
import { useRequest } from "ahooks"
import { useState } from "react"

import { showErrorToast } from "../../common/ui/toast"

import { ChannelName } from "@/types/channel/model"
import { Button, ButtonProps } from "@/lib/components/common/ui/button"
import { clonePlanAction } from "@/lib/api/plan"
import { delay } from "@/utils"
import { cn } from "@/lib/utils"

export function ClonePlanButton({
  className,
  defaultValue,
  userId,
  size = "default",
  onClonePlanSuccessCallback,
}: {
  className?: string
  size?: ButtonProps["size"]
  defaultValue: {
    planId: string
    isRemake: boolean
    planName: string
    planAvatarUrl: string
    planDescription: string
    planTags: { tagColor: string; tagName: string }[]
    planSourceId: string
    subscribeSource: number[]
    domain: string
    channel: { name: ChannelName; address: string }[]
  }
  userId: string
  onClonePlanSuccessCallback?: (
    plan: Awaited<ReturnType<typeof clonePlanAction>>["data"],
  ) => void
}) {
  const [cloneSuccess, setCloneSuccess] = useState(false)

  const { run: clonePlan, loading: loadingClonePlan } = useRequest(
    clonePlanAction,
    {
      manual: true,
      ready: !!userId,
      async onSuccess(data) {
        setCloneSuccess(true)
        await delay(1000)
        onClonePlanSuccessCallback?.(data.data)
        setCloneSuccess(false)
      },
      onError(error: any) {
        showErrorToast(`创建 meme 失败：${error.message.statusText}`)
      },
    },
  )

  return (
    <Button
      size={size}
      variant={cloneSuccess ? "success" : "ghost"}
      disabled={cloneSuccess || loadingClonePlan}
      className={cn("justify-start gap-2", className)}
      onClick={() =>
        clonePlan({
          ...defaultValue,
          userId,
          planId: "",
          planName: `${defaultValue.planName} copy`,
          // @todo 找后端加字段
          isShared: false,
          personalInfoSource: [],
          isRemake: defaultValue.isRemake,
        })
      }
    >
      {loadingClonePlan ? (
        <Loader2 className="size-4 animate-spin" />
      ) : cloneSuccess ? (
        <Check className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
      {loadingClonePlan ? "克隆中" : cloneSuccess ? "克隆成功" : "克隆"}
    </Button>
  )
}
