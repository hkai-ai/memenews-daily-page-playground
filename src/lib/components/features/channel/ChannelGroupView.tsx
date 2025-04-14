"use client"

import * as React from "react"
import { EyeOff, Eye, Trash } from "lucide-react"
import { match } from "ts-pattern"

import { Button } from "../../common/ui/button"
import { Badge } from "../../common/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../common/ui/alert-dialog"
import { Separator } from "../../common/ui/separator"
import { ScrollArea, ScrollBar } from "../../common/ui/scroll-area"

import { WechatServiceCard } from "./WechatServiceCard"

import { cn } from "@/lib/utils"
import { CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT } from "@/lib/constants/channel"
import { Channel, ChannelName } from "@/types/channel/model"
import { isEmpty } from "@/utils/isEmpty"

interface ChannelWithDefault extends Channel {
  isDefault: boolean
}

interface ChannelGroupViewProps {
  channels: ChannelWithDefault[]
  onDeleteChannel: (
    channels: Pick<Channel, "name" | "address" | "secret">[],
  ) => void
  onEmailVerify: (email: string) => void
  userId: string
}

const TYPE_LABELS = {
  personal: "个人通知",
  teamOrWork: "团队协作/群聊",
  wechat: "微信",
} as const

function ChannelCard({
  channel,
  onDelete,
  onEmailVerify,
}: {
  channel: ChannelWithDefault
  onDelete: (channel: Pick<Channel, "name" | "address" | "secret">) => void
  onEmailVerify: (email: string) => void
}) {
  const [showSecret, setShowSecret] = React.useState(false)
  const channelOption = CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT?.find(
    (option) => option.name === channel.name,
  )

  if (!channelOption) return null

  return (
    <div className="group relative aspect-square w-40 space-y-4 rounded-lg border p-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="absolute right-2 top-2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
            size="icon"
          >
            <Trash className="size-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              确认删除推送渠道 {channel.address}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              此操作不能撤消。这将永久地删除该推送渠道。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(channel)}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center gap-3">
        {channelOption.icon({ className: "size-6" })}
        <span className="font-medium">{channelOption.label}</span>
      </div>

      <div className="flex h-[calc(100%-4rem)] flex-col justify-between">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {channel.name === ChannelName.wxBot && isEmpty(channel.address) ? (
              <span>未激活</span>
            ) : (
              <span className="line-clamp-1">{channel.address}</span>
            )}
          </div>

          {channel.secret && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? (
                  <EyeOff className="size-3" />
                ) : (
                  <Eye className="size-3" />
                )}
              </Button>
              <span className="truncate text-sm text-muted-foreground">
                {showSecret ? channel.secret : "******"}
              </span>
            </div>
          )}
        </div>

        <div>
          {match(channel.name)
            .with(ChannelName.邮箱, ChannelName.email, () => (
              <Badge
                className={cn(
                  "cursor-pointer text-xs font-normal text-white",
                  channel.isValidated
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700",
                )}
                title={
                  channel.isValidated ? "🎉您已验证该邮箱" : "点击验证该邮箱"
                }
                onClick={() =>
                  !channel.isValidated && onEmailVerify(channel.address)
                }
              >
                {channel.isValidated ? "已验证" : "未验证"}
              </Badge>
            ))
            .with(ChannelName.wxBot, () => (
              <Badge
                className={cn(
                  "text-xs font-normal text-white",
                  channel.address
                    ? "bg-green-600"
                    : "cursor-pointer bg-red-600",
                )}
                title={
                  channel.address
                    ? "🎉您已激活该渠道"
                    : "您未激活该渠道，点击查看激活教程"
                }
                onClick={() => {
                  if (!channel.address) {
                    window.open(
                      "https://m0e8x072xo3.feishu.cn/docx/BwZ5dQFWFocvrOxz59Xc8uL4n1c",
                      "_blank",
                    )
                  }
                }}
              >
                {channel.address ? "已激活" : "未激活"}
              </Badge>
            ))
            .otherwise(() => null)}
        </div>
      </div>
    </div>
  )
}

export function ChannelGroupView({
  channels,
  onDeleteChannel,
  onEmailVerify,
  userId,
}: ChannelGroupViewProps) {
  const filteredChannels = channels?.filter(
    (channel) => channel.name !== "邮箱",
  )

  // 按 type 对渠道进行分组
  const groupedChannels = filteredChannels?.reduce(
    (acc, channel) => {
      const channelOption = CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT.find(
        (option) => option.name === channel.name,
      )
      if (!channelOption) return acc

      if (!acc[channelOption.type]) {
        acc[channelOption.type] = []
      }
      acc[channelOption.type].push(channel)
      return acc
    },
    {} as Record<
      (typeof CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT)[number]["type"],
      typeof channels
    >,
  )

  return (
    <div className="space-y-8">
      {/* 微信服务号 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">微信服务号</h2>
        <Separator />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <WechatServiceCard userId={userId} />
        </div>
      </section>

      {Object.entries(groupedChannels ?? {}).map(([type, typeChannels]) => (
        <section key={type} className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {TYPE_LABELS[type as keyof typeof TYPE_LABELS]}
          </h2>
          <Separator />
          <ScrollArea>
            <div className="flex gap-4 pb-4">
              {typeChannels.map((channel) => (
                <ChannelCard
                  key={`${channel.name}-${channel.address}`}
                  channel={channel}
                  onDelete={(channel) => onDeleteChannel([channel])}
                  onEmailVerify={onEmailVerify}
                />
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      ))}
    </div>
  )
}
