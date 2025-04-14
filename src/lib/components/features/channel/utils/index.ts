import { Channel, ChannelName } from "@/types/channel/model"

/**
 * 获取输入框的详细信息
 * @mention 如果是微信群，那么需要的是激活码
 * @param channelName 渠道名称
 * @returns 输入框的详细信息
 */
export const getInputDetails = (channelName: ChannelName) => {
  if (channelName === ChannelName.wxBot) {
    return { label: "激活码", placeholder: "请输入激活码", field: "secret" }
  }

  return { label: "地址", placeholder: "e.g. example@qq.com", field: "address" }
}

/**
 * 判断添加按钮是否禁用
 * @param channelForm 渠道表单
 * @param loadingAddChannel 添加渠道的loading状态
 * @returns 是否禁用
 */
export function isAddButtonDisabled(
  channelForm: { name: ChannelName; address: string; secret?: string },
  loadingAddChannel: boolean,
): boolean {
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  if (loadingAddChannel) return true

  if (
    (channelForm.name === ChannelName.email ||
      channelForm.name === ChannelName.邮箱) &&
    (!channelForm.address || !isValidEmail(channelForm.address))
  ) {
    return true
  }

  switch (channelForm.name) {
    case ChannelName.wxBot:
      return true
    case ChannelName.dingTalk:
      return !channelForm.address || !channelForm.secret || loadingAddChannel
    case ChannelName.email:
      return !channelForm.address || loadingAddChannel
    case ChannelName.邮箱:
      return !channelForm.address || loadingAddChannel
    default:
      return true
  }
}

/**
 * 切换渠道选择状态
 * @param channel 渠道
 * @param selectedChannels 已选渠道
 * @param setSelectedChannels 设置已选渠道
 */
export function toggleChannelSelection(
  channel: Channel,
  selectedChannels: Channel[],
  setSelectedChannels: (channels: Channel[]) => void,
) {
  const isSelected = selectedChannels.some((field) => field.id === channel.id)

  if (isSelected) {
    setSelectedChannels(
      selectedChannels.filter((field) => field.id !== channel.id),
    )
  } else {
    setSelectedChannels([...selectedChannels, channel])
  }
}
