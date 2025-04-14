"use client"

import { Check, FilePen, Save } from "lucide-react"
import { useRequest } from "ahooks"
import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../common/ui/dialog"
import { Button } from "../../common/ui/button"
import { Input } from "../../common/ui/input"
import { Label } from "../../common/ui/label"
import { showErrorToast } from "../../common/ui/toast"
import { LoadingSkeleton } from "../../common/ui/loading-skeleton"

import { updatePlanAction } from "@/lib/api/plan"
import { delay } from "@/utils"

interface RenamePlanDialogProps {
  userId: string
  defaultValue: {
    isRemake: boolean
    planId: string
    planName: string
    planAvatarUrl: string
    planDescription: string
    planTags: { tagColor: string; tagName: string }[]
    planSourceId: string
    subscribeSource: number[]
    domain: string
    channel: { name: string; address: string }[]
  }
  onEditSuccessCallback?: () => void
}

export function RenamePlanDialog({
  userId,
  defaultValue,
  onEditSuccessCallback,
}: RenamePlanDialogProps) {
  const [editSuccess, setEditSuccess] = useState(false)
  const [planName, setPlanName] = useState(defaultValue.planName)
  const [planDescription, setPlanDescription] = useState(
    defaultValue.planDescription,
  )

  const { run: updatePlan, loading: loadingUpdatePlan } = useRequest(
    updatePlanAction,
    {
      manual: true,
      ready: !!userId,
      async onSuccess() {
        setEditSuccess(true)
        await delay(1000)
        onEditSuccessCallback?.()
        setEditSuccess(false)
      },
      onError(error: any) {
        showErrorToast(`编辑 meme 失败：${error.message.statusText}`)
      },
    },
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="justify-start">
          <FilePen className="mr-2 size-4" />
          编辑 meme
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑 meme</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              meme 名称
            </Label>
            <Input
              id="name"
              value={planName}
              defaultValue={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              描述
            </Label>
            <Input
              id="username"
              value={planDescription}
              defaultValue={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            variant={editSuccess ? "success" : "default"}
            disabled={
              loadingUpdatePlan || editSuccess || !planName || !planDescription
            }
            onClick={() => {
              updatePlan({
                ...defaultValue,
                userId,
                planName,
                planDescription,
                personalInfoSource: [],
              })
            }}
          >
            {loadingUpdatePlan ? (
              <LoadingSkeleton>保存中</LoadingSkeleton>
            ) : editSuccess ? (
              <>
                <Check className="mr-2 size-4" />
                保存成功
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                保存
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
