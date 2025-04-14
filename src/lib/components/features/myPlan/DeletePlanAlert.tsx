"use client"

import { useRequest } from "ahooks"
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"

import { deletePlanAction } from "@/lib/api/plan/delete-plan"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/lib/components/common/ui/alert-dialog"
import { Button, ButtonProps } from "@/lib/components/common/ui/button"
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { cn } from "@/lib/utils"

interface DeletePlanAlertProps {
  planId: string
  planName: string
  className?: string
  size?: ButtonProps["size"]
  onSuccessDeleteCallback?: (planId: string) => void
  userId: string
}

export function DeletePlanAlert({
  planId,
  size = "default",
  planName,
  className,
  onSuccessDeleteCallback,
  userId,
}: DeletePlanAlertProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { run: deletePlan, loading: loadingDeletePlan } = useRequest(
    deletePlanAction,
    {
      manual: true,
      ready: !!planId,
      onSuccess: () => {
        onSuccessDeleteCallback?.(planId)
        showSuccessToast("删除成功")
      },
      onError: (error: any) => {
        showErrorToast(`删除失败，请稍后再试：${error.message.statusText}`)
      },
      onFinally: () => {
        setDialogOpen(false)
      },
    },
  )

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size={size}
          variant="destructive"
          className={cn(
            "w-full gap-2 bg-primary-foreground text-destructive-foreground hover:bg-destructive/10",
            className,
          )}
        >
          <Trash className="size-4" /> 删除该 meme
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            确认要删除 meme：「{planName}」吗？
          </AlertDialogTitle>
          <AlertDialogDescription>
            ⚠️请注意，删除后，该 meme 的所有数据将被永久删除，且无法恢复！
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loadingDeletePlan} className="px-8">
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loadingDeletePlan}
            onClick={() => deletePlan({ planIds: [planId], userId })}
            className="bg-red-500 px-8 hover:bg-red-400"
          >
            {loadingDeletePlan ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                删除中...
              </>
            ) : (
              "确认"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
