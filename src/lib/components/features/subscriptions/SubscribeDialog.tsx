"use client"

import { useRequest } from "ahooks"
import { Bell, Check, BellOff, BellPlus } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"

import { ChannelListSelect } from "../channel/ChannelListSelect"

import { SubscribeSuccessDialog } from "./SubscribeSuccessDialog"

import { ChannelName, Channel } from "@/types/channel/model"
import {
  subscribePlanAction,
  unSubscribePlanAction,
  updateChannelAction,
} from "@/lib/api/plan"
import { Button, ButtonProps } from "@/lib/components/common/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/lib/components/common/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/common/ui/dialog"
import { LoadingSkeleton } from "@/lib/components/common/ui/loading-skeleton"
import { showErrorToast } from "@/lib/components/common/ui/toast"
import { AddChannelDialog } from "@/lib/components/features/channel"
import { cn } from "@/lib/utils"
import { delay } from "@/utils"
import { useSubscribeStateStore } from "@/lib/store/subscribeState"
import { getChannelsAction } from "@/lib/api/channel"
import { usePlanDialog } from "@/lib/context/plan/PlanDialogContext"

interface SubscribeDialogProps {
  className?: string
  cancelBtnClassName?: string
  variant?: ButtonProps["variant"]
  changeBtnVariant?: ButtonProps["variant"]
  changeBtnText?: string
  cancelBtnVariant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  subscribeText?: string
  preview?: boolean
  loading?: boolean
  isFreeze?: boolean
  /**
   * normal 就是在除了管理已订阅 meme 的页面外的其他页面使用
   * change 是在管理已订阅 meme 的页面使用，因为订阅 meme 页面即可以取消订阅也可以修改推送渠道
   */
  type?: "normal" | "change"
  planId: string
  isSubscribed: boolean
  beSubscribedId: string
  originalChannels: Channel[]
  onSubscribeSuccessCallback?: (
    planId: string,
    isSubscribed: boolean,
    selectedChannel?: Channel[],
  ) => void,
  planType?: "paid" | "free"
}

/**
 * 该组件包含所有与订阅相关的逻辑，包括订阅、取消订阅、修改推送渠道、未登录状态引导登录等
 * @param className 组件的类名
 * @param cancelBtnClassName 取消订阅按钮的类名
 * @param variant 按钮的变体
 * @param planId meme ID
 * @param isSubscribed 是否已订阅
 * @param beSubscribedId 用于在修改推送渠道时传入 meme 关系ID
 * @param type 组件的类型，除了已订阅 meme 页面，其他页面都是 normal 类型
 * @param originalChannels 如果是更换 meme 的推送渠道，传入原始的推送渠道
 * @param onSubscribeSuccessCallback 订阅成功后的回调函数
 */
export function SubscribeDialog({
  className,
  isFreeze = false,
  cancelBtnClassName,
  variant = "default",
  changeBtnVariant = "ghost",
  changeBtnText = "修改推送渠道",
  cancelBtnVariant = "secondary",
  preview = false,
  size = "default",
  subscribeText = "订阅",
  planId,
  loading = false,
  isSubscribed,
  beSubscribedId,
  type = "normal",
  originalChannels,
  onSubscribeSuccessCallback,
  planType,
}: SubscribeDialogProps) {
  const { data: session, status } = useSession()
  const userId = session?.user?.id as string
  const { setIsPlanDialogOpen, setPlanDialogId } = usePlanDialog()
  const { subscribeState, setSubscribeState } = useSubscribeStateStore()
  const hasMultipleChannels = Number(originalChannels?.length) > 1
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addChannelDialogOpen, setAddChannelDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [freezeWarningOpen, setFreezeWarningOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<Channel[]>(
    originalChannels?.map((channel) => ({
      id: channel.id,
      name: channel.name,
      address: channel.address || "",
      secret: channel.secret || "",
    })) || [],
  )

  /** 这个变量用来检测是否有新增推送渠道，如果有就需要重新刷新订阅渠道列表 */
  const [refreshChannelQuery, setRefreshQuery] = useState(false)
  const [operateSuccess, setOperateSuccess] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const { data: channelsQuery } = useRequest(
    () => getChannelsAction({ userId }),
    {
      ready: !!userId,
    },
  )

  /**
   * 订阅
   */
  const { run: subscribePlan, loading: loadingSubscribePlan } = useRequest(
    subscribePlanAction,
    {
      manual: true,
      async onSuccess(data) {
        setOperateSuccess(true)
        await delay(1000)
        setDialogOpen(false)
        setCancelDialogOpen(false)
        setShowSuccessDialog(true)
        setSubscribeState({
          planId,
          isSubscribed: true,
          selectedChannel: selectedChannel,
        })
        onSubscribeSuccessCallback?.(planId, true, selectedChannel)
        setOperateSuccess(false)
      },
      async onError(error: any) {
        showErrorToast(`订阅失败: ${error.message.statusText}`)
        await delay(1000)
        setDialogOpen(false)
        setCancelDialogOpen(false)
        setSubscribeState({
          planId,
          isSubscribed: false,
          selectedChannel: originalChannels,
        })
        onSubscribeSuccessCallback?.(planId, false, [])
        setOperateSuccess(false)
      },
    },
  )

  /**
   * 修改推阅渠道
   */
  const { run: updateChannel, loading: loadingUpdateChannel } = useRequest(
    // @todo 找后端加返回字段
    updateChannelAction,
    {
      manual: true,
      ready: !!userId && !!beSubscribedId,
      async onSuccess(data) {
        setOperateSuccess(true)
        await delay(1000)
        setDialogOpen(false)
        setCancelDialogOpen(false)
        setShowSuccessDialog(true)
        setSubscribeState({
          planId,
          isSubscribed: true,
          selectedChannel: selectedChannel,
        })
        onSubscribeSuccessCallback?.(planId, true, selectedChannel)
        setOperateSuccess(false)
      },
      async onError(error: any) {
        showErrorToast(`更新订阅渠道失败: ${error.message.statusText}`)
        await delay(1000)
        setDialogOpen(false)
        setCancelDialogOpen(false)
        setSubscribeState({
          planId,
          isSubscribed: false,
          selectedChannel: originalChannels,
        })
        onSubscribeSuccessCallback?.(planId, false, originalChannels)
        setOperateSuccess(false)
      },
    },
  )

  /**
   * 取消订阅
   */
  const { run: unSubscribePlan, loading: loadingUnSubscribePlan } = useRequest(
    unSubscribePlanAction,
    {
      manual: true,
      ready: !!userId,
      async onSuccess() {
        setOperateSuccess(true)
        await delay(1000)
        setDialogOpen(false)
        setCancelDialogOpen(false)
        setSubscribeState({
          planId,
          isSubscribed: false,
          selectedChannel: [],
        })
        onSubscribeSuccessCallback?.(planId, false, [])
        setOperateSuccess(false)
      },
      async onError(error: any) {
        showErrorToast(`取消订阅失败: ${error.message.statusText}`)
        await delay(1000)
        setDialogOpen(false)
        setCancelDialogOpen(false)
        setSubscribeState({
          planId,
          isSubscribed: true,
          selectedChannel: originalChannels,
        })
        onSubscribeSuccessCallback?.(planId, true)
        setOperateSuccess(false)
      },
    },
  )

  const handleSubscribe = () => {
    type === "change"
      ? updateChannel({
        params: {
          userId,
          beSubscribedId: beSubscribedId as string,
        },
        body: {
          channel: selectedChannel.map((channel) => ({
            id: channel.id,
            name: channel.name,
            address: channel.address,
            secret: channel.secret,
          })),
        },
      })
      : isSubscribed
        ? updateChannel({
          params: {
            userId,
            beSubscribedId: beSubscribedId as string,
          },
          body: {
            channel: selectedChannel.map((channel) => ({
              id: channel.id,
              name: channel.name,
              address: channel.address,
              secret: channel.secret,
            })),
          },
        })
        : subscribePlan({
          planId,
          userId,
          channel: selectedChannel.map((channel) => ({
            id: channel.id,
            name: channel.name,
            address: channel.address,
            secret: channel.secret,
          })),
        })
  }

  const disableUpdate =
    loadingUpdateChannel ||
    !selectedChannel.length ||
    selectedChannel?.some(
      (field) => field.name !== ChannelName.wxBot && field.address === "",
    )

  const disableSubscribe = loadingSubscribePlan || !selectedChannel.length
  const unLogin = status === "unauthenticated"

  // 检查用户是否有推送渠道，如果没有则自动打开添加渠道弹窗
  useEffect(() => {
    if (dialogOpen && channelsQuery?.data[0].channel.length === 0) {
      delay(800).then(() => {
        setAddChannelDialogOpen(true)
      })
    }
  }, [dialogOpen, channelsQuery?.data[0].channel.length])

  /**
   * 1️⃣ 如果用户未登录，则显示登录后订阅按钮。
   */
  if (unLogin) {
    return (
      <Button
        className={cn("gap-2", className)}
        onClick={() => {
          signIn()
        }}
      >
        <BellPlus className="~size-2.5/4" />
        登录后订阅
      </Button>
    )
  }

  if (loading) {
    return (
      <div className={cn("animate-pulse bg-muted ~size-6/10", className)}></div>
    )
  }

  /**
   * 2️⃣ 订阅（未订阅）。
   */
  if (!isSubscribed) {
    if (preview) {
      return (
        <>
          <AlertDialog
            open={freezeWarningOpen}
            onOpenChange={setFreezeWarningOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>该 meme 已冻结</AlertDialogTitle>
                <AlertDialogDescription>
                  该 meme
                  目前处于冻结状态，即使订阅您可能也收不到任何信息，这取决于拥有者何时解冻。是否继续订阅？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <Button
                  onClick={() => {
                    setFreezeWarningOpen(false)
                    setPlanDialogId(planId)
                    setIsPlanDialogOpen(true)
                  }}
                >
                  继续订阅
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            size={size}
            variant={variant}
            className={cn("gap-2 ~size-6/10", className)}
            onClick={() => {
              if (isFreeze) {
                setFreezeWarningOpen(true)
              } else {
                setPlanDialogId(planId)
                setIsPlanDialogOpen(true)
              }
            }}
          >
            <Bell className="~size-2.5/4" />
            {size !== "icon" && <span>{subscribeText}</span>}
          </Button>
        </>
      )
    }

    return (
      <>
        <AlertDialog
          open={freezeWarningOpen}
          onOpenChange={setFreezeWarningOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>该 meme 已冻结</AlertDialogTitle>
              <AlertDialogDescription>
                该 meme
                目前处于冻结状态，即使订阅您可能也收不到任何信息，这取决于拥有者何时解冻。是否继续订阅？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <Button
                onClick={() => {
                  setFreezeWarningOpen(false)
                  setDialogOpen(true)
                }}
              >
                继续订阅
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size={size}
              variant={variant}
              className={cn("gap-2", className)}
              onClick={(e) => {
                if (isFreeze) {
                  e.preventDefault()
                  setFreezeWarningOpen(true)
                }
              }}
            >
              <Bell className="size-4" />
              {size !== "icon" && <span>{subscribeText}</span>}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>订阅该 meme</DialogTitle>
              <DialogDescription>
                我们将会将日报推送到您配置的推送渠道
              </DialogDescription>
            </DialogHeader>

            <ChannelListSelect
              selectedChannels={selectedChannel}
              setSelectedChannels={setSelectedChannel}
              refreshQuery={refreshChannelQuery}
            />

            <DialogFooter className="flex justify-between gap-2 sm:justify-between">
              <AddChannelDialog
                mildOverlay
                className="w-fit"
                dialogOpen={addChannelDialogOpen}
                onOpenChange={setAddChannelDialogOpen}
                onSuccessCallback={(newChannel) => {
                  setRefreshQuery(!refreshChannelQuery)
                  // setSelectedChannel([
                  //   ...selectedChannel,
                  //   {
                  //     id: newChannel.channel[newChannel.channel.length - 1].id,
                  //     name: newChannel.channel[newChannel.channel.length - 1]
                  //       .name,
                  //     address:
                  //       newChannel.channel[newChannel.channel.length - 1]
                  //         .address,
                  //     secret:
                  //       newChannel.channel[newChannel.channel.length - 1]
                  //         .secret,
                  //   },
                  // ])
                }}
              />

              <Button
                className="gap-2"
                variant={operateSuccess ? "success" : "default"}
                disabled={disableUpdate || disableSubscribe || operateSuccess}
                onClick={handleSubscribe}
              >
                {loadingUpdateChannel || loadingSubscribePlan ? (
                  <LoadingSkeleton>订阅中</LoadingSkeleton>
                ) : (
                  <>
                    {operateSuccess ? (
                      <>
                        <Check className="size-4" />
                        订阅成功
                      </>
                    ) : (
                      <>
                        <BellPlus className="size-4" />
                        <span>订阅</span>
                      </>
                    )}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  /**
   * 3️⃣ 修改推送渠道。
   */
  if (type === "change") {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size={size}
            variant={changeBtnVariant}
            className={cn("justify-start gap-2", className, {
              "~size-6/10": size === "icon",
            })}
          >
            <Bell className="~size-2.5/4" />
            {size !== "icon" && <span>{changeBtnText}</span>}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>修改推送渠道</DialogTitle>
            <DialogDescription>
              我们将会将日报推送到您配置的推送渠道
            </DialogDescription>
          </DialogHeader>

          <ChannelListSelect
            selectedChannels={selectedChannel}
            setSelectedChannels={setSelectedChannel}
            refreshQuery={refreshChannelQuery}
          />

          <DialogFooter>
            <div className="mr-auto">
              <AddChannelDialog
                channels={channelsQuery?.data[0].channel || []}
                variant="outline"
                mildOverlay
                onSuccessCallback={() => {
                  setRefreshQuery(!refreshChannelQuery)
                }}
              />
            </div>

            <Button
              className="gap-2"
              variant={
                operateSuccess
                  ? "success"
                  : selectedChannel.length === 0
                    ? "destructive"
                    : "default"
              }
              disabled={
                operateSuccess ||
                (selectedChannel.length > 0 &&
                  (disableUpdate || disableSubscribe))
              }
              onClick={() => {
                if (selectedChannel.length === 0) {
                  unSubscribePlan({ planId, userId })
                } else {
                  handleSubscribe()
                }
              }}
            >
              {loadingUpdateChannel ||
                loadingSubscribePlan ||
                loadingUnSubscribePlan ? (
                <LoadingSkeleton>
                  {selectedChannel.length === 0 ? "取消中" : "修改中"}
                </LoadingSkeleton>
              ) : (
                <>
                  {operateSuccess ? (
                    <>
                      <Check className="size-4" />
                      {selectedChannel.length === 0
                        ? "成功取消订阅"
                        : "修改成功"}
                    </>
                  ) : (
                    <>
                      {selectedChannel.length === 0 ? (
                        <>
                          <BellOff className="size-4" />
                          <span>取消订阅</span>
                        </>
                      ) : (
                        <>
                          <BellPlus className="size-4" />
                          <span>修改</span>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  /**
   * 4️⃣ 取消订阅（多个渠道）。
   */
  if (hasMultipleChannels) {
    return (
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant={cancelBtnVariant}
            size={size}
            className={cn(
              "gap-2",
              className,
              size === "icon" ? "~size-6/10" : "w-full justify-start",
            )}
          >
            <BellOff className="~size-2.5/4" />
            {size !== "icon" && <span>取消订阅</span>}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              该 meme 有多个推送渠道，请选择您的操作。
            </AlertDialogTitle>
            <AlertDialogDescription>
              选择
              <b className="text-red-500">修改推送渠道</b>或
              <b className="text-red-500">全部取消订阅</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end">
            <AlertDialogCancel>返回</AlertDialogCancel>
            <SubscribeDialog
              planType={planType}
              changeBtnVariant="secondary"
              isSubscribed
              type="change"
              planId={planId}
              beSubscribedId={beSubscribedId}
              originalChannels={originalChannels}
              subscribeText="修改推送渠道"
            />
            <Button
              variant={operateSuccess ? "success" : "destructive"}
              disabled={loadingUnSubscribePlan}
              className={cn("gap-2", cancelBtnClassName)}
              onClick={() => unSubscribePlan({ planId, userId })}
            >
              {loadingUnSubscribePlan ? (
                <>取消订阅中...</>
              ) : (
                <>
                  {operateSuccess ? (
                    <>
                      <Check className="size-4" />
                      成功取消订阅
                    </>
                  ) : (
                    <span>全部取消订阅</span>
                  )}
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  /**
   * 5️⃣ 取消订阅（单渠道）。
   */
  return (
    <>
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size={size}
            variant={cancelBtnVariant}
            className={cn("w-full gap-2", className, {
              "~size-6/10": size === "icon",
              "justify-start": size !== "icon",
            })}
          >
            <BellOff className="~size-2.5/4" />
            {size !== "icon" && <span>取消订阅</span>}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认要取消订阅吗？</AlertDialogTitle>
            <AlertDialogDescription>
              取消订阅后将不再收到该 meme 的推送
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>返回</AlertDialogCancel>
            <Button
              className="gap-2"
              variant={operateSuccess ? "success" : "destructive"}
              disabled={loadingUnSubscribePlan || operateSuccess}
              onClick={() => unSubscribePlan({ planId, userId })}
            >
              {loadingUnSubscribePlan ? (
                <LoadingSkeleton>取消中</LoadingSkeleton>
              ) : (
                <>
                  {operateSuccess ? (
                    <>
                      <Check className="size-4" />
                      成功取消订阅
                    </>
                  ) : (
                    "确认取消"
                  )}
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SubscribeSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </>
  )
}
