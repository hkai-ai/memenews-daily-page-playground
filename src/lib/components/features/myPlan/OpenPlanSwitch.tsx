"use client"

import { useRequest } from "ahooks"

import { Switch } from "@/lib/components/common/ui/switch"
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { sharePlanAction } from "@/lib/api/plan"
import { cn } from "@/lib/utils"

interface OpenPlanSwitchProps {
  planId: string
  isShared?: boolean
  className?: string
  onSharePlanCallback?: (planId: string) => void
  userId: string
}

/**
 * 渲染一个开关组件，用于切换 meme 的公开/私有状态。
 *
 * @param {string} props.planId - meme 的 ID
 * @param {boolean} props.isShared - 表示 meme 是否已共享
 * @param {string} [props.className] - 开关的CSS类名
 * @param {Function} [props.onSharePlanCallback] - 共享状态改变后要调用的回调函数
 * @returns {JSX.Element} 渲染的开关组件
 */
export function OpenPlanSwitch({
  planId,
  isShared = false,
  className,
  onSharePlanCallback,
  userId,
}: OpenPlanSwitchProps) {
  const { run: sharePlan, loading: loadingSharing } = useRequest(
    sharePlanAction,
    {
      manual: true,
      onSuccess(data) {
        if (data.statusCode === 400) {
          showErrorToast(data.statusText)
          return
        }

        data.data.isShared
          ? showSuccessToast("公开成功")
          : showInfoToast("取消公开成功")

        onSharePlanCallback?.(planId)
      },
      onError(error: any) {
        showErrorToast(`操作失败：${error.message.statusText}`)
      },
    },
  )

  return (
    <Switch
      disabled={loadingSharing}
      checked={isShared}
      className={cn(
        "h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 [&_span]:data-[state=checked]:translate-x-2 rtl:[&_span]:data-[state=checked]:-translate-x-2",
        className,
      )}
      onCheckedChange={(checked) =>
        sharePlan({
          planId: planId,
          isShared: checked,
          userId,
        })
      }
    />
  )
}
