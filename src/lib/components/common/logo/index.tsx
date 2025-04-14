"use client"

import { ImageAssets } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

/**
 * Logo 组件
 *
 * @param className 自定义类名
 * @returns 返回 Logo 组件的 JSX 元素
 */
export const Logo = ({ className }: Props) => {
  return (
    <>
      <img
        src={ImageAssets.logoDark}
        className={cn("hidden size-8 dark:block", className)}
        alt="ai daily website logo"
      />
      <img
        src={ImageAssets.logo}
        className={cn("size-8 dark:hidden", className)}
        alt="ai daily website logo"
      />
    </>
  )
}
