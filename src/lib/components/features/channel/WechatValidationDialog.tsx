"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../common/ui/dialog"

import { WechatServiceCard } from "./WechatServiceCard"

interface WechatValidationDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  userId: string
  onClose?: () => void
}

export function WechatValidationDialog({
  open,
  onOpenChange,
  userId,
  onClose,
}: WechatValidationDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && onClose) {
      onClose()
    }
    onOpenChange?.(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>微信服务号验证</DialogTitle>
          <DialogDescription>
            😺关注我们的微信服务号，您可以通过服务号的消息提醒接受通知。
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-6">
          <WechatServiceCard userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
