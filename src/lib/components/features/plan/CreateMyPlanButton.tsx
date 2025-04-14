"use client"

import { Baby, PlusCircle, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { HintTip } from "../../common/ui/hint-tip"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/lib/components/common/ui/dialog"
import { Button, ButtonProps } from "@/lib/components/common/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/common/ui/dropdown-menu"
import { useCreatePlanStore } from "@/lib/store/createPlan"
import { cn } from "@/lib/utils"

export function CreateMyPlanButton({
  className,
  align = "end",
  variant = "default",
}: {
  className?: string
  align?: "center" | "start" | "end"
  variant?: ButtonProps["variant"]
}) {
  const router = useRouter()
  const { reset, setIsFree, isFree } = useCreatePlanStore()
  const [open, setOpen] = useState(false)

  const handleCreatePlan = (isFree: boolean) => {
    reset()

    setIsFree(isFree)

    router.push("/memes/create?mode=flow")
  }

  console.log(isFree)
  const handleFlowMode = () => {
    router.push("/memes/create?mode=flow")
    setOpen(false)
  }

  const handleExpertMode = () => {
    router.push("/memes/create?mode=expert")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id="intro-plan-create"
            variant={variant}
            className={className}
          >
            <div className="ml-auto flex w-fit select-none items-center gap-2">
              <PlusCircle className="size-4" />
              <span className="hidden md:block">创建我的 meme</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className={cn(
            "flex min-w-[200px] flex-row gap-2 p-1",
            "rounded-md border-none bg-transparent shadow-none",
          )}
        >
          <DropdownMenuItem
            onClick={() => handleCreatePlan(true)}
            className="flex-1 justify-center focus:bg-inherit focus:text-inherit"
          >
            <HintTip
              className="max-w-sm"
              label="信息源管理支持添加20个以内信息源，含RSS、公众号（5个）、微博（10个）和推特；可通过链接分享，有基础过滤和简洁呈现，完全免费。"
              side="bottom"
            >
              <Button
                variant="secondary"
                className="from-free-from/80 to-free-to/80 flex w-full items-center gap-2 bg-gradient-to-tr text-primary-foreground shadow-md"
              >
                <Baby className="size-4" />
                基础版
              </Button>
            </HintTip>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleCreatePlan(false)}
            className="flex-1 justify-center focus:bg-inherit focus:text-inherit"
          >
            <HintTip
              side="bottom"
              className="max-w-sm"
              label="专注特定行业，有100 +精选信息源；采用先进算法进行智能聚合和内容排序；提供个性化定制和增值服务，如周报生成和播客功能"
            >
              <Button className="from-pro-from to-pro-to text-pro-text flex w-full items-center gap-2 bg-gradient-to-r shadow-md">
                <Rocket className="size-4" />
                进阶版
              </Button>
            </HintTip>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>选择创建模式</DialogTitle>
          <DialogDescription>请选择适合您的创建方式</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleFlowMode} variant="outline" className="w-full">
            流程引导模式
          </Button>
          <Button
            onClick={handleExpertMode}
            variant="outline"
            className="w-full"
          >
            专家模式
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
