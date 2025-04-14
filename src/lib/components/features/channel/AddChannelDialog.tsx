"use client"

import { useState, useCallback } from "react"
import { useRequest } from "ahooks"
import { Check, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

import { cn } from "../../../utils"
import { HintTip } from "../../common/ui/hint-tip"
import { Badge } from "../../common/ui/badge"
import { PreviewDialog } from "../../common/ui/preview-dialog"

import { WechatServiceCard } from "./WechatServiceCard"

import {
  CHANNEL_OPTIONS,
  CHANNEL_OPTIONS_SINGLE_EMAIL,
  CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT,
} from "@/lib/constants/channel"
import { Button, ButtonProps } from "@/lib/components/common/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/lib/components/common/ui/dialog"
import { Input } from "@/lib/components/common/ui/input"
import { Label } from "@/lib/components/common/ui/label"
import { LoadingSkeleton } from "@/lib/components/common/ui/loading-skeleton"
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { Channel, ChannelName } from "@/types/channel/model"
import { addChannelAction } from "@/lib/api/channel"
import { generateSecretAction } from "@/lib/api/channel/generate-secret"
import { delay } from "@/utils"
import { sendInfoChannelEmailValidation } from "@/lib/serverAction/email"
import { UserLevel } from "@/types/plan"
import { getUserLevel } from "@/lib/api/auth/get-user-level"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/common/ui/accordion"

interface AddChannelFormProps {
  userId: string
  channelForm: ChannelFormState
  isAllowed: boolean
  onChannelFormChange: (form: Partial<ChannelFormState>) => void
  onGenerateSecret: () => void
  loadingGenerateSecret: boolean
}

interface AddChannelDialogProps {
  channels?: Channel[]
  mildOverlay?: boolean
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
  dialogOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccessCallback?: (data: {
    id: number
    userId: string
    channel: Channel[]
  }) => void
}

interface ChannelFormState {
  name: ChannelName
  address: string
  secret?: string
  wechatState?: WechatState
}

export interface WechatState {
  isBound: boolean
  userName: string
  qrCode?: {
    url: string
    expire_seconds: number
    ticket: string
  }
}

const HelpDocFrame: React.FC<{
  channelName: ChannelName
  channelLabel: string
}> = ({ channelName, channelLabel }) => {
  const helpDocUrls: Partial<Record<ChannelName, string>> = {
    [ChannelName.dingTalk]:
      "https://m0e8x072xo3.feishu.cn/wiki/ZsCHwPiSii9A3ZkK32scpaTVnBc",
    [ChannelName.feishu]:
      "https://m0e8x072xo3.feishu.cn/wiki/JKRGwJrl3itfZkkf5rMcjjaLngg",
    [ChannelName.wxBot]:
      "https://m0e8x072xo3.feishu.cn/docx/BwZ5dQFWFocvrOxz59Xc8uL4n1c",
  }

  const previewImgUrls: Partial<Record<ChannelName, string>> = {
    [ChannelName.email]: "/push-preview/email-push-preview.png",
    // [ChannelName.dingTalk]:
    //   "/public/push-preview/dingtalk-push-preview.png",
    [ChannelName.feishu]: "/push-preview/feishu-push-preview.png",
    [ChannelName.wxBot]: "/push-preview/wechatbot-push-preview.png",
    [ChannelName.wechat]: "/push-preview/wechat-push-preview.png",
  }

  const url = helpDocUrls[channelName]

  const showWebhookExplanation =
    channelName === ChannelName.dingTalk || channelName === ChannelName.feishu

  const qaItems = [
    ...(url
      ? [
          {
            id: "help-doc",
            title: `查看${channelLabel}配置帮助    【重要⚠️】`,
            content: (
              <div>
                <Button
                  variant="outline"
                  asChild
                  className="mb-2 w-full animate-pulse bg-muted"
                >
                  <Link href={url} target="_blank">
                    查看文档
                  </Link>
                </Button>
                <iframe
                  src={url}
                  className="h-[600px] w-full pt-4"
                  title={`${channelLabel} 帮助文档`}
                />
              </div>
            ),
          },
        ]
      : []),
    ...(showWebhookExplanation
      ? [
          {
            id: "webhook",
            title: "什么是 Webhook？",
            content: `Webhook 是一种用于系统间自动通信的机制。在${
              channelLabel
            }中，Webhook 是一个特殊的网址（URL），当您成功配置后，我们的系统会自动将消息推送到对应的群组中。`,
          },
        ]
      : []),
    {
      id: "preview",
      title: `预览${channelLabel}渠道的推送效果`,
      content: previewImgUrls[channelName] ? (
        <PreviewDialog
          trigger={
            <div className="flex-1">
              <HintTip label="单击预览大图">
                <>
                  <div className="mx-auto h-full w-fit overflow-y-scroll">
                    <Image
                      src={previewImgUrls[channelName] || ""}
                      alt={`Photo by ${channelLabel}`}
                      className="w-60 object-cover object-top"
                      width={600}
                      height={600}
                    />
                  </div>
                </>
              </HintTip>
            </div>
          }
        >
          <div className="mt-6 h-[90svh] overflow-y-scroll">
            <Image
              src={previewImgUrls[channelName] || ""}
              alt={`Photo by ${channelLabel}`}
              className="w-[50rem]"
              width={2000}
              height={2000}
            />
          </div>
        </PreviewDialog>
      ) : (
        <div className="text-sm text-muted-foreground">该渠道暂无预览</div>
      ),
    },
  ]

  return (
    <div className="mt-4">
      <Accordion type="single" collapsible className="w-full -space-y-px">
        {qaItems.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:z-10 has-focus-visible:ring-[3px] relative border bg-background px-4 py-1 outline-none first:rounded-t-md last:rounded-b-md last:border-b"
          >
            <AccordionTrigger className="justify-start gap-3 rounded-md py-2 text-[15px] leading-6 outline-none hover:no-underline focus-visible:ring-0 [&>svg]:-order-1">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="whitespace-pre-line pb-2 ps-7 text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

// 提取表单渲染逻辑到独立组件
const ChannelForm: React.FC<AddChannelFormProps> = ({
  userId,
  channelForm,
  isAllowed,
  onChannelFormChange,
  onGenerateSecret,
  loadingGenerateSecret,
}) => {
  const currentChannel = CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT.find(
    (c) => c.name === channelForm.name,
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChannelFormChange({ [name]: value })
  }

  const renderForm = () => {
    const formBaseClasses = "grid gap-6 px-1"
    const inputWrapperClasses = "grid grid-cols-4 items-center gap-4"
    const labelClasses = "text-right text-sm font-medium text-muted-foreground"
    const inputClasses = "col-span-2"

    switch (channelForm.name) {
      case ChannelName.email:
      case ChannelName.邮箱:
        return (
          <div className={formBaseClasses}>
            <div className={inputWrapperClasses}>
              <Label htmlFor="email" className={labelClasses}>
                地址
              </Label>
              <div className={cn(inputClasses, "space-y-1")}>
                <Input
                  type="email"
                  id="email"
                  name="address"
                  placeholder={
                    isAllowed ? "请输入邮箱地址" : "升级到 Pro 以使用此功能"
                  }
                  className="placeholder:text-sm"
                  value={channelForm.address}
                  onChange={handleInputChange}
                  disabled={!isAllowed}
                />
                {channelForm.address && !isValidEmail(channelForm.address) && (
                  <p className="text-xs font-medium text-destructive">
                    请输入有效的邮箱地址
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case ChannelName.wxBot:
        return (
          <div className={formBaseClasses}>
            <div className={inputWrapperClasses}>
              <Label htmlFor="secret" className={labelClasses}>
                激活码
              </Label>
              <div className={inputClasses}>
                {channelForm.secret ? (
                  <Input
                    id="secret"
                    name="secret"
                    value={channelForm.secret}
                    onClick={() => isAllowed && onGenerateSecret()}
                    readOnly
                    disabled={!isAllowed}
                  />
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => onGenerateSecret()}
                    disabled={loadingGenerateSecret || !isAllowed}
                  >
                    {loadingGenerateSecret ? (
                      <LoadingSkeleton>生成中</LoadingSkeleton>
                    ) : !isAllowed ? (
                      "升级到 Pro 以使用此功能"
                    ) : (
                      "生成激活码"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )

      case ChannelName.dingTalk:
        return (
          <div className={formBaseClasses}>
            <div className={inputWrapperClasses}>
              <Label htmlFor="webhook" className={labelClasses}>
                Webhook
              </Label>
              <Input
                id="webhook"
                name="address"
                placeholder={
                  isAllowed ? "请输入Webhook地址" : "升级到 Pro 以使用此功能"
                }
                className={inputClasses}
                value={channelForm.address}
                onChange={handleInputChange}
                disabled={!isAllowed}
              />
            </div>
            <div className={inputWrapperClasses}>
              <Label htmlFor="secret" className={labelClasses}>
                密钥
              </Label>
              <Input
                id="secret"
                name="secret"
                placeholder={
                  isAllowed ? "请输入密钥" : "升级到 Pro 以使用此功能"
                }
                className={inputClasses}
                value={channelForm.secret}
                onChange={handleInputChange}
                disabled={!isAllowed}
              />
            </div>
          </div>
        )

      case ChannelName.feishu:
        return (
          <div className={formBaseClasses}>
            <div className={inputWrapperClasses}>
              <Label htmlFor="webhook" className={labelClasses}>
                Webhook
              </Label>
              <Input
                id="webhook"
                name="address"
                placeholder={
                  isAllowed ? "请输入Webhook地址" : "升级到 Pro 以使用此功能"
                }
                className={inputClasses}
                value={channelForm.address}
                onChange={handleInputChange}
                disabled={!isAllowed}
              />
            </div>
          </div>
        )

      case ChannelName.wechat:
        return (
          <div
            className={cn(formBaseClasses, "flex flex-col items-center gap-2")}
          >
            <p className="text-sm text-muted-foreground">
              成功绑定服务号激活后，只需要在订阅时勾选微信服务号选项，即可收到推送。
            </p>
            <div className="mt-4">
              <WechatServiceCard userId={userId} />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {renderForm()}
      <HelpDocFrame
        channelName={channelForm.name}
        channelLabel={
          CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT.find(
            (c) => c.name === channelForm.name,
          )?.label || ""
        }
      />
    </>
  )
}

// 提取辅助函数
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// 提取渠道选择组件
interface ChannelSelectorProps {
  channelForm: ChannelFormState
  onChannelSelect: (channel: ChannelFormState) => void
  isChannelAllowed: (
    channel: (typeof CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT)[0],
  ) => boolean
}

const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  channelForm,
  onChannelSelect,
  isChannelAllowed,
}) => (
  <div className="flex flex-wrap items-center justify-center gap-4">
    {CHANNEL_OPTIONS_SINGLE_EMAIL.map((channel) => (
      <HintTip
        key={channel.name}
        label={channel.disabled ? "前面的渠道，以后再来探索吧！" : undefined}
        disabled={!channel.disabled}
      >
        <Button
          key={channel.name}
          variant="outline"
          className={cn(
            "relative flex size-32 flex-col items-center justify-center",
            channelForm.name === channel.name && "bg-accent",
            channel.disabled && "cursor-not-allowed opacity-50",
          )}
          onClick={() => {
            if (channel.disabled) return
            onChannelSelect({
              name: channel.name,
              address: "",
              secret: "",
            })
          }}
        >
          {channel.icon({ className: "size-10" })}
          <span className="text-xs">{channel.label}</span>

          {!isChannelAllowed(channel) && (
            <Badge variant="pro" className="absolute -right-4 -top-2 text-xs">
              Pro
            </Badge>
          )}
        </Button>
      </HintTip>
    ))}
  </div>
)

export function AddChannelDialog({
  channels,
  mildOverlay = false,
  variant = "default",
  size = "default",
  className,
  dialogOpen,
  onOpenChange,
  onSuccessCallback,
}: AddChannelDialogProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id || ""

  const { data: userLevelQueryRes } = useRequest(
    () => getUserLevel({ userId }),
    {
      ready: !!userId,
    },
  )

  const [internalDialogOpen, setInternalDialogOpen] = useState(false)
  const [operateSuccess, setOperateSuccess] = useState(false)
  const [step, setStep] = useState<"select" | "configure">("select")
  const [channelForm, setChannelForm] = useState<ChannelFormState>({
    name: CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT[0].name,
    address: "",
    secret: "",
  })

  const isControlled = dialogOpen !== undefined
  const isOpen = isControlled ? dialogOpen : internalDialogOpen
  const setIsOpen = isControlled ? onOpenChange : setInternalDialogOpen

  const handleChannelFormChange = (form: Partial<ChannelFormState>) => {
    setChannelForm((pre) => ({ ...pre, ...form }))
  }

  const handleChannelSelect = (channel: ChannelFormState) => {
    setChannelForm(channel)
    setStep("configure")
  }

  const handleBack = () => {
    setStep("select")
  }

  const isChannelAllowed = useCallback(
    (channelOption: (typeof CHANNEL_OPTIONS)[0]) => {
      return channelOption.allowedLevels.includes(
        userLevelQueryRes?.data.userLevel as UserLevel,
      )
    },
    [userLevelQueryRes?.data.userLevel],
  )

  const { run: generateSecret, loading: loadingGenerateSecret } = useRequest(
    generateSecretAction,
    {
      manual: true,
      onSuccess: (data) => {
        if (data.statusCode === 400) {
          showErrorToast(data.statusText)
          return
        }

        if (data.statusText !== "Created") {
          showErrorToast(data.statusText)
          const secret = data.data.find((item) => !item.isActive)?.code
          handleChannelFormChange({ secret })
          setIsOpen?.(false)
          return
        }

        showSuccessToast("生成激活码成功")
        const secret = data.data[0]?.code
        handleChannelFormChange({ secret })
        onSuccessCallback?.({
          id: 0,
          userId: "",
          channel: [{ id: "", name: ChannelName.wxBot, address: "", secret }],
        })
        setIsOpen?.(false)
      },
      onError: (error: any) => {
        showErrorToast(`生成激活码失败: ${error.message.statusText}`)
      },
    },
  )

  const { run: addChannel, loading: loadingAddChannel } = useRequest(
    addChannelAction,
    {
      manual: true,
      onSuccess: async (data) => {
        if (data.statusCode === 400) {
          showErrorToast(data.statusText)
          return
        }
        setOperateSuccess(true)
        onSuccessCallback?.({
          ...data.data,
          channel: data.data.channel,
        })

        if (
          channelForm.name === ChannelName.email ||
          channelForm.name === ChannelName.邮箱
        ) {
          try {
            const result = await sendInfoChannelEmailValidation(
              userId,
              channelForm.address,
            )
            if (result.success === false) {
              showErrorToast(
                `我们在尝试发送验证邮件的时候遇到了问题，错误为：${result.message} \n 需要您在后续手动验证邮箱。`,
              )
            } else {
              showSuccessToast(
                `我们向您的邮箱里发送了一条验证邮件\n 😘还请您及时验证。`,
              )
            }
          } catch (error) {
            showErrorToast(
              `我们在尝试发送验证邮件的时候遇到了问题，错误为：${(error as Error).message} \n 需要您在后续手动验证邮箱。`,
            )
          }
        }
      },
      onError: (error: any) => {
        showErrorToast(`添加失败,${error.message.statusText}`)
      },
      async onFinally() {
        await delay(1000)
        setIsOpen?.(false)
        setOperateSuccess(false)
      },
    },
  )

  const isAddButtonDisabled = () => {
    if (loadingAddChannel) return true

    switch (channelForm.name) {
      case ChannelName.email:
      case ChannelName.邮箱:
        return !channelForm.address || !isValidEmail(channelForm.address)
      case ChannelName.wxBot:
        return !channelForm.secret
      case ChannelName.dingTalk:
        return !channelForm.address || !channelForm.secret
      case ChannelName.feishu:
        return !channelForm.address
      case ChannelName.wechat:
        return !channelForm.address
      default:
        return true
    }
  }

  const currentChannel = CHANNEL_OPTIONS_SINGLE_EMAIL_WITH_WECHAT.find(
    (c) => c.name === channelForm.name,
  )
  const isAllowed = currentChannel ? isChannelAllowed(currentChannel) : true

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setStep("select")
          }
          setIsOpen?.(open)
        }}
      >
        <DialogTrigger asChild>
          <Button
            size={size}
            variant={variant}
            className={cn("gap-2", className)}
          >
            <Plus className="size-4" />
            {size !== "icon" && "添加推送渠道"}
          </Button>
        </DialogTrigger>
        <DialogContent
          mildOverlay={mildOverlay}
          className={cn("max-h-[calc(100vh-200px)] max-w-4xl overflow-y-auto")}
        >
          <DialogHeader>
            <DialogTitle>
              {step === "select"
                ? "选择推送渠道"
                : `配置${currentChannel?.label || ""}推送渠道`}
            </DialogTitle>
            <DialogDescription>
              {step === "select"
                ? !channels?.length
                  ? "您还没有任何推送渠道，请先选择一个推送渠道"
                  : "请选择您想要添加的推送渠道类型"
                : "请填写以下必要信息以完成配置"}
            </DialogDescription>
          </DialogHeader>

          <div
            className={cn(
              "grid gap-4 py-4",
              step === "select" &&
                "mx-auto flex min-h-[200px] max-w-lg items-center justify-center",
            )}
          >
            {step === "select" ? (
              <ChannelSelector
                channelForm={channelForm}
                onChannelSelect={handleChannelSelect}
                isChannelAllowed={isChannelAllowed}
              />
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="-ml-2 mb-2 w-fit"
                  onClick={handleBack}
                >
                  ← 返回选择渠道
                </Button>
                <ChannelForm
                  userId={userId}
                  channelForm={channelForm}
                  isAllowed={isAllowed}
                  onChannelFormChange={handleChannelFormChange}
                  onGenerateSecret={() => generateSecret({ userId })}
                  loadingGenerateSecret={loadingGenerateSecret}
                />
              </>
            )}
          </div>

          {step === "configure" && (
            <DialogFooter>
              {/* {(channelForm.name === ChannelName.dingTalk ||
                channelForm.name === ChannelName.feishu) && (
                <Button className="h-8 text-xs" variant="outline" asChild>
                  <Link
                    target="_blank"
                    href={
                      channelForm.name === ChannelName.dingTalk
                        ? "https://m0e8x072xo3.feishu.cn/wiki/ZsCHwPiSii9A3ZkK32scpaTVnBc"
                        : channelForm.name === ChannelName.feishu
                          ? "https://m0e8x072xo3.feishu.cn/wiki/JKRGwJrl3itfZkkf5rMcjjaLngg"
                          : ""
                    }
                  >
                    <CircleHelp className="mr-2 size-4" />
                    如何配置
                    {channelForm.name === ChannelName.dingTalk
                      ? "钉钉"
                      : channelForm.name === ChannelName.feishu
                        ? "飞书"
                        : ""}
                    ?
                  </Link>
                </Button>
              )} */}

              {/* {channelForm.name === ChannelName.wxBot ? (
                <Button
                  className="h-9 gap-2 text-xs"
                  disabled
                  variant="outline"
                  asChild
                >
                  <Link
                    target="_blank"
                    href="https://m0e8x072xo3.feishu.cn/docx/BwZ5dQFWFocvrOxz59Xc8uL4n1c"
                  >
                    <CircleHelp className="size-3.5" />
                    如何绑定微信群?
                  </Link>
                </Button>
              ) : ( */}
              <Button
                type="submit"
                className="w-full"
                variant={operateSuccess ? "success" : "default"}
                disabled={isAddButtonDisabled()}
                onClick={() =>
                  addChannel({
                    userId,
                    channel: [
                      {
                        name: channelForm.name,
                        address: channelForm.address,
                        secret: channelForm.secret,
                      },
                    ],
                  })
                }
              >
                {loadingAddChannel ? (
                  <LoadingSkeleton>添加中</LoadingSkeleton>
                ) : (
                  <>
                    {operateSuccess ? (
                      <>
                        <Check className="size-4" />
                        添加成功
                      </>
                    ) : (
                      "添加"
                    )}
                  </>
                )}
              </Button>
              {/* )} */}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
