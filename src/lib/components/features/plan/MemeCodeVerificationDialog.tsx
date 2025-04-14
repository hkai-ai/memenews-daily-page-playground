"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../common/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../../common/ui/alert-dialog"
import { Button } from "../../common/ui/button"
import { Input } from "../../common/ui/input"
import { showErrorToast } from "../../common/ui/toast"

interface MemeCodeVerificationDialogProps {
  loading: boolean
  disabled: boolean
  buttonText: string
  open: boolean
  memeCode: string
  setMemeCode: (memeCode: string) => void
  onSubmit: (memeCode: string) => void
}

export function MemeCodeVerificationDialog({
  loading,
  disabled,
  buttonText,
  open,
  memeCode,
  setMemeCode,
  onSubmit,
}: MemeCodeVerificationDialogProps) {
  const router = useRouter()
  const [openWechatQRCode, setOpenWechatQRCode] = useState(false)

  const handleDialogClose = () => {
    localStorage.removeItem("memeCodeVerification")

    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/memes")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>输入 Meme 码激活会员权限</DialogTitle>
        </DialogHeader>

        <p className="text-sm">
          🔮
          前方是Meme魔法学院的秘密社团！不是魔法师不能入内！
          🧙‍♀（内测中，请联系客服获取 Meme 码）
          <AlertDialog
            open={openWechatQRCode}
            onOpenChange={setOpenWechatQRCode}
          >
            <AlertDialogTrigger>
              <span className="underline">查看客服微信</span>
              <AlertDialogContent>
                <Image
                  className="mx-auto"
                  src={"/contact-wechat-qc.jpg"}
                  alt="客服微信二维码"
                  width={400}
                  height={400}
                  onError={() => showErrorToast("图片加载失败")}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
              </AlertDialogContent>
            </AlertDialogTrigger>
          </AlertDialog>
        </p>

        <div className="flex flex-col gap-2 p-4">
          <Input
            placeholder="请输入 Meme 码"
            value={memeCode}
            onChange={(e) => setMemeCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && memeCode && !disabled) {
                e.preventDefault()
                onSubmit(memeCode)
              }
            }}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                handleDialogClose()
              }}
            >
              取消
            </Button>
          </DialogClose>

          <Button
            type="submit"
            className="gap-2"
            disabled={disabled || !memeCode}
            onClick={(e) => {
              e.preventDefault()
              onSubmit(memeCode)
            }}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                施法中...✨
              </>
            ) : (
              <>{buttonText}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
