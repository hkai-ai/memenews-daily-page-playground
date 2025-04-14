"use client"

import { LockKeyhole, Globe } from "lucide-react"
import { useRequest } from "ahooks"

import { LoadingSkeleton } from "@/lib/components/common/ui/loading-skeleton"
import { Button, ButtonProps } from "@/lib/components/common/ui/button"
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { sharePlanAction } from "@/lib/api/plan"
import { cn } from "@/lib/utils"

interface OpenPlanButtonProps {
  planId: string
  isShared?: boolean
  variant?: ButtonProps["variant"]
  className?: string
  onSharePlanCallback?: (planId: string) => void
  userId: string
}

/**
 * 渲染一个按钮组件，用于公开或私有 meme。
 *
 * @param {string} props.planId - meme 的 ID。
 * @param {boolean} props.isShared - 表示 meme 是否已共享。
 * @param {string} [props.variant="outline"] - 按钮的变体。
 * @param {string} [props.className] - 按钮的CSS类名。
 * @param {Function} [props.onSharePlanCallback] - 共享 meme 后要调用的回调函数。
 * @returns {JSX.Element} 渲染的按钮组件。
 */
export function OpenPlanButton({
  planId,
  isShared = false,
  variant = "outline",
  className,
  onSharePlanCallback,
  userId,
}: OpenPlanButtonProps) {
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
        showErrorToast(`公开失败：${error.message.statusText}`)
      },
    },
  )

  return (
    <Button
      variant={variant}
      disabled={loadingSharing}
      className={cn("gap-2", className)}
      onClick={() =>
        sharePlan({
          planId: planId,
          isShared: !isShared,
          userId: userId,
        })
      }
    >
      {isShared ? (
        <>
          {loadingSharing ? (
            <LoadingSkeleton>取消中</LoadingSkeleton>
          ) : (
            <>
              <LockKeyhole className="size-4" />
              取消公开
            </>
          )}
        </>
      ) : (
        <>
          {loadingSharing ? (
            <LoadingSkeleton>公开中</LoadingSkeleton>
          ) : (
            <>
              <Globe
                className={cn("size-3.5", isShared ? "text-sky-500" : "")}
              />
              公开
            </>
          )}
        </>
      )}
    </Button>
  )
}
