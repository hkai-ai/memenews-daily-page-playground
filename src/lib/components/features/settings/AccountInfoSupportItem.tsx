"use client"
import { Clipboard } from "lucide-react"

import { Button } from "../../common/ui/button"

import { showSuccessToast } from "@/lib/components/common/ui/toast"

/**
 * 会复制所有的账号信息
 * @param userInfo
 * @returns
 */
export function AccountInfoSupportItem(userInfo: any) {
  const copyUserInfoToClipboard = () => {
    const userInfoString = JSON.stringify(userInfo)
    navigator.clipboard.writeText(userInfoString)
    showSuccessToast("复制成功，请提供给客服。")
  }
  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-2 text-xs"
      onClick={copyUserInfoToClipboard}
    >
      <Clipboard className="size-4" />
      复制信息
    </Button>
  )
}
