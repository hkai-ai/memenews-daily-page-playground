"use client"

import { EllipsisVertical, Lock, Unlock, User, Users } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../common/ui/dropdown-menu"
import { HintTip } from "../../common/ui/hint-tip"

import { Button } from "@/lib/components/common/ui/button"
import { TextPreview } from "@/lib/components/common/ui/text-preview"
import { VerifiedAvatar } from "@/lib/components/common/ui/vertified-avatar"
import { usePlanDialog } from "@/lib/context/plan/PlanDialogContext"
import { Card, CardHeader, CardTitle } from "@/lib/components/common/ui/card"
import { cn } from "@/lib/utils"
import { PlanType, UserLevel, VerificationLevel } from "@/types/plan/model"
import { Skeleton } from "@/lib/components/common/ui/skeleton"

interface PlanCardProps {
  link?: boolean
  className?: string
  expandedMenuChildren?: React.ReactNode
  children?: React.ReactNode
  planName?: string
  planAvatarUrl?: string
  planDescription?: string
  planId?: string
  userName?: string
  avatar?: string
  isSubscribed?: boolean
  isOwner?: boolean
  isShared?: boolean
  domain?: string
  planType?: PlanType
  userLevel?: UserLevel
  verificationLevel?: VerificationLevel
  showBadge?: ("shared" | "owner")[]
  onSuccessDeleteCallback?: () => void
  isFavorite?: boolean
  onFavoriteSuccessCallback?: (planId: string, isFavorite: boolean) => void
}

type ChildProps = {
  onActionComplete?: () => void
}

export function PlanCard({
  link = true,
  className,
  expandedMenuChildren,
  children,
  planId,
  planName = "未知meme",
  planDescription = "-",
  userName = "匿名用户",
  avatar,
  userLevel,
  verificationLevel,
  planAvatarUrl,
  isSubscribed,
  isShared,
  isOwner,
  domain = "其它",
  planType,
  isFavorite = false,
  showBadge = [],
  onFavoriteSuccessCallback,
}: PlanCardProps) {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { setIsPlanDialogOpen, setPlanDialogId } = usePlanDialog()
  const [isImageLoading, setIsImageLoading] = useState(true)

  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        setIsOverflowing(
          descriptionRef.current.scrollHeight >
            descriptionRef.current.clientHeight,
        )
      }
    }

    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [planDescription])

  // const toggleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation()
  //   setIsExpanded(!isExpanded)
  // }
  //
  //   const { loading: loadingAddPlanFavorite, run: addPlanFavorite } = useRequest(
  //     () =>
  //       addPlanFavoriteAction({
  //         userId,
  //         planId: planId || "",
  //       }),
  //     {
  //       manual: true,
  //       ready: !!userId,
  //       onSuccess() {
  //         showInfoToast("收藏成功")
  //         onFavoriteSuccessCallback?.(planId || "", true)
  //       },
  //     },
  //   )
  //
  //   const { loading: loadingDeletePlanFavorite, run: deletePlanFavorite } =
  //     useRequest(
  //       () =>
  //         deletePlanFavoriteAction({
  //           userId,
  //           planId: planId || "",
  //         }),
  //       {
  //         manual: true,
  //         ready: !!userId,
  //         onSuccess() {
  //           showInfoToast("取消收藏成功")
  //           onFavoriteSuccessCallback?.(planId || "", false)
  //         },
  //       },
  //     )
  //
  //   const handleToggleFavorite = () => {
  //     if (isFavorite) {
  //       deletePlanFavorite()
  //     } else {
  //       addPlanFavorite()
  //     }
  //   }

  const handleCardClick = () => {
    setTimeout(() => {
      setPlanDialogId(planId || null)
      setIsPlanDialogOpen(true)
    }, 0)
  }

  const mapDomain = (domain: string) => {
    if (domain === "All") {
      return "其它"
    }
    return domain
  }

  return (
    <>
      <div className={cn("mt-4", className)}>
        <Card
          className={cn(
            "group relative z-40 cursor-pointer overflow-hidden shadow-md transition-all duration-100 ease-in",
            planType === PlanType.paid && "border-none",
          )}
          onClick={handleCardClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
          }}
        >
          <div className="flex gap-2">
            <HintTip
              label={
                mapDomain(domain) === "其它"
                  ? "这是一个普通meme，没有特定领域"
                  : `该 meme 属于 ${mapDomain(domain)} 领域`
              }
            >
              <span
                className={cn(
                  "absolute -left-0.5 -top-0.5 z-20 rounded-br-md rounded-tl-md bg-card px-4 py-2 pb-1 text-xs font-medium dark:bg-gray-900",
                )}
                title={
                  mapDomain(domain) === "其它"
                    ? "这是一个普通meme，没有特定领域"
                    : `该 meme 属于 ${mapDomain(domain)} 领域`
                }
              >
                {mapDomain(domain) || "其它"}
              </span>
            </HintTip>

            <div className="absolute bottom-1 right-0 z-20 flex items-center gap-1 px-2 py-1">
              {showBadge.includes("shared") && (
                <HintTip
                  label={isShared ? "此 meme 是公开的" : "此 meme 是私有的"}
                  side="bottom"
                >
                  <span
                    className="rounded-full bg-card/80 p-1 backdrop-blur-sm"
                    title={isShared ? "公开" : "私有"}
                  >
                    {isShared ? (
                      <Users className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                  </span>
                </HintTip>
              )}

              {Boolean(showBadge.includes("owner") && isOwner) && (
                <HintTip label="此 meme 是由您创建的" side="bottom">
                  <span
                    className="rounded-full bg-card/80 p-1 backdrop-blur-sm"
                    title="此 meme 是由您创建的"
                  >
                    <User className="h-3 w-3" />
                  </span>
                </HintTip>
              )}
            </div>

            {planType === PlanType.paid ? (
              <span
                className="absolute right-0 top-0 z-20 rounded-bl-lg bg-gradient-to-r from-pro-from to-pro-to px-3 py-1 text-xs font-medium text-pro-text shadow-lg"
                title="进阶"
              >
                进阶版
              </span>
            ) : (
              <span
                className="absolute right-0 top-0 z-20 rounded-bl-lg bg-gradient-to-tr from-free-from to-free-to px-3 py-1 text-xs text-primary-foreground shadow-lg"
                title="免费"
              >
                基础版
              </span>
            )}
          </div>

          <CardHeader
            className={cn(
              "relative p-1.5",
              planType === PlanType.paid &&
                "bg-gradient-to-b from-pro-from to-pro-to",
              planType === PlanType.free &&
                "bg-gradient-to-b from-free-from to-free-to",
            )}
          >
            {isImageLoading && (
              <Skeleton className="aspect-video w-full rounded-lg" />
            )}
            <Image
              src={planAvatarUrl || "/placeholder.svg"}
              alt="Plan cover"
              className={cn(
                "aspect-video rounded-lg object-cover",
                isImageLoading ? "invisible absolute" : "visible",
              )}
              width={1000}
              height={1000}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              onLoadStart={() => setIsImageLoading(true)}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </CardHeader>
        </Card>

        <div className="relative flex items-center justify-between gap-2 p-2">
          <TextPreview
            content={
              <div className="max-w-xl px-2 text-sm">{planDescription}</div>
            }
          >
            <div className="flex-1">
              <CardTitle className="line-clamp-1 flex items-center justify-between text-neutral-600 ~text-xs/base dark:text-neutral-400">
                <span>{planName}</span>
              </CardTitle>

              <div className="flex items-center gap-2 text-neutral-500 ~text-xsm/xs dark:text-neutral-500">
                <VerifiedAvatar
                  size="sm"
                  src={avatar}
                  userName={userName}
                  verificationLevel={verificationLevel}
                />
                {userName}
              </div>
            </div>
          </TextPreview>

          <div className="flex flex-col items-center gap-2 md:flex-row">
            <div>{children}</div>

            {expandedMenuChildren && (
              <DropdownMenu
                open={popoverOpen}
                onOpenChange={(open) => {
                  setPopoverOpen(open)
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    variant="outline"
                    size="icon"
                    className="z-20 flex-1 transition-transform duration-200 ~size-6/10"
                  >
                    <EllipsisVertical className="shrink-0 rotate-90 ~size-2.5/4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-1">
                  {React.Children.map(
                    expandedMenuChildren,
                    (child: React.ReactNode) =>
                      React.isValidElement(child)
                        ? React.cloneElement(
                            child as React.ReactElement<ChildProps>,
                            {
                              onActionComplete: () => setPopoverOpen(false),
                            },
                          )
                        : child,
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
