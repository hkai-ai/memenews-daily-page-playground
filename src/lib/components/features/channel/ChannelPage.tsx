"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useRequest } from "ahooks"

import { EmailSettingDialog } from "../settings/EmailSettingDialog"
import { Shell } from "../../common/layout/Shell"

import { AddChannelDialog } from "./AddChannelDialog"
import { ChannelTableView } from "./ChannelTableView"
import { ChannelPageSkeleton } from "./ChannelPageSkeleton"

import { Channel, ChannelName } from "@/types/channel/model"
import { deleteChannelAction, getChannelsAction } from "@/lib/api/channel"
import { IllustrationNoContent } from "@/lib/components/common/illustrations"
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"

interface ChannelWithDefault extends Channel {
  isDefault: boolean
}

export function ChannelPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id as string
  const [channels, setChannels] = React.useState<ChannelWithDefault[]>([])
  const [isEmailSettingDialogOpen, setIsEmailSettingDialogOpen] =
    React.useState(false)
  const targetEmailRef = React.useRef<string | null>(null)
  const [viewMode, setViewMode] = React.useState<"table" | "group">("table")

  const { run: getChannels, loading: loadingGetChannels } = useRequest(
    () => getChannelsAction({ userId }),
    {
      ready: !!userId,
      onSuccess: (data) => {
        setChannels(
          data.data[0].channel.map((channel, index) => ({
            ...channel,
            isDefault: index === 0,
          })),
        )
      },
    },
  )

  const { run: deleteChannel, loading: loadingDeleteChannel } = useRequest(
    deleteChannelAction,
    {
      manual: true,
      onSuccess: () => {
        showSuccessToast("推送渠道删除成功")
        getChannels()
      },
      onError: () => {
        showErrorToast("推送渠道删除失败")
      },
    },
  )

  const handleEmailVerify = (email: string) => {
    targetEmailRef.current = email
    setIsEmailSettingDialogOpen(true)
  }

  const handleDeleteChannel = (
    channelsToDelete: Pick<Channel, "name" | "address" | "secret">[],
  ) => {
    deleteChannel({
      userId,
      channelsToDelete: channelsToDelete.map((channel) => ({
        name: channel.name,
        address: channel.address,
        secret: channel.secret,
      })),
    })
  }

  if (loadingGetChannels) return <ChannelPageSkeleton />

  if (channels.length === 0) {
    return (
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 py-40">
        <IllustrationNoContent />
        <p>您还没有任何订阅渠道，快去添加吧！</p>
        <AddChannelDialog variant="outline" onSuccessCallback={getChannels} />
      </div>
    )
  }

  return (
    <Shell
      variant="sidebar"
      className="container ml-0 w-full max-w-4xl justify-start space-y-4 p-4 pt-6"
    >
      <div className="flex items-center justify-between">
        {/* <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "table" | "group")}
        >
          <TabsList>
            <TabsTrigger value="table">
              <Table2 className="mr-2 size-4" />
              表格视图
            </TabsTrigger>
            <TabsTrigger value="group">
              <LayoutDashboard className="mr-2 size-4" />
              分组视图
            </TabsTrigger>
          </TabsList>
        </Tabs> */}
      </div>

      {/* {viewMode === "table" ? ( */}
      <ChannelTableView
        channels={channels.filter(
          (channel) => channel.name !== ChannelName.wechat,
        )}
        onDeleteChannel={handleDeleteChannel}
        onEmailVerify={handleEmailVerify}
        userId={userId}
      />
      {/* ) : (
        <ChannelGroupView
          userId={userId}
          channels={channels}
          onDeleteChannel={handleDeleteChannel}
          onEmailVerify={handleEmailVerify}
        />
      )} */}

      <EmailSettingDialog
        isOpened={isEmailSettingDialogOpen}
        setIsOpened={setIsEmailSettingDialogOpen}
        userId={userId}
        email={targetEmailRef.current}
        isEmailVerified={false}
        validationType="infoChannelEmailValidation"
      />
    </Shell>
  )
}
