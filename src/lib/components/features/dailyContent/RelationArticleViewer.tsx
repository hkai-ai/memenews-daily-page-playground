"use client"

import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Eye,
  Languages,
  Download,
  MinusIcon,
  PlusIcon,
  RotateCcw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

import { Dialog, DialogContent, DialogTrigger } from "../../common/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../../common/ui/avatar"
import { Icons } from "../../common/icon"

import { preProcessContent } from "./NewsContent"

import { cn } from "@/lib/utils"
import { dailyPageRelationArticleMarkdownConvertComponents } from "@/lib/markdown/converter"
import { AssociatedContent } from "@/types/daily"
import { Toggle } from "@/lib/components/common/ui/toggle"
import { isUrl } from "@/utils/isUrl"
import { useTranslation } from "@/lib/context/TranslationContext"

const PLATFORM_ICONS_MAP = {
  微博: <Icons.weibo className="size-3 fill-orange-500" />,
  twitter: <Icons.twitter className="size-3" />,
}

const CONTENT_LENGTH_THRESHOLD = 150 // 字数阈值，超过该字数后，会显示"查看全文"按钮

/**
 * 关系型信息源
 */
export function RelationArticleViewer({
  data,
  children,
}: {
  data: AssociatedContent
  children?: React.ReactNode
}) {
  const { defaultTranslation } = useTranslation()
  const needTranslate = data.platform === "twitter" // 是否需要翻译
  const shouldShowTranslated =
    needTranslate &&
    !isUrl(data.originalText) &&
    data.parsedText !== data.originalText
  const initialContent =
    shouldShowTranslated && defaultTranslation
      ? data.parsedText
      : data.originalText

  const [displayContent, setDisplayContent] = useState(initialContent)
  const [dialogDisplayContent, setDialogDisplayContent] =
    useState(initialContent)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [imageLoadError, setImageLoadError] = useState<boolean[]>([])
  const showTranslateIcon = shouldShowTranslated
  const LOAD_TIMEOUT = 10000

  // Update content when defaultTranslation changes
  useEffect(() => {
    if (shouldShowTranslated) {
      setDisplayContent(
        defaultTranslation ? data.parsedText : data.originalText,
      )
      setDialogDisplayContent(
        defaultTranslation ? data.parsedText : data.originalText,
      )
    }
  }, [
    defaultTranslation,
    data.parsedText,
    data.originalText,
    shouldShowTranslated,
  ])

  const handleImageLoad = (index: number) => {
    setIsImageLoading(false)
    setImageLoadError((prev) => {
      const newErrors = [...prev]
      newErrors[index] = false
      return newErrors
    })
  }

  const handleImageError = (index: number) => {
    setIsImageLoading(false)
    setImageLoadError((prev) => {
      const newErrors = [...prev]
      newErrors[index] = true
      return newErrors
    })
  }

  const mainContent = !needTranslate ? data.parsedText : displayContent
  const dialogContent = !needTranslate ? data.parsedText : dialogDisplayContent

  const needsMainContentExpand = mainContent.length > CONTENT_LENGTH_THRESHOLD
  const displayMainContent = needsMainContentExpand
    ? mainContent.slice(0, CONTENT_LENGTH_THRESHOLD) + "..."
    : mainContent

  return (
    <div
      className={cn(
        "w-full",
        "bg-white/50 backdrop-blur-xl dark:bg-zinc-900/50",
        "border border-zinc-200/50 dark:border-zinc-800/50",
        "rounded-2xl shadow-sm",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-md hover:shadow-zinc-200/20 dark:hover:shadow-zinc-900/20",
        "hover:border-zinc-300/50 dark:hover:border-zinc-700/50",
        "hover:translate-y-[-1px]",
      )}
    >
      <Dialog>
        <DialogTrigger
          className="w-full text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="size-10 ring-2 ring-white dark:ring-zinc-800">
                    <AvatarImage
                      className="object-cover"
                      src={data.avatar}
                      alt={`${data.authorName}'s avatar`}
                    />
                    <AvatarFallback className="bg-gradient-to-tr from-rose-500 to-blue-500 text-white">
                      {data.authorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 to-blue-500 opacity-0 transition-opacity duration-300 hover:opacity-10" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {data.authorName}
                  </h3>
                  <p className="flex items-center gap-1.5 text-[13px] tracking-tight text-zinc-500 dark:text-zinc-400">
                    {PLATFORM_ICONS_MAP[data.platform]}
                    <span>•</span>
                    {formatDistanceToNow(data.recordPublishedTime, {
                      locale: zhCN,
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {showTranslateIcon && (
                  <button
                    className={cn(
                      "rounded-full p-2",
                      "transition-all duration-200",
                      "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80",
                      "active:bg-zinc-200 dark:active:bg-zinc-700",
                      "focus:outline-hidden focus:ring-2 focus:ring-zinc-500/20",
                      displayContent === data.parsedText
                        ? "text-blue-500"
                        : "text-zinc-400",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (displayContent === data.originalText) {
                        setDisplayContent(data.parsedText)
                      } else {
                        setDisplayContent(data.originalText)
                      }
                    }}
                  >
                    <Languages className="size-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={dailyPageRelationArticleMarkdownConvertComponents}
                >
                  {preProcessContent(displayMainContent)}
                </Markdown>
                {needsMainContentExpand && (
                  <div className="mt-2 text-center text-xs font-medium text-blue-500">
                    查看全文
                  </div>
                )}
              </div>

              {data.photosSrc.length > 0 && (
                <div
                  className={cn(
                    "overflow-hidden rounded-xl",
                    // "border border-zinc-200/80 dark:border-zinc-700/80",
                    "transition-all duration-300",
                    "hover:border-zinc-300 dark:hover:border-zinc-600",
                  )}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {data.photosSrc.map((url, index) => {
                      let timeoutId: NodeJS.Timeout

                      const handleLoadStart = () => {
                        timeoutId = setTimeout(() => {
                          handleImageError(index)
                        }, LOAD_TIMEOUT)
                      }

                      const handleLoadComplete = () => {
                        clearTimeout(timeoutId)
                        handleImageLoad(index)
                      }

                      return (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Dialog>
                            <DialogTrigger asChild>
                              <div
                                aria-label="图片"
                                className="group relative aspect-square w-full overflow-hidden rounded-lg"
                              >
                                <div className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                                {imageLoadError[index] ? (
                                  <div className="flex h-full items-center justify-center bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
                                    图片加载失败
                                  </div>
                                ) : (
                                  <div className="relative h-full w-full">
                                    {isImageLoading && (
                                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800/80">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                                      </div>
                                    )}
                                    <Image
                                      src={url}
                                      alt={`Image ${index + 1}`}
                                      fill
                                      loading="lazy"
                                      unoptimized
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      onLoadingComplete={() =>
                                        handleLoadComplete()
                                      }
                                      onError={() => handleImageError(index)}
                                      onLoadStart={() => handleLoadStart()}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                                      <Eye className="h-6 w-6 text-white" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl overflow-hidden p-0 sm:rounded-xl">
                              <div className="max-h-[80vh] w-full overflow-y-auto">
                                <div className="relative w-full">
                                  <TransformWrapper
                                    initialScale={1}
                                    minScale={1}
                                    maxScale={3}
                                    centerOnInit
                                    wheel={{ wheelDisabled: true }}
                                  >
                                    {({ zoomIn, zoomOut, resetTransform }) => (
                                      <div>
                                        <TransformComponent
                                          wrapperClass="!w-full"
                                          contentClass="!w-full"
                                        >
                                          {isImageLoading && (
                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/80">
                                              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                            </div>
                                          )}
                                          {imageLoadError[index] ? (
                                            <div className="flex h-96 w-full items-center justify-center bg-gray-100 text-gray-500">
                                              图片加载超时或失败
                                            </div>
                                          ) : (
                                            <Image
                                              src={url}
                                              alt={`Image ${index + 1}`}
                                              width={400}
                                              height={400}
                                              className="h-auto min-h-60 w-full"
                                              onLoadingComplete={() =>
                                                setIsImageLoading(false)
                                              }
                                              unoptimized
                                              sizes="100vw"
                                              style={{
                                                maxWidth: "100%",
                                              }}
                                            />
                                          )}
                                        </TransformComponent>
                                        <div className="fixed bottom-4 right-4 z-10 flex items-center gap-2 rounded-lg bg-black/50 p-3">
                                          <button
                                            onClick={() => zoomOut()}
                                            className="rounded-md p-1.5 hover:bg-white/20"
                                            aria-label="Zoom out"
                                          >
                                            <MinusIcon className="h-4 w-4 text-white" />
                                          </button>
                                          <button
                                            onClick={() => zoomIn()}
                                            className="rounded-md p-1.5 hover:bg-white/20"
                                            aria-label="Zoom in"
                                          >
                                            <PlusIcon className="h-4 w-4 text-white" />
                                          </button>
                                          <button
                                            onClick={() => resetTransform()}
                                            className="rounded-md p-1.5 hover:bg-white/20"
                                            aria-label="Reset zoom"
                                          >
                                            <RotateCcw className="h-4 w-4 text-white" />
                                          </button>
                                          <button
                                            onClick={async () => {
                                              try {
                                                const response =
                                                  await fetch(url)
                                                const blob =
                                                  await response.blob()
                                                const blobUrl =
                                                  window.URL.createObjectURL(
                                                    blob,
                                                  )
                                                const link =
                                                  document.createElement("a")
                                                link.href = blobUrl
                                                link.download = `image-${index + 1}.jpg`
                                                link.style.display = "none"
                                                document.body.appendChild(link)
                                                link.click()
                                                document.body.removeChild(link)
                                                window.URL.revokeObjectURL(
                                                  blobUrl,
                                                )
                                              } catch (error) {
                                                console.error(
                                                  "Failed to download image:",
                                                  error,
                                                )
                                              }
                                            }}
                                            className="rounded-md p-1.5 hover:bg-white/20"
                                            aria-label="Download image"
                                          >
                                            <Download className="h-4 w-4 text-white" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </TransformWrapper>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {children}
          </div>
        </DialogTrigger>

        <DialogContent
          className="max-w-2xl sm:rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-[80vh] overflow-y-auto p-4">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-7">
                  <AvatarImage
                    className="object-cover"
                    src={data.avatar}
                    alt={`${data.authorName}'s avatar`}
                  />
                  <AvatarFallback>{data.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {data.authorName}
                  </span>
                  {PLATFORM_ICONS_MAP[data.platform]}
                </div>
              </div>

              {needTranslate && (
                <Toggle
                  size="sm"
                  aria-label="Toggle translation"
                  pressed={dialogDisplayContent === data.parsedText}
                  onPressedChange={(pressed) => {
                    setDialogDisplayContent(
                      pressed ? data.parsedText : data.originalText,
                    )
                  }}
                >
                  <Languages className="h-4 w-4" />
                </Toggle>
              )}
            </div>

            <Markdown
              remarkPlugins={[remarkGfm]}
              components={dailyPageRelationArticleMarkdownConvertComponents}
            >
              {preProcessContent(dialogContent)}
            </Markdown>

            {data.photosSrc.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {data.photosSrc.map((url, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div
                          aria-label="图片"
                          className="group relative aspect-square w-full overflow-hidden rounded-lg"
                        >
                          <div className="absolute inset-0 animate-pulse bg-gray-200" />
                          {imageLoadError[index] ? (
                            <div className="flex h-full items-center justify-center bg-gray-100 text-gray-500">
                              图片加载超时或失败
                            </div>
                          ) : (
                            <div className="relative h-full w-full">
                              {isImageLoading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/80">
                                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                </div>
                              )}
                              <Image
                                src={url}
                                alt={`Image ${index + 1}`}
                                fill
                                loading="lazy"
                                unoptimized
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onLoadingComplete={() => handleImageLoad(index)}
                                onError={() => handleImageError(index)}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                                <Eye className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl overflow-hidden p-0">
                        <div className="max-h-[80vh] w-full overflow-y-auto">
                          <div className="relative w-full">
                            <TransformWrapper
                              initialScale={1}
                              minScale={1}
                              maxScale={3}
                              centerOnInit
                              wheel={{ wheelDisabled: true }}
                            >
                              {({ zoomIn, zoomOut, resetTransform }) => (
                                <div>
                                  <TransformComponent
                                    wrapperClass="!w-full"
                                    contentClass="!w-full"
                                  >
                                    {isImageLoading && (
                                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/80">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                      </div>
                                    )}
                                    {imageLoadError[index] ? (
                                      <div className="flex h-96 w-full items-center justify-center bg-gray-100 text-gray-500">
                                        图片加载超时或失败
                                      </div>
                                    ) : (
                                      <Image
                                        src={url}
                                        alt={`Image ${index + 1}`}
                                        width={400}
                                        height={400}
                                        className="h-auto min-h-60 w-full"
                                        onLoadingComplete={() =>
                                          setIsImageLoading(false)
                                        }
                                        unoptimized
                                        sizes="100vw"
                                        style={{
                                          maxWidth: "100%",
                                        }}
                                      />
                                    )}
                                  </TransformComponent>
                                  <div className="fixed bottom-4 right-4 z-10 flex items-center gap-2 rounded-lg bg-black/50 p-3">
                                    <button
                                      onClick={() => zoomOut()}
                                      className="rounded-md p-1.5 hover:bg-white/20"
                                      aria-label="Zoom out"
                                    >
                                      <MinusIcon className="h-4 w-4 text-white" />
                                    </button>
                                    <button
                                      onClick={() => zoomIn()}
                                      className="rounded-md p-1.5 hover:bg-white/20"
                                      aria-label="Zoom in"
                                    >
                                      <PlusIcon className="h-4 w-4 text-white" />
                                    </button>
                                    <button
                                      onClick={() => resetTransform()}
                                      className="rounded-md p-1.5 hover:bg-white/20"
                                      aria-label="Reset zoom"
                                    >
                                      <RotateCcw className="h-4 w-4 text-white" />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        try {
                                          const response = await fetch(url)
                                          const blob = await response.blob()
                                          const blobUrl =
                                            window.URL.createObjectURL(blob)
                                          const link =
                                            document.createElement("a")
                                          link.href = blobUrl
                                          link.download = `image-${index + 1}.jpg`
                                          link.style.display = "none"
                                          document.body.appendChild(link)
                                          link.click()
                                          document.body.removeChild(link)
                                          window.URL.revokeObjectURL(blobUrl)
                                        } catch (error) {
                                          console.error(
                                            "Failed to download image:",
                                            error,
                                          )
                                        }
                                      }}
                                      className="rounded-md p-1.5 hover:bg-white/20"
                                      aria-label="Download image"
                                    >
                                      <Download className="h-4 w-4 text-white" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </TransformWrapper>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              {formatDistanceToNow(data.recordPublishedTime, {
                locale: zhCN,
                addSuffix: true,
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
