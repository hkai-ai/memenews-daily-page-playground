"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import useSWR from "swr"

import { showErrorToast } from "../../common/ui/toast"

import { EmailSettingDialog } from "./EmailSettingDialog"

import { getEmailStatus } from "@/lib/serverAction/email"
import { NEXT_PUBLIC_AUTH_SERVER_URL } from "@/config/api"

interface EmailInputProps {
  isEmailVerified: boolean
  initialEmail?: string | null
}

/**
 * 获取邮箱验证状态的 fetcher
 */
const fetchEmailStatus = async (url: string, { userId, email }: { userId: string, email: string }) => {

  const res = await getEmailStatus(userId, email)

  if (res.success === false) {
    throw new Error(res.error as string)
  }

  return {
    isEmailVerified: res.isEmailVerified,
    email: res.email
  }
}

export function EmailInput({ isEmailVerified: initialIsEmailVerified, initialEmail }: EmailInputProps) {
  const { data: session, status, update } = useSession()
  const [email, setEmail] = useState(initialEmail ?? session?.user?.email ?? "")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 只在认证状态下获取邮箱验证状态
  const { data: emailStatus } = useSWR(
    status === "authenticated"
      ? `${NEXT_PUBLIC_AUTH_SERVER_URL}/api/user/email?userId=${session?.user?.id}&email=${email}`
      : null,
    url => fetchEmailStatus(url, { userId: session?.user?.id ?? "", email }),
    {
      onSuccess: (data) => {
        // 更新 session 中的邮箱验证状态
        update({
          isEmailVerified: data.isEmailVerified,
          email: data.email
        })
      },
      onError: (error) => {
        showErrorToast(error.message)
      },
      // 使用初始值避免闪烁
      fallbackData: { isEmailVerified: initialIsEmailVerified, email: initialEmail }
    }
  )

  /**
   * 根据邮箱状态获取显示信息
   */
  const getStatusInfo = () => {
    if (!email) {
      return {
        icon: '⚠️',
        message: '未设置邮箱',
        title: '点击设置邮箱地址',
        ariaLabel: '邮箱未设置'
      }
    }

    if (!emailStatus?.isEmailVerified) {
      return {
        icon: '❓',
        message: email,
        title: '邮箱未验证，点击前往验证页面',
        ariaLabel: '邮箱未验证'
      }
    }

    return {
      icon: '',
      message: email,
      title: '您已验证您的邮箱，但是换绑功能暂时不开放~',
      ariaLabel: '邮箱已验证'
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <>
      <div
        className="flex items-center gap-2 rounded-md border px-3 py-2 w-60 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
        role="status"
        aria-label={statusInfo.ariaLabel}
        title={statusInfo.title}
        onClick={() => {
          if (!emailStatus?.isEmailVerified) {
            setIsDialogOpen(true)
          }
        }}
      >
        <span className="text-base">
          {statusInfo.icon}
        </span>
        <span className="text-sm text-muted-foreground truncate">
          {statusInfo.message}
        </span>
      </div>

      <EmailSettingDialog
        isOpened={isDialogOpen}
        setIsOpened={setIsDialogOpen}
        userId={session?.user?.id ?? ""}
        email={email}
        isEmailVerified={emailStatus?.isEmailVerified ?? false}
        validationType={"accountEmailValidation"}
      />
    </>
  )
}
