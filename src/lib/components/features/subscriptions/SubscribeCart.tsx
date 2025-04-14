import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import { showErrorToast } from "../../common/ui/toast"

import { ChannelName, Channel } from "@/types/channel/model"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/common/ui/card"
import { Button } from "@/lib/components/common/ui/button"
import { ChannelListSelect } from "@/lib/components/features/channel/ChannelListSelect"
import { Label } from "@/lib/components/common/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/common/ui/dialog"
import { TemplateSelect } from "@/lib/components/features/template/TemplateSelect"
import { TemplateImages } from "@/lib/constants/template"

export const templateOptions = [
  {
    id: "01",
    name: "中国风",
    previewImg: TemplateImages[0].url,
    disabled: false,
  },
  {
    id: "02",
    name: "敬请期待...",
    disabled: true,
  },
]

export type TemplateOption = (typeof templateOptions)[number]

export interface SubscriptionItem {
  id: string
  channelId: string
  channelAddress: string
  templateId: string
  templateName: string
  title: string
  slogan: string
}

interface SubscribeCartProps {
  onAddToCart: (subscription: Omit<SubscriptionItem, "id">) => void
}

/**
 * @deprecated 已废弃
 */
export function SubscribeCart({ onAddToCart }: SubscribeCartProps) {
  const [selectedChannel, setSelectedChannel] = useState<Channel[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [subscriptionList, setSubscriptionList] = useState<SubscriptionItem[]>(
    [],
  )
  const [editingSubscription, setEditingSubscription] =
    useState<SubscriptionItem | null>(null)
  const [title, setTitle] = useState("")
  const [slogan, setSlogan] = useState("")

  const handleAddToCart = () => {
    if (selectedChannel.length === 0 || !selectedTemplate || !title) {
      return
    }

    const template = templateOptions.find((t) => t.id === selectedTemplate)
    if (!template) return

    const isDuplicate = subscriptionList.some(
      (item) =>
        item.channelId === selectedChannel[0].id &&
        item.templateId === template.id,
    )

    if (isDuplicate) {
      showErrorToast("该推送渠道和模版组合已存在")
      return
    }

    const newSubscription: SubscriptionItem = {
      id: `${selectedChannel[0].id}-${selectedTemplate}-${Date.now()}`,
      channelId: selectedChannel[0].id,
      channelAddress: selectedChannel[0].address,
      templateId: template.id,
      templateName: template.name,
      title,
      slogan,
    }

    setSubscriptionList((prev) => [...prev, newSubscription])
    onAddToCart({
      channelId: newSubscription.channelId,
      channelAddress: newSubscription.channelAddress,
      templateId: newSubscription.templateId,
      templateName: newSubscription.templateName,
      title: newSubscription.title,
      slogan: newSubscription.slogan,
    })

    // 重置选择
    setSelectedChannel([])
    setSelectedTemplate("")
    setTitle("")
    setSlogan("")
  }

  const handleRemoveSubscription = (id: string) => {
    setSubscriptionList((prev) => prev.filter((item) => item.id !== id))
  }

  const handleUpdateSubscription = (updatedSubscription: SubscriptionItem) => {
    const isDuplicate = subscriptionList.some(
      (item) =>
        item.id !== updatedSubscription.id &&
        item.channelId === updatedSubscription.channelId &&
        item.templateId === updatedSubscription.templateId,
    )

    if (isDuplicate) {
      showErrorToast("该推送渠道和模版组合已存在")
      return
    }

    setSubscriptionList((prev) =>
      prev.map((item) =>
        item.id === updatedSubscription.id ? updatedSubscription : item,
      ),
    )
    setEditingSubscription(null)
  }

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>创建订阅</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>选择推送渠道</Label>
            <ChannelListSelect
              selectedChannels={selectedChannel}
              setSelectedChannels={setSelectedChannel}
            />
          </div>

          <div className="space-y-2">
            <Label>选择推送模版</Label>
            <TemplateSelect
              value={selectedTemplate}
              onChange={setSelectedTemplate}
              templates={templateOptions}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="请输入标题"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slogan">Slogan</Label>
            <input
              id="slogan"
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="请输入 slogan（可选）"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleAddToCart}
            disabled={
              selectedChannel.length === 0 || !selectedTemplate || !title
            }
            className="w-full"
          >
            添加到订阅列表
          </Button>
        </CardFooter>
      </Card>

      {subscriptionList.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-medium">已选择的订阅</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {subscriptionList.map((subscription) => (
              <div
                key={subscription.id}
                className="group relative aspect-square rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setEditingSubscription(subscription)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveSubscription(subscription.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="line-clamp-2 text-sm font-medium">
                      {subscription.title}
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {subscription.templateName}
                    </div>
                  </div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">
                    {subscription.channelAddress}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={!!editingSubscription}
        onOpenChange={() => setEditingSubscription(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑订阅</DialogTitle>
          </DialogHeader>
          {editingSubscription && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">标题</Label>
                <input
                  id="edit-title"
                  type="text"
                  value={editingSubscription.title}
                  onChange={(e) =>
                    handleUpdateSubscription({
                      ...editingSubscription,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="请输入标题"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slogan">Slogan</Label>
                <input
                  id="edit-slogan"
                  type="text"
                  value={editingSubscription.slogan}
                  onChange={(e) =>
                    handleUpdateSubscription({
                      ...editingSubscription,
                      slogan: e.target.value,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="请输入 slogan（可选）"
                />
              </div>

              <div className="space-y-2">
                <Label>选择推送渠道</Label>
                <ChannelListSelect
                  selectedChannels={[
                    {
                      id: editingSubscription.channelId,
                      name: ChannelName.email,
                      address: editingSubscription.channelAddress,
                    },
                  ]}
                  setSelectedChannels={(channels) => {
                    if (channels.length > 0) {
                      handleUpdateSubscription({
                        ...editingSubscription,
                        channelId: channels[0].id,
                        channelAddress: channels[0].address,
                      })
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>选择推送模版</Label>
                <TemplateSelect
                  value={editingSubscription.templateId}
                  onChange={(value) => {
                    const template = templateOptions.find((t) => t.id === value)
                    if (template) {
                      handleUpdateSubscription({
                        ...editingSubscription,
                        templateId: template.id,
                        templateName: template.name,
                      })
                    }
                  }}
                  templates={templateOptions}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
