"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/lib/components/common/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/common/ui/dialog"
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { Input } from "@/lib/components/common/ui/input"
import {
  sendAccountEmailValidation,
  sendInfoChannelEmailValidation,
  verifyIsEmailExisted,
} from "@/lib/serverAction/email"

interface EmailSettingDialogProps {
  /**
   * 对话框是否被打开
   */
  isOpened: boolean
  /**
   * 设置对话框是否被打开
   */
  setIsOpened: (isOpened: boolean) => void
  /**
   * 当前用户ID
   */
  userId: string
  /**
   * 当前邮箱地址
   */
  email?: string | null
  /**
   * 邮箱是否已验证
   */
  isEmailVerified: boolean
  /**
   * 验证类型
   */
  validationType: "accountEmailValidation" | "infoChannelEmailValidation"
}

/**
 * 邮箱设置对话框
 */
export function EmailSettingDialog({
  isOpened,
  setIsOpened,
  userId,
  email,
  isEmailVerified,
  validationType = "accountEmailValidation",
}: EmailSettingDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [emailInput, setEmailInput] = useState(email ?? "")

  /**
   * 处理邮箱验证请求
   */
  const handleEmailValidation = async () => {
    if (!userId || userId === "") {
      showErrorToast("用户信息获取失败")
      return
    }

    if (!email && !emailInput) {
      showErrorToast("请输入邮箱地址")
      return
    }

    /**
     * 如果初始化时没有邮箱地址，则需要验证邮箱是否已存在且被绑定
     * @note 虽然说，这个组件在验证推送渠道复用的时候因为输入总会有 email ，所以不会触发该逻辑，但感觉还是怪怪的。
     */
    if (
      (!email || email === "") &&
      validationType === "accountEmailValidation"
    ) {
      try {
        const res = await verifyIsEmailExisted(emailInput)
        if (!res.success) {
          showErrorToast(res.error as string)
          return
        }

        if (res.isEmailExist) {
          showErrorToast("该邮箱地址已存在在已有账号列表中，😭请换一个邮箱~")
          return
        }
      } catch (error) {
        showErrorToast("验证邮箱地址是否存在时失败")
      } finally {
        setIsLoading(false)
      }
    }

    if (email === "" && validationType === "infoChannelEmailValidation") {
      showErrorToast("请输入邮箱地址")
      return
    }

    setIsLoading(true)
    showInfoToast("正在发送验证邮件...")

    try {
      const result =
        validationType === "accountEmailValidation"
          ? await sendAccountEmailValidation(userId, emailInput)
          : await sendInfoChannelEmailValidation(userId, email ?? "")

      if (!result.success) {
        showErrorToast(result.message)
        return
      }

      showSuccessToast("验证邮件已发送，请查收")
      setIsOpened(false)
    } catch (error) {
      console.error(error)
      showErrorToast("操作失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpened} onOpenChange={(open) => setIsOpened(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{email ? "验证邮箱地址" : "设置邮箱地址"}</DialogTitle>
          <DialogDescription>
            {email
              ? "我们将向您的邮箱发送一封验证邮件，请注意查收"
              : "请输入您要绑定的邮箱地址，我们将向该邮箱发送验证邮件"}
          </DialogDescription>
        </DialogHeader>

        {!email && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="email"
                type="email"
                className="col-span-4"
                placeholder="请输入邮箱地址"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="default"
            className="gap-2"
            disabled={isLoading}
            onClick={handleEmailValidation}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                发送中...
              </>
            ) : (
              "发送验证邮件"
            )}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
