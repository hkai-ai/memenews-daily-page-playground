"use client"

import { useId, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRequest } from "ahooks"
import { Send, Loader2, RefreshCcw } from "lucide-react"

import { WechatValidationDialog } from "../channel/WechatValidationDialog"
import { AddChannelDialog } from "../channel"
import { HintTip } from "../../common/ui/hint-tip"

import { Button, ButtonProps } from "@/lib/components/common/ui/button"
import { Checkbox } from "@/lib/components/common/ui/checkbox"
import { Label } from "@/lib/components/common/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/common/ui/popover"
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { Skeleton } from "@/lib/components/common/ui/skeleton"
import { getChannelsAction } from "@/lib/api/channel"
import { activePushAction } from "@/lib/api/channel/active-push"
import { CHANNEL_OPTIONS } from "@/lib/constants/channel"
import { cn } from "@/lib/utils"
import { Channel, ChannelName } from "@/types/channel/model"
import { isEmpty } from "@/utils/isEmpty"

interface ActivePushPopoverProps {
  planId: string
  className?: string
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
}

export function ActivePushPopover({
  planId,
  className,
  variant = "outline",
  size = "icon",
}: ActivePushPopoverProps) {
  const id = useId()
  const { data: session } = useSession()
  const userId = session?.user?.id || ""
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [isWechatValidationDialogOpen, setIsWechatValidationDialogOpen] =
    useState(false)
  const [isWechatValidationRefresh, setIsWechatValidationRefresh] =
    useState(false)
  const targetWechatRef = useRef<string | null>(null)

  const {
    data: channelsQuery,
    loading: loadingChannels,
    run: getChannels,
  } = useRequest(() => getChannelsAction({ userId }), {
    ready: !!userId && open,
    onSuccess: (data) => {
      if (data.data[0]?.channel?.length > 0) {
        setSelectedChannels(data.data[0].channel.map((channel) => channel.id))
      }
      setIsWechatValidationRefresh(false)
    },
  })

  const { loading: loadingPush, run: pushPlan } = useRequest(activePushAction, {
    manual: true,
    onSuccess: () => {
      showSuccessToast("推送成功")
      setOpen(false)
    },
    onError: (error: any) => {
      showErrorToast(`推送失败: ${error.message?.statusText || "请稍后再试"}`)
    },
  })

  const channels = channelsQuery?.data[0]?.channel || []

  const handleChannelToggle = (channel: Channel) => {
    const isWechatUnverified =
      channel.name === ChannelName.wechat && !channel.isValidated

    if (isWechatUnverified) {
      targetWechatRef.current = channel.address
      setIsWechatValidationDialogOpen(true)
      return
    }

    setSelectedChannels((prev) =>
      prev.includes(channel.id)
        ? prev.filter((id) => id !== channel.id)
        : [...prev, channel.id],
    )
  }

  const handleToggleAll = () => {
    if (
      selectedChannels.length === 0 ||
      selectedChannels.length <
        channels.filter((c) => !isChannelDisabled(c)).length
    ) {
      // Select all valid channels
      setSelectedChannels(
        channels
          .filter((channel) => !isChannelDisabled(channel))
          .map((channel) => channel.id),
      )
    } else {
      // Deselect all
      setSelectedChannels([])
    }
  }

  const handlePush = () => {
    if (selectedChannels.length === 0) {
      showErrorToast("请至少选择一个推送渠道")
      return
    }

    const selectedChannelsList = channels.filter((channel) =>
      selectedChannels.includes(channel.id),
    )

    pushPlan({
      channels: selectedChannelsList,
      planId,
      userId,
    })
  }

  const getChannelIcon = (channel: Channel) => {
    const option = CHANNEL_OPTIONS.find((opt) => opt.name === channel.name)
    return option?.icon ? option.icon({ className: "size-4 mr-2" }) : null
  }

  const getChannelDisplayText = (channel: Channel): string => {
    if (channel.name === ChannelName.wxBot) {
      if (isEmpty(channel.address)) {
        return `${channel.secret}`
      }
      return `${channel.address}`
    }

    if (channel.name === ChannelName.email && !channel.isValidated) {
      return `${channel.address}`
    }

    if (channel.name === ChannelName.wechat && channel.isValidated) {
      return "微信服务号"
    }

    return channel.address
  }

  const isChannelDisabled = (channel: Channel): boolean => {
    return channel.name === ChannelName.wechat ? !channel.isValidated : false
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {size === "icon" ? (
        <HintTip label="主动推送">
          <PopoverTrigger asChild>
            <Button
              size={size}
              variant={variant}
              className={cn(className, "select-none")}
              aria-label="主动推送"
            >
              <Send className="size-4" />
            </Button>
          </PopoverTrigger>
        </HintTip>
      ) : (
        <PopoverTrigger asChild>
          <Button
            size={size}
            variant={variant}
            className={className}
            aria-label="主动推送"
          >
            <Send className="size-4" />
            主动推送
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent side="top" className="w-72 p-3">
        {loadingChannels && !isWechatValidationRefresh ? (
          <ActivePushSkeletonContent />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">
                选择推送渠道
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => getChannels()}
                disabled={loadingChannels && !isWechatValidationRefresh}
              >
                <RefreshCcw
                  className={cn(
                    "size-3",
                    loadingChannels &&
                      !isWechatValidationRefresh &&
                      "animate-spin",
                  )}
                />
                <span className="sr-only">刷新渠道列表</span>
              </Button>
            </div>

            {channels.length === 0 ? (
              <div className="py-4 text-center text-sm">暂无可用的推送渠道</div>
            ) : (
              <form>
                <div className="flex flex-col gap-2">
                  {channels.map((channel) => {
                    const isDisabled = isChannelDisabled(channel)
                    return (
                      <Label key={channel.id} htmlFor={`${id}-${channel.id}`}>
                        <div
                          className={cn(
                            "group relative flex items-center gap-2 rounded-md border px-2 py-2",
                            selectedChannels.includes(channel.id) && !isDisabled
                              ? "bg-green-100 dark:bg-green-900/10"
                              : "bg-white dark:bg-card",
                            isDisabled
                              ? "cursor-pointer opacity-60"
                              : "cursor-pointer",
                          )}
                          onClick={() => {
                            if (
                              isDisabled &&
                              channel.name === ChannelName.wechat
                            ) {
                              targetWechatRef.current = channel.address
                              setIsWechatValidationDialogOpen(true)
                            }
                          }}
                        >
                          <Checkbox
                            id={`${id}-${channel.id}`}
                            checked={
                              selectedChannels.includes(channel.id) &&
                              !isDisabled
                            }
                            onCheckedChange={() => handleChannelToggle(channel)}
                            disabled={isDisabled}
                          />
                          <span className="flex items-center truncate">
                            {getChannelIcon(channel)}
                            <span className="truncate">
                              {getChannelDisplayText(channel)}
                            </span>
                          </span>
                          {isDisabled &&
                            channel.name === ChannelName.wechat && (
                              <span className="text-xs text-orange-500">
                                (未验证)
                              </span>
                            )}
                        </div>
                      </Label>
                    )
                  })}
                  <AddChannelDialog
                    variant="outline"
                    className="h-8 w-full"
                    channels={channels}
                    onSuccessCallback={getChannels}
                  />
                </div>
                <div
                  role="separator"
                  aria-orientation="horizontal"
                  className="-mx-3 my-3 h-px bg-border"
                ></div>
                <div className="flex justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                    onClick={handleToggleAll}
                    type="button"
                    disabled={loadingPush || channels.length === 0}
                  >
                    {selectedChannels.length === 0 ||
                    selectedChannels.length <
                      channels.filter((c) => !isChannelDisabled(c)).length
                      ? "全选"
                      : "取消全选"}
                  </Button>
                  <Button
                    size="sm"
                    className={cn(
                      "h-7 px-2",
                      loadingPush && "cursor-not-allowed",
                    )}
                    onClick={handlePush}
                    type="button"
                    disabled={selectedChannels.length === 0 || loadingPush}
                  >
                    {loadingPush ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-3 animate-spin" />
                        <span>推送中</span>
                      </div>
                    ) : (
                      "立即推送"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </PopoverContent>

      <WechatValidationDialog
        open={isWechatValidationDialogOpen}
        onOpenChange={(open) => {
          setIsWechatValidationDialogOpen(open)
          if (!open) {
            setIsWechatValidationRefresh(true)
            getChannels()
          }
        }}
        userId={userId}
        onClose={getChannels}
      />
    </Popover>
  )
}

function ActivePushSkeletonContent() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
      <div className="space-y-2">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border px-2 py-2"
            >
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
      <div className="-mx-3 my-3 h-px bg-border" />
      <div className="flex justify-between gap-2">
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
    </div>
  )
}
