"use client"
/**
 * @page /daily/:memeid
 * @description 该页面将显示新闻详情。我们规定有以下查询参数：
 * - ref: 表示用户是从哪个渠道打开我们页面的。
 * @note 可以考虑将来把主题内容改成 SSR 以获取更好的首屏加载体验与SEO引流效果。
 */

import { useState, useEffect, useMemo, useRef } from "react"
import { useSearchParams } from "next/navigation"

import { HintTip } from "@/lib/components/common/ui/hint-tip"
import {
    showErrorToast,
    showInfoToast,
    showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { Icons } from "@/lib/components/common/icon"
import { IllustrationNoContent } from "@/lib/components/common/illustrations/illustration-no-content/index"
import { NewsContent } from "@/lib/components/features/dailyContent/NewsContent"
import { NewsHeader } from "@/lib/components/features/dailyContent/NewsHeader"
import { DailyDesktopCatalog } from "@/lib/components/features/dailyContent/DailyDesktopCatalog"
import { DailyMobileCatalog } from "@/lib/components/features/dailyContent/DailyMobileCatalog"
import { Switch } from "@/lib/components/common/ui/switch"
import { useSidebar } from "@/lib/components/common/ui/sidebar"
import { ErrorDaily } from "@/lib/components/features/daily/EmptyDaily"
import { DailyPageFooter } from "@/lib/components/features/daily/DailyPageFooter"
import { ShareDailyDialog } from "@/lib/components/features/daily/ShareDailyDialog"
import { cn } from "@/lib/utils"
import { deleteDailyFavoriteAction } from "@/lib/api/daily/delete-daily-favorite"
import { addDailyFavoriteAction } from "@/lib/api/daily/add-daily-favorite"
import { useDefinition } from "@/lib/context/DefinitionContext"
import { useTranslation } from "@/lib/context/TranslationContext"
import { VerifiedAvatar } from "@/lib/components/common/ui/vertified-avatar"
import { SubscribeButton } from "@/lib/components/features/subscriptions/SubscribeButton"
import { sendCounterMetrics } from "@/lib/api/telemetry/metrics"
import { GetDailyDetailsByIdRes, UserRefFrom } from "@/types/daily"
import { DailyTips } from "@/lib/components/features/daily/DailyTips"
import { ScrollProgress } from "@/lib/components/common/ui/scroll-progress"

const HIDE_SUBTITLE_KEY = "daily-hide-subtitle"
const HIDE_ASSOCIATED_CONTENT_KEY = "daily-hide-associated-content"
const MIX_CONTENT_KEY = "daily-mix-content"

/**
 * @bug 该页面在微信的内置浏览器中的默认比例下，内容会溢出
 */
export default function Page({ params }: { params: { slug: string } }) {
    const { hideDefinitions, setHideDefinitions } = useDefinition()
    const { defaultTranslation, setDefaultTranslation } = useTranslation()
    const { open } = useSidebar()
    const [catalogs, setCatalogs] = useState<{ title: string; id: number }[]>([])
    const [date, setDate] = useState<string>("")
    const [planId, setPlanId] = useState<string>("")
    const [isFavorited, setIsFavorited] = useState<boolean>(false)
    const [loaded, setLoaded] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [dailyDetailQuery, setDailyDetailQuery] = useState<
        GetDailyDetailsByIdRes | undefined
    >(undefined)
    const contentContainerRef = useRef<HTMLDivElement>(null)

    const [hideSubTitle, setHideSubTitle] = useState(() => {
        if (typeof window === "undefined") return false
        const saved = localStorage.getItem(HIDE_SUBTITLE_KEY)
        return saved !== null ? JSON.parse(saved) : false
    })

    const [hideAssociatedContent, setHideAssociatedContent] = useState(() => {
        if (typeof window === "undefined") return false
        const saved = localStorage.getItem(HIDE_ASSOCIATED_CONTENT_KEY)
        return saved !== null ? JSON.parse(saved) : false
    })

    const [isMixContent, setIsMixContent] = useState<boolean>(() => {
        if (typeof window === "undefined") return false
        const saved = localStorage.getItem(MIX_CONTENT_KEY)
        return saved !== null ? JSON.parse(saved) : false
    })
    const searchParams = useSearchParams()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 300)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        localStorage.setItem(HIDE_SUBTITLE_KEY, JSON.stringify(hideSubTitle))
    }, [hideSubTitle])

    useEffect(() => {
        localStorage.setItem(
            HIDE_ASSOCIATED_CONTENT_KEY,
            JSON.stringify(hideAssociatedContent),
        )
    }, [hideAssociatedContent])

    /**
     * 当用户开启混排时，重新排序网页内容。
     */
    useEffect(() => {
        localStorage.setItem(MIX_CONTENT_KEY, JSON.stringify(isMixContent))
        if (dailyDetailQuery != undefined) {
            refreshDailyDetail()
        }
    }, [isMixContent])

    const {
        data: dailyDetailQueryResponse,
        loading: loadingGetDailyDetail,
        run: getDailyDetail,
        refresh: refreshDailyDetail,
    } = useRequest(
        () =>
            getDailyDetailByIdAction({
                id: Number(params.slug),
                userId,
                isMixed: isMixContent,
            }),
        {
            refreshDeps: [userId],
            onSuccess: (data) => {
                setCatalogs(
                    data.data.content.map((item) => ({
                        title: item.title,
                        id: item.id,
                    })),
                )
                setIsFavorited(data.data.isFavorited)
                setPlanId(data.data.refSubscribePlanId)
                setDailyDetailQuery(data)
                setDate(
                    new Date(data.data.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                )
            },
            onFinally: () => {
                setLoaded(true)
            },
        },
    )

    const { runAsync: addDailyFavorite } = useRequest(addDailyFavoriteAction, {
        manual: true,
        ready: !!userId,
        onSuccess: (res) => {
            showSuccessToast("收藏成功")
            setIsFavorited(true)
        },
        onError: (error: any) => {
            showErrorToast(error.data.message)
        },
    })

    const { runAsync: deleteDailyFavorite } = useRequest(
        deleteDailyFavoriteAction,
        {
            manual: true,
            ready: !!userId,
            onSuccess: (res) => {
                showSuccessToast("取消收藏成功")
                setIsFavorited(false)
            },
            onError: (error: any) => {
                showErrorToast(error.data.message)
            },
        },
    )

    /**
     * 用于判断获取日报内容数据是否出错。
     */
    const isDailyError = useMemo(
        () => !dailyDetailQuery?.data,
        [dailyDetailQuery?.data],
    )
    const dailyLength = useMemo(
        () => dailyDetailQuery?.data.content?.length ?? 0,
        [dailyDetailQuery?.data.content],
    )
    const isSubscribed = useMemo(
        () => !!dailyDetailQuery?.data.channel,
        [dailyDetailQuery?.data.channel],
    )
    const noContent = useMemo(
        () =>
            !dailyDetailQuery?.data.content?.length ||
            dailyDetailQuery?.data.content[0]?.title === "无内容",
        [dailyDetailQuery?.data.content],
    )

    /**
     * 在日报页面加载完成后，发送埋点请求。
     * 对于错误的加载页面，不发送埋点请求。
     */
    useEffect(() => {
        if (loadingGetDailyDetail || !loaded) return
        if (isDailyError) return
        sendCounterMetrics("daily-page-views", 1, {
            "service.name": "memenews",
            "exported.job": "daily-page-views",
            "memenews.meme.id": params.slug,
        })
    }, [params.slug, loadingGetDailyDetail, loaded, isDailyError])

    useEffect(() => {
        if (loadingGetDailyDetail || !loaded) return
        const ref = searchParams.get("ref")
        if (!ref) {
            sendCounterMetrics("page-view-channel-from", 1, {
                "service.name": "memenews",
                "exported.job": "page-view-channel-from",
                "memenews.meme.id": params.slug,
                "memenews.meme.ref": UserRefFrom.DEFAULT,
            })
            return
        }
        sendCounterMetrics("page-view-channel-from", 1, {
            "service.name": "memenews",
            "exported.job": "page-view-channel-from",
            "memenews.meme.id": params.slug,
            "memenews.meme.ref": ref,
        })
    }, [searchParams, loadingGetDailyDetail, loaded])

    const sectionStyle = useMemo(
        () => ({
            right:
                "calc((100vw - min(100vw, 664px)) / 2 + min(100vw, 664px) + 128px)",
            transition: "top 400ms",
        }),
        [],
    )

    const navStyle = useMemo(
        () => ({
            alignSelf: "start",
            gridColumn: "3/3",
            left: "calc((100vw - min(100vw, 664px))/2 + min(100vw, 664px) + 128px)",
        }),
        [],
    )

    /**
     * 目录的具体条目
     */
    const catalogItems = useMemo(
        () =>
            dailyDetailQuery?.data.content.map((item) => ({
                title: item.title || "",
                isRelated: item.isRelated || false,
                id: item.id,
            })) || [],
        [dailyDetailQuery?.data.content],
    )

    /**
     * 加载骨架屏
     */
    if (loadingGetDailyDetail || !loaded) {
        return (
            <div className="container max-w-3xl animate-pulse">
                {/* Header skeleton */}
                <div className="mb-8 space-y-4">
                    <div className="h-6 w-40 rounded-md bg-gray-200" />
                    <div className="flex h-52 justify-between gap-2">
                        <div className="aspect-video w-1/2 rounded-md bg-gray-200" />
                        <div className="flex w-1/2 flex-col justify-between">
                            <div className="space-y-4">
                                <div className="h-6 rounded-md bg-gray-200" />
                                <div className="h-24 rounded-md bg-gray-200" />
                            </div>
                            <div className="space-y-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-4 w-full rounded bg-gray-200" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Author info skeleton */}
                <div className="mb-8 flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                        <div className="h-4 w-24 rounded bg-gray-200" />
                        <div className="h-3 w-16 rounded bg-gray-200" />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-6 w-3/4 rounded bg-gray-200" />
                            <div className="space-y-2">
                                <div className="h-4 w-full rounded bg-gray-200" />
                                <div className="h-4 w-full rounded bg-gray-200" />
                                <div className="h-4 w-2/3 rounded bg-gray-200" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right sidebar skeleton */}
                <div className="fixed right-[calc((100vw-min(100vw,664px))/2+min(100vw,664px)+128px)] top-1/2 hidden -translate-y-1/2 xl:block">
                    <div className="flex flex-col items-center space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="size-8 rounded-full bg-gray-200" />
                        ))}
                    </div>
                </div>

                {/* Right catalog skeleton */}
                <nav className="fixed left-[calc((100vw-min(100vw,664px))/2+min(100vw,664px)+128px)] top-1/2 hidden -translate-y-1/2 xl:block">
                    <div className="w-96 space-y-4 rounded-lg p-4">
                        {/* Catalog items */}
                        <div className="space-y-3">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <div className="h-2 w-2 rounded-full bg-gray-200" />
                                    <div className="h-4 w-56 rounded bg-gray-200" />
                                </div>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>
        )
    }

    if (isDailyError) {
        return <ErrorDaily />
    }

    return (
        <div>
            <div className="fixed inset-x-0 top-0 z-50 h-1 w-full">
                <ScrollProgress
                    containerRef={contentContainerRef}
                    className="absolute top-0 bg-orange-400 dark:bg-orange-700"
                    springOptions={{ stiffness: 300, damping: 30 }}
                />
            </div>

            <section
                className={cn(
                    "fixed hidden h-40 w-10 -translate-y-1/2 flex-col items-center justify-center xl:flex",
                    isScrolled ? "top-[35%]" : "top-1/2",
                )}
                style={sectionStyle}
            >
                <div
                    onClick={() => showInfoToast("开发中")}
                    className="cursor-pointer space-y-3 text-center"
                >
                    <Icons.like className="size-12 rounded-full p-4" />
                    <span className="text-xs text-primary/60">12</span>
                </div>

                <div
                    onClick={(e) => {
                        e.preventDefault()
                        if (isFavorited) {
                            deleteDailyFavorite({ userId, summaryId: params.slug })
                        } else {
                            addDailyFavorite({ userId, summaryId: params.slug })
                        }
                    }}
                    className="cursor-pointer space-y-3 text-center"
                >
                    <Icons.favorite
                        className={cn(
                            "size-12 rounded-full p-4",
                            isFavorited && "fill-orange-500",
                        )}
                    />
                </div>

                <ShareDailyDialog
                    getDailyDetailQuery={dailyDetailQuery!}
                    slug={params.slug}
                />

                <HintTip
                    label="隐藏相关指的是隐藏关系型信息（例如：微博、推特）。"
                    side="right"
                >
                    <div className="cursor-pointer space-y-3 pb-2 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <Switch
                                aria-label="隐藏相关"
                                checked={hideAssociatedContent}
                                onCheckedChange={setHideAssociatedContent}
                                className="h-4 w-7 data-[state=checked]:bg-primary"
                                thumbClassName="h-3 w-3 data-[state=checked]:translate-x-3"
                            />
                            <span className="select-none text-nowrap text-xs text-primary/60">
                                隐藏相关
                            </span>
                        </div>
                    </div>
                </HintTip>

                <HintTip
                    label="隐藏释义指的是隐藏文章中带有解释的名词的下划线，这样您将无法看到释义。"
                    side="right"
                >
                    <div className="cursor-pointer space-y-3 pb-2 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <Switch
                                aria-label="隐藏释义"
                                checked={hideDefinitions}
                                onCheckedChange={setHideDefinitions}
                                className="h-4 w-7 data-[state=checked]:bg-primary"
                                thumbClassName="h-3 w-3 data-[state=checked]:translate-x-3"
                            />
                            <span className="select-none text-nowrap text-xs text-primary/60">
                                隐藏释义
                            </span>
                        </div>
                    </div>
                </HintTip>

                <div className="cursor-pointer space-y-3 pb-2 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <Switch
                            aria-label="开启混排"
                            checked={isMixContent}
                            onCheckedChange={setIsMixContent}
                            className="h-4 w-7 data-[state=checked]:bg-primary"
                            thumbClassName="h-3 w-3 data-[state=checked]:translate-x-3"
                        />
                        <span className="select-none text-nowrap text-xs text-primary/60">
                            开启混排
                        </span>
                    </div>
                </div>

                <HintTip label="开启后内容将默认翻译为中文" side="right">
                    <div className="cursor-pointer space-y-3 pb-2 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <Switch
                                aria-label="默认翻译"
                                checked={defaultTranslation}
                                onCheckedChange={setDefaultTranslation}
                                className="h-4 w-7 data-[state=checked]:bg-primary"
                                thumbClassName="h-3 w-3 data-[state=checked]:translate-x-3"
                            />
                            <span className="select-none text-nowrap text-xs text-primary/60">
                                默认翻译
                            </span>
                        </div>
                    </div>
                </HintTip>
            </section>

            <NewsHeader
                getDailyDetailQuery={dailyDetailQuery!}
                date={date}
                planId={planId}
                onSubscribeSuccessCallback={() => getDailyDetail()}
            />

            <main
                className={cn(
                    "container max-w-2xl justify-start pt-5",
                    hideSubTitle && "[&_#subTitle]:hidden",
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <VerifiedAvatar
                            size="lg"
                            src={dailyDetailQuery?.data.avatar}
                            userName={dailyDetailQuery?.data.userName}
                            verificationLevel={dailyDetailQuery?.data.verificationLevel}
                        />

                        <div>
                            <p className="font-semibold">{dailyDetailQuery?.data.userName}</p>
                            <p className="text-sm text-gray-500">{date}</p>
                        </div>
                    </div>

                    {!isSubscribed && <SubscribeButton planId={planId} />}
                </div>

                <div>
                    {dailyLength < 5 && <DailyTips />}
                    {noContent ? (
                        <div className="mt-5 flex flex-col items-center gap-3 py-40">
                            <IllustrationNoContent />
                            <p className="text-center text-sm text-primary/50">
                                今日无事发生
                            </p>
                        </div>
                    ) : (
                        <NewsContent
                            dailies={dailyDetailQuery?.data.content || []}
                            hideAssociatedContent={hideAssociatedContent}
                        />
                    )}
                </div>

                <DailyPageFooter
                    id={params.slug}
                    noContent={noContent}
                    title={dailyDetailQuery?.data.title || ""}
                    shareCount={"12"}
                    views={dailyDetailQuery?.data.views || 0}
                />
            </main>

            <div className="fixed bottom-20 right-8 z-50 xl:hidden">
                <DailyMobileCatalog
                    title={dailyDetailQuery?.data.title || ""}
                    catalogs={catalogs}
                    contents={dailyDetailQuery?.data.content || []}
                />
            </div>

            {!noContent && (
                <nav
                    className={cn(
                        "sticky hidden xl:fixed xl:block xl:-translate-y-1/2",
                        isScrolled ? "xl:top-[50%]" : "xl:top-[50%]",
                        isScrolled && dailyLength < 20 ? "top-[35%]" : "top-28",
                    )}
                    style={navStyle}
                >
                    <DailyDesktopCatalog
                        catalogs={catalogItems}
                        contents={dailyDetailQuery?.data.content || []}
                        getDailyDetailQuery={dailyDetailQuery!}
                    />
                </nav>
            )}
        </div>
    )
}
