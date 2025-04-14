"use client"

import { useRequest } from "ahooks"
import { useSession } from "next-auth/react"
import { RefreshCcw, X } from "lucide-react"
import { useState, useRef } from "react"

import { Checkbox } from "../../common/ui/checkbox"
import { showErrorToast, showSuccessToast } from "../../common/ui/toast"
import { EmailSettingDialog } from "../settings/EmailSettingDialog"

import { AddChannelDialog } from "./AddChannelDialog"
import { toggleChannelSelection } from "./utils"
import { WechatValidationDialog } from "./WechatValidationDialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/common/ui/dialog"
import { Button } from "@/lib/components/common/ui/button"
import { deleteChannelAction, getChannelsAction } from "@/lib/api/channel"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/lib/components/common/ui/skeleton"
import { Channel, ChannelName } from "@/types/channel/model"
import { isEmpty } from "@/utils/isEmpty"
import { CHANNEL_OPTIONS } from "@/lib/constants/channel"

interface ChannelListSelectProps {
  buttonPositionText?: "左下角" | "下方"
  refreshQuery?: boolean
  selectedChannels: Channel[]
  setSelectedChannels: (channels: Channel[]) => void
  onDeleteChannelCallback?: (channel: Channel[]) => void
  showAddButtonAtEnd?: boolean
  columns?: number
}

function renderChannel(
  channel: Channel,
  selectedChannels: Channel[],
  setSelectedChannels: (channels: Channel[]) => void,
  setOpenDeleteDialog: (state: { open: boolean; channel?: Channel }) => void,
  deleteChannel: (params: {
    userId: string
    channelsToDelete: Channel[]
  }) => void,
  userId: string,
  getChannels: () => void,
  openDeleteDialog: { open: boolean; channel?: Channel },
  isEmailSettingDialogOpen: boolean,
  setIsEmailSettingDialogOpen: (state: boolean) => void,
  targetEmailRef: React.MutableRefObject<string | null>,
  isWechatValidationDialogOpen: boolean,
  setIsWechatValidationDialogOpen: (state: boolean) => void,
  targetWechatRef: React.MutableRefObject<string | null>,
) {
  console.log("Rendering channel:", channel.id)
  const isUnverified =
    channel.name === ChannelName.wechat ||
    channel.name === ChannelName.email ||
    channel.name === ChannelName.邮箱
      ? !channel.isValidated
      : channel.name === ChannelName.wxBot
        ? isEmpty(channel.address)
        : false

  const handleClick = (e: React.MouseEvent) => {
    console.log("Channel clicked:", channel.id)
    /**
     * 这么做是为了防止点击删除按钮时，弹出邮箱验证Dialog的冲突
     */
    if (e.target instanceof Element && e.target.closest(".delete-button")) {
      return
    }
    e.preventDefault()
    e.stopPropagation()

    if (isUnverified && channel.name === ChannelName.wechat) {
      targetWechatRef.current = channel.address
      setIsWechatValidationDialogOpen(true)
      return
    }

    // if (!isUnverified) {
    console.log("Toggling channel selection:", channel.id)
    toggleChannelSelection(channel, selectedChannels, setSelectedChannels)
    // }
  }

  return (
    <div
      key={channel.id}
      className={cn(
        "group relative flex h-fit items-center justify-between gap-1 rounded-md border px-2 py-3 text-base",
        selectedChannels?.some((field) => field.id === channel.id)
          ? "bg-green-100 dark:bg-green-900/10"
          : "bg-white dark:bg-card",
        // isUnverified ? "cursor-pointer opacity-60" : "cursor-pointer",
        "cursor-pointer",
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedChannels?.some((field) => field.id === channel.id)}
          onCheckedChange={(checked) => {
            console.log("Checkbox changed for channel:", channel.id)
            if (isUnverified && channel.name === ChannelName.wechat) {
              targetWechatRef.current = channel.address
              setIsWechatValidationDialogOpen(true)
              return
            }
            toggleChannelSelection(
              channel,
              selectedChannels,
              setSelectedChannels,
            )
          }}
        />
        <span className="line-clamp-1 flex-1 text-wrap break-all text-xs text-primary">
          {getChannelDisplayText(channel)}
          {/* {isUnverified && channel.name !== ChannelName.wechat && " (未验证)"} */}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {CHANNEL_OPTIONS.find((option) => option.name === channel.name)?.icon({
          className: "size-5",
        })}
      </div>
      {channel.name !== ChannelName.wechat && (
        <X
          className="delete-button absolute -right-1 -top-1 size-4 cursor-pointer rounded-full bg-red-300 fill-white stroke-white text-gray-400/70 opacity-0 hover:text-red-500 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            setOpenDeleteDialog({ open: true, channel })
          }}
        />
      )}

      <Dialog
        open={openDeleteDialog.open}
        onOpenChange={(open) => {
          setOpenDeleteDialog({ open })
        }}
      >
        <DialogContent
          overlayClassName="bg-black/30"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除推送渠道 {openDeleteDialog.channel?.address}{" "}
              吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                setOpenDeleteDialog({ open: false })
              }}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDeleteChannel(
                  userId,
                  openDeleteDialog.channel!,
                  deleteChannel,
                  getChannels,
                  setOpenDeleteDialog,
                )
              }}
            >
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function handleDeleteChannel(
  userId: string,
  channel: Channel,
  deleteChannel: (params: {
    userId: string
    channelsToDelete: Channel[]
  }) => void,
  getChannels: () => void,
  setOpenDeleteDialog: (state: { open: boolean }) => void,
) {
  deleteChannel({
    userId,
    channelsToDelete: [channel],
  })
  setTimeout(() => {
    setOpenDeleteDialog({ open: false })
    getChannels()
  }, 0)
}

function getChannelDisplayText(channel: Channel): string {
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

export function ChannelListSelect({
  buttonPositionText = "左下角",
  refreshQuery,
  selectedChannels,
  setSelectedChannels,
  onDeleteChannelCallback,
  showAddButtonAtEnd = false,
  columns = 1,
}: ChannelListSelectProps) {
  const { data: session } = useSession()
  const [channels, setChannels] = useState<Channel[]>([])
  const userId = session?.user?.id as string
  const [isWechatValidationRefresh, setIsWechatValidationRefresh] =
    useState(false) // 打开微信服务号验证dialog是需要刷新的，但是不需要渲染刷新效果，这是为了给用户带来更好的体验，所以要单独创建一个loading状态作区分

  const {
    run: getChannels,
    data: getChannelsQuery,
    loading: loadingGetChannels,
  } = useRequest(() => getChannelsAction({ userId }), {
    ready: !!userId,
    refreshDeps: [refreshQuery],
    onSuccess: (data) => {
      setChannels(data.data[0].channel)
      setIsWechatValidationRefresh(false)
    },
  })

  const { run: deleteChannel, loading: loadingDeleteChannel } = useRequest(
    deleteChannelAction,
    {
      manual: true,
      onSuccess: (data) => {
        showSuccessToast("推送渠道删除成功")
        getChannels()
        onDeleteChannelCallback?.(data.data[0].channel)
      },
      onError: () => {
        showErrorToast("推送渠道删除失败")
      },
    },
  )

  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    open: boolean
    channel?: Channel
  }>({ open: false })

  const [isEmailSettingDialogOpen, setIsEmailSettingDialogOpen] =
    useState(false)
  const [isWechatValidationDialogOpen, setIsWechatValidationDialogOpen] =
    useState(false)
  const targetEmailRef = useRef<string | null>(null)
  const targetWechatRef = useRef<string | null>(null)

  const empty = !channels.length

  return (
    <div className="flex min-h-40 flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">推送渠道</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => getChannels()}
          disabled={loadingGetChannels}
        >
          <RefreshCcw
            className={cn("size-4", loadingGetChannels && "animate-spin")}
          />
          <span className="sr-only">刷新渠道列表</span>
        </Button>
      </div>
      <>
        {loadingGetChannels && !isWechatValidationRefresh ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12" />
            ))}
          </>
        ) : (
          <>
            {empty ? (
              <div className="col-span-full flex size-full h-40 flex-col items-center justify-center gap-3 rounded-md text-xs">
                <span>
                  您还没有任何订阅渠道，点击{buttonPositionText}按钮添加
                </span>
                {buttonPositionText === "下方" && (
                  <AddChannelDialog
                    onSuccessCallback={(newChannel) => {
                      getChannels()
                      const channel = newChannel.channel[0]
                      if (channel.name !== ChannelName.email) {
                        setSelectedChannels([
                          ...selectedChannels,
                          {
                            id: channel.id.toString(),
                            name: channel.name,
                            address: channel.address || "",
                          },
                        ])
                      }
                    }}
                    variant="outline"
                    className="h-8"
                  />
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-2",
                  columns === 1 && "grid-cols-1",
                  columns === 2 && "grid-cols-2",
                  columns === 3 && "grid-cols-3",
                  columns === 4 && "grid-cols-4",
                  columns > 4 && "grid-cols-4",
                )}
              >
                {getChannelsQuery?.data[0].channel.map((channel) =>
                  renderChannel(
                    channel,
                    selectedChannels,
                    setSelectedChannels,
                    setOpenDeleteDialog,
                    deleteChannel,
                    userId,
                    getChannels,
                    openDeleteDialog,
                    isEmailSettingDialogOpen,
                    setIsEmailSettingDialogOpen,
                    targetEmailRef,
                    isWechatValidationDialogOpen,
                    setIsWechatValidationDialogOpen,
                    targetWechatRef,
                  ),
                )}
                {showAddButtonAtEnd && (
                  <AddChannelDialog
                    onSuccessCallback={(newChannel) => {
                      getChannels()
                      const channel = newChannel.channel[0]
                      if (channel.name !== ChannelName.email) {
                        setSelectedChannels([
                          ...selectedChannels,
                          {
                            id: channel.id.toString(),
                            name: channel.name,
                            address: channel.address || "",
                          },
                        ])
                      }
                    }}
                    variant="outline"
                    className="h-full"
                  />
                )}
              </div>
            )}
          </>
        )}
      </>

      <EmailSettingDialog
        isOpened={isEmailSettingDialogOpen}
        setIsOpened={setIsEmailSettingDialogOpen}
        userId={userId}
        email={targetEmailRef.current}
        isEmailVerified={false}
        validationType="infoChannelEmailValidation"
      />

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
    </div>
  )
}
