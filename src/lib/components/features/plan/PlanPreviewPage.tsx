"use client"

import { match } from "ts-pattern"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRequest } from "ahooks"
import { Users, ChevronDown, Lock } from "lucide-react"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import { motion } from "framer-motion"

import { Button } from "../../common/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../common/ui/card"
import { Skeleton } from "../../common/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../common/ui/chart"
import { ImageCropDialog } from "../../common/image/ImageCropDialog"
import { ImageUploader } from "../../common/image/ImageUploader"
import { Badge } from "../../common/ui/badge"
import {
  showErrorToast,
  showSuccessToast,
  showInfoToast,
} from "../../common/ui/toast"
import { Textarea } from "../../common/ui/textarea"
import { Label } from "../../common/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../common/ui/select"
import { StatCard } from "../../common/ui/stat-card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../common/ui/alert-dialog"
import { HintTip } from "../../common/ui/hint-tip"

import { ActivePushPopover } from "./ActivePushPopover"

import { createDoubleByteString } from "@/utils/zod-helpers"
import { Separator } from "@/lib/components/common/ui/separator"
import {
  getPlanAction,
  updatePlanAction,
  getPlanStatisticsAction,
  freezePlanAction,
  sharePlanAction,
} from "@/lib/api/plan"
import { HistoryRecords } from "@/types/daily"
import { usePlanOperateStore } from "@/lib/store/planOperate"
import { getDailiesHistoryAction } from "@/lib/api/daily"
import { SubscribeDialog } from "@/lib/components/features/subscriptions"
import { useSubscribeStateStore } from "@/lib/store/subscribeState"
import { DailyNewsCard } from "@/lib/components/features/daily/DailyNewsCard"
import { Input } from "@/lib/components/common/ui/input"
import { Switch } from "@/lib/components/common/ui/switch"
import { VerifiedAvatar } from "@/lib/components/common/ui/vertified-avatar"
import { cn } from "@/lib/utils"
import { ImageAssets } from "@/lib/constants"
import { useCreatePlanStore } from "@/lib/store/createPlan"
import { ScrollContainer } from "@/lib/components/common/ui/scroll-container"
import { uploadImageAction } from "@/lib/api/common/upload-image"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/common/ui/form"
import { DOMAINS } from "@/app/(dashboard)/memes/create/_components/CreatePlanFlow/constants"
import { PlanType } from "@/types/plan"

const DailyNewsCardSkeleton = () => (
  <Card className="h-[248px] min-w-[533px]">
    <CardContent className="p-4">
      <Skeleton className="mb-4 h-6 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
)

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#a4de6c"]

const planFormSchema = z.object({
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
  domain: z.string().refine((val) => val.length > 0, "请选择 meme 领域"),
})

type PlanFormValues = z.infer<typeof planFormSchema>

const PlanDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>

    <div className="space-y-4">
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[100px_1fr] items-center gap-4"
          >
            <Skeleton className="ml-auto h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
    </div>
  </div>
)

export function PlanPreviewPage({
  planId,
  setOpen,
}: {
  planId: string
  setOpen?: (open: boolean) => void
}) {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? ""
  const { setSubscribeState } = useSubscribeStateStore()
  const {
    selectedAccounts,
    setPlanName,
    setPlanDescription,
    setPlanAvatarUrl,
    setIsPublic,
    setSelectedAccounts,
    setDomain,
    setSelectedChannel,
    setPlanId,
  } = useCreatePlanStore()

  const [planDetail, setPlanDetail] =
    useState<Awaited<ReturnType<typeof getPlanAction>>["data"]>()
  const [dailyFirst, setDailyFirst] = useState<HistoryRecords | undefined>()
  const [dailies, setDailies] = useState<HistoryRecords[]>([])
  const { setPlanOperateState } = usePlanOperateStore()
  const isOwner = planDetail?.userId === userId

  const { data: statistics, loading: loadingStatistics } = useRequest(
    () => getPlanStatisticsAction({ planId }),
    {
      ready: !!planId,
      refreshDeps: [planId],
    },
  )

  const { loading: loadingPlan, refresh: refreshPlan } = useRequest(
    () =>
      getPlanAction({
        userId,
        planId,
      }),
    {
      ready: !!planId && !!userId,
      onSuccess(res) {
        const {
          planName,
          planDescription,
          planAvatarUrl,
          isShared,
          subscribeSource,
          personalInfoSource,
          domain,
          channel,
          planId,
        } = res.data
        setPlanDetail(res.data)
        setPlanName(planName)
        setPlanDescription(planDescription)
        setPlanAvatarUrl(planAvatarUrl)
        setIsPublic(isShared)
        setSelectedAccounts(
          subscribeSource.map((source) => ({
            ...source,
            isSub: true,
          })),
        )
        setDomain(domain)
        setSelectedChannel(channel || [])
        setPlanId(planId)
      },
    },
  )

  const { loading: loadingDailies } = useRequest(
    () =>
      getDailiesHistoryAction({
        userId,
        planId: planId,
        start: 0,
        end: 10,
        orderByDate: "desc",
      }),
    {
      ready: !!userId && !!planId,
      refreshDeps: [planId, userId],
      onSuccess(res) {
        setDailyFirst(res.data.historyRecords[0] || undefined)
        setDailies(res.data.historyRecords)
      },
    },
  )

  const { run: updatePlan, loading: loadingUpdatePlan } = useRequest(
    updatePlanAction,
    {
      manual: true,
      ready: !!planId && !!userId,
      async onSuccess(_, params) {
        const updateType = Object.keys(params[0])[0]
        const updateMessages: Record<string, string> = {
          planName: "名称",
          planDescription: "简介",
          planAvatarUrl: "封面",
          domain: "领域",
          isShared: "公开状态",
        }
        showSuccessToast(`保存${updateMessages[updateType] || ""}成功`)
      },
      onError(error: any) {
        showErrorToast(`保存失败：${error.message.statusText}`)
      },
    },
  )

  const { run: freezePlan, loading: loadingFreeze } = useRequest(
    freezePlanAction,
    {
      manual: true,
      ready: !!planId && !!userId,
      onSuccess() {
        showSuccessToast(planDetail?.isActive ? "冻结成功" : "解冻成功")
        setPlanDetail((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            isActive: !planDetail?.isActive,
          }
        })
      },
      onError(error: any) {
        showErrorToast(
          `${planDetail?.isActive ? "冻结" : "解冻"}失败：${error.message.statusText}`,
        )
      },
    },
  )

  const { run: sharePlan, loading: loadingShare } = useRequest(
    sharePlanAction,
    {
      manual: true,
      ready: !!planId && !!userId,
      onSuccess(data) {
        if (data.statusCode === 400) {
          showErrorToast(data.statusText)
          return
        }

        data.data.isShared
          ? showSuccessToast("公开成功")
          : showInfoToast("取消公开成功")

        setPlanDetail((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            isShared: data.data.isShared,
          }
        })
      },
      onError(error: any) {
        showErrorToast(`公开失败：${error.message.statusText}`)
      },
    },
  )

  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [isHovering, setIsHovering] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [isLeftHovering, setIsLeftHovering] = useState(false)
  const [isLeftAtBottom, setIsLeftAtBottom] = useState(false)
  const [canLeftScroll, setCanLeftScroll] = useState(false)
  const [showFreezeAlert, setShowFreezeAlert] = useState(false)

  const { loading: loadingUpload, run: uploadImage } = useRequest(
    uploadImageAction,
    {
      manual: true,
      onSuccess(data) {
        setPlanDetail((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            planAvatarUrl: data.data.url,
          }
        })
        showSuccessToast(`上传成功🎉！`)
      },
      onError(error: any) {
        showErrorToast(`上传失败: ${error.message.statusText}`)
      },
    },
  )

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      planName: planDetail?.planName || "",
      planDescription: planDetail?.planDescription || "",
      planAvatarUrl: planDetail?.planAvatarUrl || "",
      domain: planDetail?.domain || "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    const currentValues = form.getValues()
    const shouldReset =
      planDetail &&
      (currentValues.planName !== planDetail.planName ||
        currentValues.planDescription !== planDetail.planDescription ||
        currentValues.planAvatarUrl !== planDetail.planAvatarUrl ||
        currentValues.domain !== planDetail.domain)

    if (shouldReset) {
      form.reset({
        planName: planDetail.planName,
        planDescription: planDetail.planDescription,
        planAvatarUrl: planDetail.planAvatarUrl,
        domain: planDetail.domain,
      })
    }
  }, [planDetail])

  const handleSaveChanges = async (updates: Partial<typeof planDetail>) => {
    if (!planDetail || loadingUpdatePlan) return

    const hasChanges = Object.entries(updates as object).some(
      ([key, value]) => {
        const currentValue = planDetail[key as keyof typeof planDetail]
        const isDifferent = currentValue !== value
        console.log(`Comparing ${key}:`, {
          currentValue,
          newValue: value,
          isDifferent,
        })
        return isDifferent
      },
    )
    const fieldName = Object.keys(updates || {})[0] as keyof PlanFormValues
    const isValid = await form.trigger(fieldName)

    if (!hasChanges) {
      console.log("No changes detected, skipping update")
      return
    }

    if (!isValid) {
      console.log("Invalid form, skipping update")
      return
    }

    const updatedPlan = {
      ...planDetail,
      ...updates,
    }

    setPlanDetail(updatedPlan)
    updatePlan({
      ...updates,
      planId: planId,
      planName: updatedPlan.planName!,
      planDescription: updatedPlan.planDescription!,
      planAvatarUrl: updatedPlan.planAvatarUrl!,
      userId: userId,
      subscribeSource: selectedAccounts.map((account) => account.id),
      planTags: updatedPlan.planTags!,
      domain: updatedPlan.domain!,
      personalInfoSource: [],
      isRemake: updatedPlan.isRemake!,
      planType: updatedPlan.planType!,
    })
  }

  const sourceData = statistics?.data?.sourceKindStatistics?.items
    ? Object.entries(statistics.data.sourceKindStatistics.items).map(
      ([name, value]) => ({
        name,
        value,
      }),
    )
    : []

  const tagData = statistics?.data?.tagStatistics?.items
    ? Object.entries(statistics.data.tagStatistics.items).map(
      ([name, value]) => ({
        name,
        value,
      }),
    )
    : []

  const handleCropComplete = (croppedBlob: Blob) => {
    const formData = new FormData()
    formData.append("image", croppedBlob)
    uploadImage({ image: formData })
    setCropDialogOpen(false)
  }

  const handleCloseDialog = () => {
    setCropDialogOpen(false)
  }

  useEffect(() => {
    if (loadingPlan) return

    setPlanOperateState({
      planId,
      isSubscribed: planDetail?.isSubscribed!,
      originalChannels: planDetail?.channel!,
    })
  }, [planDetail])

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget
    const isBottom =
      Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1
    setIsAtBottom(isBottom)
  }

  const handleFreezeConfirm = () => {
    if (loadingFreeze) return

    freezePlan({
      planId,
      userId,
      isActive: !planDetail?.isActive,
    })
    setShowFreezeAlert(false)
  }

  return (
    <div className="flex flex-col justify-between gap-8 px-4 lg:size-full lg:flex-row">
      <ImageCropDialog
        open={cropDialogOpen}
        onClose={handleCloseDialog}
        image={selectedImage}
        onCropComplete={handleCropComplete}
      />
      <section
        className="hide-scrollbar flex flex-col overflow-y-auto px-1 lg:basis-[28rem]"
        onMouseEnter={() => setIsLeftHovering(true)}
        onMouseLeave={() => setIsLeftHovering(false)}
        onScroll={(e) => {
          const target = e.currentTarget
          const isBottom =
            Math.abs(
              target.scrollHeight - target.scrollTop - target.clientHeight,
            ) < 1
          setIsLeftAtBottom(isBottom)
          setCanLeftScroll(target.scrollHeight > target.clientHeight)
        }}
        ref={(el) => {
          if (el) {
            setCanLeftScroll(el.scrollHeight > el.clientHeight)
          }
        }}
      >
        {loadingPlan ? (
          <PlanDetailsSkeleton />
        ) : (
          <>
            <Form {...form}>
              <form className="mt-6 space-y-6">
                <div className="flex items-center justify-start">
                  <div className="flex flex-col gap-2">
                    <h2 className="line-clamp-1 flex items-center gap-2 font-bold ~text-base/xl">
                      <span> {planDetail?.planName}</span>
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                      <VerifiedAvatar
                        size="sm"
                        src={planDetail?.avatar}
                        userName={planDetail?.userName}
                        verificationLevel={planDetail?.verificationLevel}
                      />
                      {planDetail?.userName}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-[50px_1fr] items-center gap-4">
                    <FormLabel className="text-left text-sm text-muted-foreground">
                      名称
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="planName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isOwner}
                              className={!isOwner ? "bg-muted" : ""}
                              onBlur={() =>
                                handleSaveChanges({ planName: field.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveChanges({ planName: field.value })
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-[50px_1fr] items-start gap-4">
                    <FormLabel className="pt-2 text-left text-sm text-muted-foreground">
                      简介
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="planDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isOwner}
                              className={cn(
                                "resize-none",
                                !isOwner ? "bg-muted" : "",
                              )}
                              rows={3}
                              onBlur={() =>
                                handleSaveChanges({
                                  planDescription: field.value,
                                })
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-[50px_1fr] items-start gap-4">
                    <FormLabel className="pt-2 text-left text-sm text-muted-foreground">
                      封面
                    </FormLabel>
                    <div className="relative aspect-video h-full md:h-60 lg:h-full">
                      {isOwner ? (
                        <ImageUploader
                          value={planDetail?.planAvatarUrl}
                          onChange={(url) => {
                            setPlanDetail((prev) => {
                              if (!prev) return prev
                              return {
                                ...prev,
                                planAvatarUrl: url,
                              }
                            })
                            handleSaveChanges({ planAvatarUrl: url })
                          }}
                          withCrop
                          aspectRatio={16 / 9}
                          className="w-full rounded-xl"
                        />
                      ) : (
                        <div className="relative size-full">
                          <img
                            src={planDetail?.planAvatarUrl}
                            alt="meme 封面"
                            className="size-full rounded-lg object-cover opacity-70"
                            onError={(e) => {
                              e.currentTarget.src = ImageAssets.defaultCover
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[50px_1fr] items-center gap-4">
                    <FormLabel className="text-left text-sm text-muted-foreground">
                      领域
                    </FormLabel>

                    {isOwner ? (
                      <Select
                        value={planDetail?.domain}
                        onValueChange={(value) => {
                          setPlanDetail((prev) => {
                            if (!prev) return prev
                            return {
                              ...prev,
                              domain: value,
                            }
                          })
                          handleSaveChanges({ domain: value })
                        }}
                      >
                        <SelectTrigger className="w-full" disabled={planDetail?.planType === "free"} title={planDetail?.planType === "free" ? "基础版 meme 不支持选择领域" : "点击选择 meme 领域"}>
                          <SelectValue>{planDetail?.domain === 'All' ? '无领域' : planDetail?.domain}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {DOMAINS.map((domain) => (
                            <SelectItem key={domain.id} value={domain.value} disabled={planDetail?.planType === "free"} title={planDetail?.planType === "free" ? "基础版 meme 不支持选择领域" : "点击选择 meme 领域"}>
                              <div className="flex items-center gap-2" title={planDetail?.planType === "free" ? "基础版 meme 不支持选择领域" : "点击选择 meme 领域"} style={{ cursor: planDetail?.planType === "free" ? "not-allowed" : "pointer" }}>
                                <domain.Icon className="h-4 w-4" />
                                {domain.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        className="w-fit text-muted-foreground"
                        variant="outline"
                      >
                        {planDetail?.domain}
                      </Badge>
                    )}
                  </div>

                  {/* <div className="grid grid-cols-[50px_1fr] items-center gap-4">
                    <FormLabel className="text-left text-sm text-muted-foreground">
                      看板
                    </FormLabel>
                    <PlanStatisticsDialog planId={planId} />
                  </div> */}

                  {isOwner && (
                    <div className="grid grid-cols-[50px_1fr] items-center gap-4">
                      <FormLabel className="text-left text-sm text-muted-foreground">
                        公开
                      </FormLabel>

                      <div
                        className={cn(
                          "relative flex w-full items-start gap-2 rounded-lg border p-4",
                          "border-input shadow-sm shadow-black/5",
                          {
                            "has-[[data-state=checked]]:border-green-500":
                              planDetail?.isShared,
                            "border-red-500": !planDetail?.isShared,
                          },
                        )}
                      >
                        <Switch
                          checked={planDetail?.isShared}
                          disabled={loadingShare || planDetail?.planType === "free"}
                          title={planDetail?.planType === "free" ? "基础版 meme 目前不允许公开" : "点击切换 meme 公开状态"}
                          className={cn(
                            "order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 [&_span]:data-[state=checked]:translate-x-2 rtl:[&_span]:data-[state=checked]:-translate-x-2",
                            {
                              "data-[state=checked]:bg-green-500":
                                planDetail?.isShared,
                              "cursor-not-allowed opacity-50": loadingShare,
                            },
                          )}
                          onCheckedChange={(checked) => {
                            sharePlan({
                              planId,
                              userId,
                              isShared: checked,
                            })
                          }}
                        />
                        <div className="grid grow gap-2">
                          <Label className="flex items-center gap-2">
                            {
                              match({ planType: planDetail?.planType, isShared: planDetail.isShared })
                                .with({ planType: PlanType.paid, isShared: true }, () => {
                                  return <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    公开的 meme
                                  </span>
                                })
                                .with({ planType: PlanType.paid, isShared: false }, () => {
                                  return <span className="flex items-center gap-1">
                                    <Lock className="h-4 w-4" />
                                    私密的 meme
                                  </span>
                                })
                                .otherwise(() => {
                                  return <span className="flex items-center gap-1">
                                    <Lock className="h-4 w-4" />
                                    私密的 meme
                                  </span>
                                })
                            }
                            {/* {planDetail?.isShared ? (
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                公开的 meme
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Lock className="h-4 w-4" />
                                私密的 meme
                              </span>
                            )}
                            {loadingShare && (
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            )} */}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {
                              match({ planType: planDetail?.planType, isShared: planDetail.isShared })
                                .with({ planType: PlanType.paid, isShared: true }, () => {
                                  return "公开的 meme 将允许任何人订阅"
                                })
                                .with({ planType: PlanType.paid, isShared: false }, () => {
                                  return "私密的 meme 仅自己可见"
                                })
                                .otherwise(() => {
                                  return "基础版 meme 不支持公开"
                                })
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {isOwner && (
                    <div className="grid grid-cols-[50px_1fr] items-center gap-4">
                      <FormLabel className="text-left text-sm text-muted-foreground">
                        模版
                      </FormLabel>

                      <Button variant="outline" disabled>
                        暂未开放
                      </Button>
                    </div>
                  )}
                  {isOwner && (
                    <div className="grid grid-cols-[50px_1fr] items-start gap-4">
                      <FormLabel className="pt-2 text-left text-sm text-muted-foreground">
                        信息源
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedAccounts([
                              ...(planDetail?.subscribeSource.map((item) => ({
                                ...item,
                                isPersonal: false,
                                isSub: true,
                              })) || []),
                              ...(planDetail?.personalInfoSource.map(
                                (item) => ({
                                  ...item,
                                  isPersonal: true,
                                  isSub: true,
                                }),
                              ) || []),
                            ])
                            setPlanId(planDetail?.planId || "")
                            setPlanName(planDetail?.planName || "")
                            setPlanDescription(
                              planDetail?.planDescription || "",
                            )
                            setPlanAvatarUrl(planDetail?.planAvatarUrl || "")
                            setIsPublic(planDetail?.isShared || false)
                            setDomain(planDetail?.domain || "")
                            if (planDetail?.channel) {
                              setSelectedChannel(planDetail?.channel)
                            }
                          }}
                          className="w-full justify-start gap-2"
                          asChild
                        >
                          <Link
                            href={`/memes/edit/${planDetail?.planId}`}
                            onClick={() => setOpen?.(false)}
                          >
                            <Users className="size-4" />
                            编辑信息源
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                  {isOwner && (
                    <div className="grid grid-cols-[50px_1fr] items-center gap-4">
                      <FormLabel className="text-left text-sm text-muted-foreground">
                        冻结
                      </FormLabel>

                      <div
                        className={cn(
                          "relative flex w-full items-start gap-2 rounded-lg border p-4",
                          "border-input shadow-sm shadow-black/5",
                          {
                            "has-[[data-state=checked]]:border-green-500":
                              planDetail?.isActive,
                            "border-red-500": !planDetail?.isActive,
                          },
                        )}
                      >
                        <Switch
                          checked={!!planDetail?.isActive}
                          disabled={loadingFreeze}
                          className={cn(
                            "order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 [&_span]:data-[state=checked]:translate-x-2 rtl:[&_span]:data-[state=checked]:-translate-x-2",
                            {
                              "data-[state=checked]:bg-green-500":
                                planDetail?.isActive,
                              "cursor-not-allowed opacity-50": loadingFreeze,
                            },
                          )}
                          onCheckedChange={(checked) => {
                            setShowFreezeAlert(true)
                          }}
                        />
                        <div className="grid grow gap-2">
                          <Label className="flex items-center gap-2">
                            {planDetail?.isActive
                              ? loadingFreeze
                                ? "冻结中..."
                                : "meme 启用中"
                              : loadingFreeze
                                ? "解冻中..."
                                : "该 meme 已冻结"}
                            {loadingFreeze && (
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            )}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {planDetail?.isActive
                              ? "该 meme 正在推送中"
                              : "冻结的 meme 将不再生成并推送任何内容"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </Form>

            <div className="pointer-events-none sticky bottom-20 left-0 right-0 z-20 flex justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity:
                    canLeftScroll && isLeftHovering && !isLeftAtBottom ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm"
              >
                <ChevronDown className="h-4 w-4 animate-bounce" />
                <span>滚动查看更多内容</span>
              </motion.div>
            </div>
          </>
        )}

        <div className="sticky bottom-0 mt-10 flex w-full gap-4 bg-background text-sm lg:mt-auto lg:pt-5">
          <div className="flex w-full items-center gap-2">
            {Boolean(planDetail?.channel?.length) && (
              <SubscribeDialog
                isFreeze={!planDetail?.isActive}
                loading={loadingPlan}
                className="!flex-1 text-sm"
                changeBtnVariant="secondary"
                planType={planDetail?.planType!}
                isSubscribed={planDetail?.isSubscribed!}
                type="change"
                planId={planId}
                beSubscribedId={planDetail?.beSubscribedId!}
                originalChannels={planDetail?.channel!}
                onSubscribeSuccessCallback={(
                  planId,
                  isSubscribed,
                  selectedChannel,
                ) => {
                  setSubscribeState({
                    planId,
                    isSubscribed,
                    selectedChannel: selectedChannel || [],
                  })
                  setPlanDetail((prev) => {
                    if (!prev) return prev
                    return {
                      ...prev,
                      isSubscribed,
                      channel: selectedChannel || [],
                    }
                  })
                  refreshPlan()
                }}
              />
            )}

            <SubscribeDialog
              isFreeze={!planDetail?.isActive}
              loading={loadingPlan}
              planType={planDetail?.planType!}
              className="!flex-1 text-sm"
              isSubscribed={planDetail?.isSubscribed!}
              subscribeText="订阅 meme"
              cancelBtnVariant="destructive"
              planId={planId}
              beSubscribedId={planDetail?.beSubscribedId!}
              originalChannels={planDetail?.channel!}
              onSubscribeSuccessCallback={(
                planId,
                isSubscribed,
                selectedChannel,
              ) => {
                setSubscribeState({
                  planId,
                  isSubscribed,
                  selectedChannel: selectedChannel || [],
                })
                setPlanDetail((prev) => {
                  if (!prev) return prev
                  return {
                    ...prev,
                    isSubscribed,
                    channel: selectedChannel || [],
                  }
                })
                refreshPlan()
              }}
            />

            <ActivePushPopover planId={planId} />
          </div>
        </div>
      </section>

      <div className="hidden py-8 lg:block">
        <Separator orientation="vertical" />
      </div>

      <section
        className="relative mt-6 flex flex-1 basis-full flex-col gap-4 overflow-y-scroll pr-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onScroll={handleScroll}
      >
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            loading={loadingStatistics}
            label="订阅人数"
            value={`${statistics?.data.beSubscribedPlanNum || 0} 人`}
          />
          <StatCard
            loading={loadingStatistics}
            label="信息源数量"
            value={`${statistics?.data.subscribeSourcesCount || 0} 个`}
          />
          <StatCard
            loading={loadingStatistics}
            label="推送次数"
            value={`${statistics?.data.informationPush || 0} 次`}
          />
          <StatCard
            loading={loadingStatistics}
            label="已生成日报"
            value={`${statistics?.data.briefSummaryNum || 0} 份`}
          />
        </section>

        <Separator className="my-2 h-0" />

        <section>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-bold ~text-lg/xl">meme 历史日报</h3>
              <p className="text-muted-foreground ~text-xs/sm">
                历史日报的参考链接
              </p>
            </div>

            <HintTip label="查看该 meme 历史生成的所有日报">
              <Button className="w-fit underline" asChild variant="link">
                <Link
                  href={
                    planDetail?.isSubscribed
                      ? "/dailies/history"
                      : `/meme/${planDetail?.planId}`
                  }
                  onClick={(e) => {
                    setTimeout(() => {
                      setOpen?.(false)
                    }, 10)
                  }}
                >
                  查看更多 &gt;
                </Link>
              </Button>
            </HintTip>
          </div>

          {Boolean(loadingDailies) ? (
            <ScrollContainer className="mt-4 flex gap-4 pb-4">
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <DailyNewsCardSkeleton key={index} />
                ))}
            </ScrollContainer>
          ) : Boolean(!dailyFirst) ? (
            <div className="mt-4 flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-foreground border-gray-400 text-sm text-muted-foreground">
              该 meme 暂未生成任何日报
            </div>
          ) : (
            <ScrollContainer className="mt-4 flex gap-4 pb-4">
              {dailies.map((daily) => (
                <DailyNewsCard
                  onLinkClick={() => {
                    setTimeout(() => {
                      setOpen?.(false)
                    }, 10)
                  }}
                  key={daily.id}
                  id={daily.id}
                  week={daily.week}
                  title={daily.summaryTitle}
                  date={daily.date}
                  newsItems={daily.topTopicList.map((topic, index) => ({
                    id: `${topic.topic}-${index}`,
                    content: topic.topic,
                    isRelated: topic.isRelated,
                  }))}
                />
              ))}
            </ScrollContainer>
          )}
        </section>

        <Separator className="my-2 h-0" />

        <section>
          <h3 className="font-bold ~text-lg/xl">meme 推送预览图</h3>
          <p className="text-muted-foreground ~text-xs/sm">
            卡片版、web 版、参考链接
          </p>

          {loadingPlan ? (
            <div className="mx-auto mt-4 flex h-40 w-fit flex-row justify-center gap-4 sm:h-60 md:h-auto md:flex-col lg:h-auto lg:flex-row xl:h-80 xl:flex-row">
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-full w-[150px] md:h-40 xl:h-full" />
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="flex flex-1 flex-col items-center gap-2">
                <Skeleton className="h-full w-[350px] md:h-40 xl:h-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-40 w-fit flex-row justify-center gap-6 py-10 sm:h-60 md:h-auto md:flex-col lg:h-auto lg:flex-row xl:h-80 xl:flex-row">
              <div className="flex flex-col items-center gap-2">
                <img
                  src="/mobile-card-preview.png"
                  alt="mobile-card-preview"
                  className="h-full md:h-44 xl:h-full"
                />
                <div className="text-xs text-muted-foreground">手机版预览</div>
              </div>

              <div className="flex flex-1 flex-col items-center gap-2">
                <img
                  src="/web-card-preview.png"
                  alt="web-card-preview"
                  className="h-full md:h-44 xl:h-full"
                />
                <div className="text-xs text-muted-foreground">网页版预览</div>
              </div>
            </div>
          )}
        </section>

        <Separator className="my-4 h-0" />

        <section className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <Card className="flex flex-col lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                订阅源平台分布
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2">
              {loadingStatistics ? (
                <div className="h-[200px]">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <ChartContainer
                  className="mx-auto aspect-square max-h-[200px]"
                  config={{
                    twitter: { label: "Twitter" },
                    weibo: { label: "微博" },
                    wechat: { label: "微信" },
                    rss: { label: "RSS" },
                    dailypush: { label: "日推" },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={sourceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => (
                        <ChartTooltipContent
                          active={active}
                          payload={payload}
                          labelKey="name"
                        />
                      )}
                    />
                    <ChartLegend
                      content={<ChartLegendContent nameKey="name" />}
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center sm:[&>*]:basis-1/4"
                    />
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                覆盖领域标签分布
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {loadingStatistics ? (
                <div className="h-[200px]">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <ChartContainer
                  className="h-[200px] w-full"
                  config={{
                    value: { label: "数量" },
                  }}
                >
                  <BarChart data={tagData} accessibilityLayer>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Bar
                      dataKey="value"
                      fill="#8884d8"
                      barSize={30}
                      radius={[4, 4, 0, 0]}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={false}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </section>

        <div className="pointer-events-none sticky bottom-4 left-0 right-0 z-20 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering && !isAtBottom ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm"
          >
            <ChevronDown className="h-4 w-4 animate-bounce" />
            <span>滚动查看更多内容</span>
          </motion.div>
        </div>
      </section>

      <AlertDialog open={showFreezeAlert} onOpenChange={setShowFreezeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {planDetail?.isActive ? "冻结确认" : "解冻确认"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {planDetail?.isActive
                ? "确定要冻结该 meme 吗？冻结后将不再生成并推送任何内容。"
                : "确定要解冻该 meme 吗？解冻后将恢复生成并推送内容。"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFreezeConfirm}
              disabled={loadingFreeze}
              className={cn({
                "cursor-not-allowed opacity-50": loadingFreeze,
              })}
            >
              {loadingFreeze ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  处理中...
                </span>
              ) : (
                "确认"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
