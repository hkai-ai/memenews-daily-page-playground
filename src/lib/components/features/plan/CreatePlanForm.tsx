"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRequest } from "ahooks"
import confetti from "canvas-confetti"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Asterisk, CircleHelp, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

import { Switch } from "../../common/ui/switch"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../common/ui/carousel"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../common/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../common/ui/select"
import { ImageCropDialog } from "../../common/image/ImageCropDialog"
import { HintTip } from "../../common/ui/hint-tip"
import { ImageUploader } from "../../common/image/ImageUploader"

import { Button } from "@/lib/components/common/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/lib/components/common/ui/form"
import { Input } from "@/lib/components/common/ui/input"
import { LoadingSkeleton } from "@/lib/components/common/ui/loading-skeleton"
import { Textarea } from "@/lib/components/common/ui/textarea"
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import {
  createPlanAction,
  subscribePlanAction,
  updatePlanAction,
} from "@/lib/api/plan"
import { TemplatePlanCover } from "@/lib/constants"
import { uploadImageAction } from "@/lib/api/common/upload-image"
import { createDoubleByteString } from "@/utils/zod-helpers"
import { delay } from "@/utils"
import { useCreatePlanStore } from "@/lib/store/createPlan"
import { getUserLevel } from "@/lib/api/auth/get-user-level"
import { AccountWithIsSub } from "@/app/(dashboard)/memes/create/_components/Account/AccountList"
import { DOMAINS } from "@/app/(dashboard)/memes/create/_components/CreatePlanFlow/constants"

const CREATE_EDIT_TEXT = {
  create: {
    title: "创建",
    button: "点击创建",
    loading: "创建中",
    subscribeChannelTip: "创建后同时订阅到以下推送渠道",
  },
  edit: {
    title: "修改",
    button: "保存修改",
    loading: "保存中",
    subscribeChannelTip: "修改后同时订阅到以下推送渠道",
  },
} as const

const profileFormSchema = z.object({
  planName: createDoubleByteString({
    max: 14,
    min: 8,
    maxMessage: "meme 名称不能超过7个汉字或14个字母（m和w视为2个字符）",
    minMessage: "meme 名称不能少于4个汉字或8个字母",
  }).refine((val) => val.length > 0, "请填写 meme 名称"),
  planDescription: z
    .string()
    .max(80, {
      message: "meme 描述不能超过80个字符",
    })
    .min(4, {
      message: "meme 描述不能少于4个字符",
    }),
  planAvatarUrl: z
    .string()
    .refine((val) => val.length > 0, "请填写 meme 封面图"),
  planTags: z.array(
    z.object({
      tagName: z.string().refine((val) => val.length > 0, "请填写标签名"),
      tagColor: z
        .string()
        .default("test")
        .refine((val) => val.length > 0, "请填写标签颜色"),
    }),
  ),
  userId: z.string().refine((val) => val.length > 0, "请填写用户名"),
  domain: z.string().refine((val) => val.length > 0, "请选择 meme 领域"),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface CreateEditPlanFormProps {
  type: "create" | "edit"
  selectedAccounts: AccountWithIsSub[]
  memeCode?: string
}

export function CreatePlanForm({
  type,
  selectedAccounts,
  memeCode,
}: CreateEditPlanFormProps) {
  const { data: session } = useSession()

  const router = useRouter()
  const userId = session?.user?.id || ""

  const {
    planId,
    planName,
    planDescription,
    planAvatarUrl,
    isPublic,
    domain,
    selectedChannel,
    setPlanName,
    setPlanDescription,
    setPlanAvatarUrl,
    setIsPublic,
    setDomain,
    reset,
  } = useCreatePlanStore()

  const defaultValues: Partial<ProfileFormValues> = {
    planName,
    planDescription,
    planAvatarUrl,
    userId,
    planTags: [],
    domain,
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // 监听表单变化，同步到 store
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.planName) setPlanName(value.planName)
      if (value.planDescription) setPlanDescription(value.planDescription)
      if (value.domain) setDomain(value.domain)
      if (value.planAvatarUrl) setPlanAvatarUrl(value.planAvatarUrl)
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  const {
    data: createPlanQueryRes,
    run: createPlan,
    loading: loadingCreatePlan,
  } = useRequest(createPlanAction, {
    manual: true,
    ready: !!userId && type === "create",
    async onSuccess(data) {
      showSuccessToast(`${CREATE_EDIT_TEXT[type].title} meme 成功🎉！`)

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // await delay(500)

      // if (selectedChannel.length > 0) {
      //   subscribePlan({
      //     planId: data.data.planId,
      //     userId,
      //     channel: selectedChannel,
      //   })
      // }

      // 成功后重置 store
      reset()

      await delay(500)
      router.push(`/memes/my/created`)
    },
    onError(error: any) {
      showErrorToast(
        `${CREATE_EDIT_TEXT[type].title} meme 失败，${error.message.statusText}`,
      )
    },
  })

  const { run: subscribePlan } = useRequest(subscribePlanAction, {
    manual: true,
    ready: !!createPlanQueryRes,
    onSuccess() {
      showSuccessToast(`订阅成功🎉！`)
    },
    onError(error: any) {
      showErrorToast(`订阅失败: ${error.message.statusText}`)
    },
  })

  const { run: updatePlan, loading: loadingUpdatePlan } = useRequest(
    updatePlanAction,
    {
      manual: true,
      ready: !!userId && type === "edit",
      async onSuccess() {
        showSuccessToast(`${CREATE_EDIT_TEXT[type].title} meme 成功🎉！`)

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })

        await delay(500)
        router.push(`/memes/my/created`)
      },
      onError(error: any) {
        showErrorToast(
          `${CREATE_EDIT_TEXT[type].title} meme 失败，${error.message.statusText}`,
        )
      },
    },
  )

  const { loading: loadingUploadImage, run: uploadImage } = useRequest(
    uploadImageAction,
    {
      manual: true,
      onSuccess(data) {
        setPlanAvatarUrl(data.data.url)
        form.setValue("planAvatarUrl", data.data.url)
        form.trigger("planAvatarUrl")
        showSuccessToast(`上传成功🎉！`)
      },
      onError(error: any) {
        showErrorToast(`上传失败: ${error.message.statusText}`)
      },
    },
  )

  const handleSubmit = () => {
    const formData = form.getValues()
    if (type === "create") {
      createPlan({
        ...formData,
        planId: "",
        subscribeSource: selectedAccounts
          .filter((account) => !account.isPersonal)
          .map((account) => account.id),
        isShared: isPublic,
        planAvatarUrl: planAvatarUrl,
        domain: formData.domain,
        isRemake: false,
        memeCode,
        personalInfoSource: selectedAccounts
          .filter((account) => account.isPersonal)
          .map((account) => account.id),
      })
    } else {
      updatePlan({
        ...formData,
        planId,
        subscribeSource: selectedAccounts
          .filter((account) => !account.isPersonal)
          .map((account) => account.id),
        planAvatarUrl: planAvatarUrl,
        domain: formData.domain,
        isRemake: false,
        personalInfoSource: selectedAccounts
          .filter((account) => account.isPersonal)
          .map((account) => account.id),
      })
    }
  }

  const isLoading = type === "create" ? loadingCreatePlan : loadingUpdatePlan

  const disabledSubmit =
    !form.watch("planName") ||
    !form.watch("planDescription") ||
    !planAvatarUrl ||
    isLoading ||
    loadingUploadImage ||
    !form.watch("domain")

  const [files, setFiles] = useState<File[]>([])

  /**
   * @description 可能因为sheet组件和tooltip组件的渲染顺序问题，
   * 导致被sheet组件包裹的tooltip在一打开就会自动弹出，所以这里手动控制tooltip的显示时机
   */
  const [shouldRenderTooltip, setShouldRenderTooltip] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRenderTooltip(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")

  const handleFileChange = (newFiles: File[] | null) => {
    if (newFiles && newFiles.length > 0) {
      setFiles(newFiles)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setCropDialogOpen(true)
      }
      reader.readAsDataURL(newFiles[0])
    }
  }

  const handleCropComplete = (croppedBlob: Blob) => {
    const formData = new FormData()
    formData.append("image", croppedBlob)
    uploadImage({ image: formData })
    setCropDialogOpen(false)
    setFiles([])
  }

  const handleCloseDialog = () => {
    setCropDialogOpen(false)
    setFiles([])
  }


  const {
    /**
     * 用户等级
     */
    data: userLevelQueryRes,
    /**
     * 手动重新获取用户等级，同时刷新data数据
     */
    run: getLatestUserLevel,
  } = useRequest(
    () => getUserLevel({ userId }),
    {
      ready: !!userId,
    },
  )

  const needsActivationCode = userLevelQueryRes?.data.userLevel === "Regular"

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="planName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                meme 名称
                {shouldRenderTooltip && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip defaultOpen={false}>
                      <TooltipTrigger onClick={(e) => e.preventDefault()}>
                        <CircleHelp className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={5}>
                        <p className="text-xs">
                          ❓ 为什么我们严格限制字数？
                          这是为了在卡片上有更好的呈现效果
                          <br />
                          如果您有更好的建议，欢迎在我们的反馈入口给我们留言
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <Asterisk className="size-4 text-red-500" />
              </FormLabel>

              <FormControl>
                <Input placeholder="标题 4-7 个字" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                meme 介绍
                <Asterisk className="mb-1 ml-1 inline size-4 text-red-500" />
              </FormLabel>

              <FormControl>
                <Textarea
                  placeholder="让你的订阅者了解你的 meme"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planAvatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                上传封面
                <Asterisk className="mb-1 ml-1 inline size-4 text-red-500" />
              </FormLabel>

              <FormControl>
                <ImageUploader
                  value={planAvatarUrl}
                  onChange={(url) => {
                    setPlanAvatarUrl(url)
                    form.setValue("planAvatarUrl", url)
                    form.trigger("planAvatarUrl")
                  }}
                  withCrop
                  aspectRatio={16 / 9}
                  className="w-full"
                />
              </FormControl>

              <span className="text-xs text-muted-foreground">推荐图片</span>
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full max-w-sm"
              >
                <CarouselContent>
                  {TemplatePlanCover.map((cover, index) => (
                    <CarouselItem
                      key={cover}
                      className="md:basis-1/2 lg:basis-1/4"
                    >
                      <img
                        src={cover}
                        alt="Plan Cover"
                        className="rounded-md"
                        onClick={() => {
                          setPlanAvatarUrl(cover)
                        }}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                meme 领域
                <HintTip
                  label="设置 meme 的领域可以帮助您获得更好的总结效果"
                  side="right"
                >
                  <CircleHelp className="size-4" />
                </HintTip>
                <Asterisk className="inline size-4 text-red-500" />
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择 meme 领域" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DOMAINS.map((domain) => (
                    <SelectItem key={domain.id} value={domain.value}>
                      {domain.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="flex gap-1">
                  公开 meme
                  <Asterisk className="inline size-4 text-red-500" />
                </FormLabel>
                <FormDescription>
                  公开 meme 后，其他用户可以订阅您的 meme
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className="data-[state=checked]:bg-green-500"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === "edit" ? (
          <Button
            disabled={disabledSubmit}
            type="submit"
            onClick={handleSubmit}
            className="mt-2 w-full"
          >
            {isLoading ? (
              <LoadingSkeleton>
                {CREATE_EDIT_TEXT[type].loading}
              </LoadingSkeleton>
            ) : (
              <>{CREATE_EDIT_TEXT[type].button}</>
            )}
          </Button>
        ) : needsActivationCode ? (
          <Button
            disabled={disabledSubmit}
            type="submit"
            onClick={handleSubmit}
            className="mt-2 w-full"
          >
            {isLoading ? (
              <LoadingSkeleton>
                {CREATE_EDIT_TEXT[type].loading}
              </LoadingSkeleton>
            ) : (
              <>{CREATE_EDIT_TEXT[type].button}</>
            )}
          </Button>
        ) : (
          <Button
            disabled={disabledSubmit}
            type="submit"
            onClick={handleSubmit}
            className="mt-2 w-full"
          >
            {isLoading ? (
              <LoadingSkeleton>
                {CREATE_EDIT_TEXT[type].loading}
              </LoadingSkeleton>
            ) : (
              <>{CREATE_EDIT_TEXT[type].button}</>
            )}
          </Button>
        )}
      </form>

      <ImageCropDialog
        open={cropDialogOpen}
        onClose={handleCloseDialog}
        image={selectedImage}
        onCropComplete={handleCropComplete}
      />
    </Form>
  )
}
