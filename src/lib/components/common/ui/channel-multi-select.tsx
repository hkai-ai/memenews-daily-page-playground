"use client"

import { useState } from "react"
import { useRequest } from "ahooks"
import { useSession } from "next-auth/react"

import { Channel } from "@/types/channel/model"
import MultipleSelector from "@/lib/components/common/ui/multiselect"
import { getChannelsAction } from "@/lib/api/channel"

interface ChannelMultiSelectProps {
  value?: Channel[]
  onChange?: (channels: Channel[]) => void
}

/**
 * 这是一个业务组件，用于多选推送渠道
 *
 */
export default function ChannelMultiSelect({
  value,
  onChange,
}: ChannelMultiSelectProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id || ""
  const [channels, setChannels] = useState<Channel[]>([])

  const { loading: loadingChannels } = useRequest(
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

  return (
    <MultipleSelector
      commandProps={{
        label: "Select frameworks",
      }}
      value={value?.map((channel) => ({
        value: channel.id,
        label: channel.address,
      }))}
      onChange={(selectedOptions) => {
        const selectedChannels = channels.filter((channel) =>
          selectedOptions.some((option) => option.value === channel.id),
        )
        onChange?.(selectedChannels)
      }}
      placeholder="选择推送渠道"
      hideClearAllButton
      hidePlaceholderWhenSelected
      emptyIndicator={
        loadingChannels ? (
          <p className="text-center text-sm">加载中...</p>
        ) : (
          <p className="text-center text-sm">暂无推送渠道</p>
        )
      }
      options={channels.map((channel) => ({
        value: channel.id,
        label: channel.address,
      }))}
      creatable
    />
  )
}
