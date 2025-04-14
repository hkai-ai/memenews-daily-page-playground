"use client"
import { Loader2, PartyPopper } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

import { Button } from "@/lib/components/common/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/common/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/lib/components/common/ui/alert-dialog"
import { Input } from "@/lib/components/common/ui/input"
import { showErrorToast } from "@/lib/components/common/ui/toast"
import { useMemeCodeVerification } from "@/lib/hooks/create-edit-plan/useMemeCodeVerification"

/**
 * 输入 meme 码提交
 * @returns
 */
export function MemeCodeSubmitItem() {
  const [open, setOpen] = useState(false)
  const [openWechatQRCode, setOpenWechatQRCode] = useState(false)

  const {
    memeCode,
    setMemeCode,
    isVerified,
    loadingVerifyMemeCode,
    verifyMemeCode,
  } = useMemeCodeVerification({ type: "flow", setOpen: setOpen })

  const onSubmit = (memeCode: string) => {
    verifyMemeCode(memeCode)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => setOpen(true)}
      >
        <PartyPopper className="size-4" />
        点击升级
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🧐 神奇的 Meme 码能给你带来什么呢?</DialogTitle>
          </DialogHeader>

          <p className="text-sm">
            🧙‍♀ Meme 码是一句神奇的咒语~ 您可以从我们的运营活动中获取 Meme
            码激活福利。
            <br /> 内测阶段您可以联系客服微信申请 Meme 码。
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
              placeholder="输入 Meme 码念咒吧！"
              value={memeCode}
              onChange={(e) => setMemeCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && memeCode) {
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
                  setOpen(false)
                }}
              >
                取消
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="gap-2"
              disabled={!memeCode || loadingVerifyMemeCode}
              onClick={(e) => {
                e.preventDefault()
                onSubmit(memeCode)
              }}
            >
              {loadingVerifyMemeCode ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  施法中...✨
                </>
              ) : (
                "施法吧🧙"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
