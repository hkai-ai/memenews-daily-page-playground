"use client"

import { signIn, useSession } from "next-auth/react"
import { match } from "ts-pattern"
import { Dispatch, SetStateAction } from "react"
import { Loader2 } from "lucide-react"

import { API_CONTENT_BASE_URL, NEXT_PUBLIC_AUTH_SERVER_URL } from "@/config/api"
import { unlinkThirdPartyToYuansun } from "@/lib/api/account/thirdparty"
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
import request from "@/utils/request"

interface BindAccountAlertDialogProps {
  /**
   * 第三方账号的渠道
   */
  channel: string
  /**
   * 如果是已绑定账号被点击，那么提示框的内容会有所不同
   */
  isBinded: boolean
  /**
   * 对话框是否被打开
   */
  isOpened: boolean
  /**
   * 设置对话框是否被打开
   * 使得子组件可以通过调用该函数来控制对话框的显示与隐藏
   * @param isOpened
   * @returns
   */
  setIsOpened: (isOpened: boolean) => void
  /**
   * 当前登录用户的 uuid
   */
  uuid: string
  /**
   * 当前绑定第三方账户的Id
   */
  recordId: string
  /**
   * 加载状态
   */
  isLoading: boolean
  /**
   * 设置加载状态
   */
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

/**
 * 绑定社交账号的确认框。
 *
 * 该对话确认框由上级组件控制显示与隐藏。
 */
export function BindAccountAlertDialog({
  channel,
  isBinded,
  isOpened,
  setIsOpened,
  uuid,
  recordId,
  isLoading,
  setIsLoading,
}: BindAccountAlertDialogProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const githubSign = async (isBind: boolean) => {
    setIsLoading(true)

    try {
      // 进行解绑
      if (isBind) {
        showInfoToast("正在解绑账号...")
        const res = await unlinkThirdPartyToYuansun({
          recordId: recordId,
          baseUrl: NEXT_PUBLIC_AUTH_SERVER_URL,
          refUserId: uuid,
        })
        if (res.error) {
          showErrorToast(res.message)
          setIsOpened(false)
          return
        }
        showSuccessToast(res.message)
        setIsOpened(false)
        setIsLoading(false)
        window.location.reload()
        return
      }

      showInfoToast("正在绑定账号...")
      /**
       * @mention 如果后面更改了路由，那么这里的callbackUrl也需要更改
       */
      const result = await signIn("github", {
        callbackUrl: "/settings",
        redirect: true,
      })

      if (result?.error === "OAuthCallback" || !result) {
        showErrorToast("该 GitHub 账号可能已被其他账号绑定")
        setIsOpened(false)
        return
      }

      try {
        await request.get({
          url: `/user/profile`,
          params: { userId },
          userId: userId,
        })
      } catch (error) {
        console.error("同步用户资料失败:", error)
      }

      // 如果没有错误，则进行重定向
      window.location.href = result?.url || "/settings"
    } catch (error) {
      console.error(error)
      showErrorToast("操作失败，请稍后重试")
    } finally {
      // setIsLoading(false)
    }
  }

  const wechatSign = async (isBind: boolean) => {
    setIsLoading(true)
    try {
      const ua = window.navigator.userAgent
      const isWechatInlineBrowserLogin = ua
        .toLowerCase()
        .includes("micromessenger")
      // 解绑
      if (isBind) {
        showInfoToast("正在解绑账号...")
        const res = await unlinkThirdPartyToYuansun({
          recordId: recordId,
          baseUrl: NEXT_PUBLIC_AUTH_SERVER_URL,
          refUserId: uuid,
        })
        if (res.error) {
          showErrorToast(res.message)
          setIsOpened(false)
          return
        }
        showSuccessToast(res.message)
        setIsOpened(false)
        window.location.reload()
        return
      }

      showInfoToast("正在绑定账号...")
      if (isWechatInlineBrowserLogin) {
        const result = await signIn("wechat_inlineLogin", {
          callbackUrl: "/settings",
          redirect: true,
        })

        if (result?.error === "OAuthCallback" || !result) {
          showErrorToast("该微信账号可能已被其他账号绑定")
          setIsOpened(false)
          return
        }

        try {
          await request.get({
            url: `/user/profile`,
            params: { userId },
            userId: userId,
          })
        } catch (error) {
          console.error("同步用户资料失败:", error)
        }

        window.location.href = result?.url || "/settings"
      } else {
        await signIn("wechat", { callbackUrl: "/settings", redirect: true })
      }
    } catch (error) {
      showErrorToast("操作失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  const googleSign = async (isBind: boolean) => {
    setIsLoading(true)
    try {
      // 解绑
      if (isBind) {
        showInfoToast("正在解绑账号...")
        const res = await unlinkThirdPartyToYuansun({
          recordId: recordId,
          baseUrl: NEXT_PUBLIC_AUTH_SERVER_URL,
          refUserId: uuid,
        })
        if (res.error) {
          showErrorToast(res.message)
          setIsOpened(false)
          return
        }
        showSuccessToast(res.message)
        setIsOpened(false)
        window.location.reload()
        return
      }

      showInfoToast("正在绑定账号...")
      const result = await signIn("google", {
        callbackUrl: "/settings",
        redirect: false,
      })

      if (result?.error) {
        showErrorToast("该 Google 账号已被其他账号绑定")
        return
      }

      try {
        await request.get({
          url: `/user/profile`,
          params: { userId },
          userId: userId,
        })
      } catch (error) {
        console.error("同步用户资料失败:", error)
      }

      window.location.href = result?.url || "/settings"
    } catch (error) {
      showErrorToast("操作失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpened} onOpenChange={(open) => setIsOpened(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isBinded ? `确认解绑${channel}账号？` : `确认绑定${channel}账号?`}
          </DialogTitle>

          <DialogDescription>
            {isBinded
              ? `解绑${channel}账号后，您将无法使用${channel}账号登录。`
              : `点击确认按钮后，您会前往相应的登录页面进行登录授权。`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="default"
            className="gap-2"
            disabled={isLoading}
            onClick={(e) => {
              match(channel)
                .with("Github", async () => await githubSign(isBinded))
                .with("微信", async () => await wechatSign(isBinded))
                .with("Google", async () => await googleSign(isBinded))
                .otherwise(() => {
                  setIsOpened(false)
                  showErrorToast(
                    `似乎出现了一点问题，想要绑定的账户并不在合法范围里...账户平台为${channel}`,
                  )
                })
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                处理中...
              </>
            ) : (
              "确认"
            )}
          </Button>
          <DialogClose>
            <Button variant="outline">取消</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
