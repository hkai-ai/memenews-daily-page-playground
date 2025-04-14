"use client"

import { Check, Loader2, Plus } from "lucide-react"
import { useState } from "react"

import { BindAccountAlertDialog } from "./BindAccountAlertDialog"

import { Icons } from "@/lib/components/common/icon"
import { Button } from "@/lib/components/common/ui/button"
import { cn } from "@/lib/utils"

interface BindSociolAccountFormItemProps {
  isBind?: boolean
  icon: keyof typeof Icons
  name: string
  iconColor?: string
  accountName?: string
  iconStyle?: React.HTMLAttributes<HTMLDivElement>["className"]
  uuid: string
  recordId: string
  channel: string
}

/**
 * 绑定社交账号表单项组件
 *
 * @param isBind 是否已绑定社交账号
 * @param icon 社交账号图标
 * @param name 社交账号名称
 * @param iconColor 社交账号图标颜色
 * @param accountName 社交账号ID
 * @param iconStyle 社交账号图标样式
 * @param channel 社交账号渠道
 * @returns 渲染后的组件
 */
export function BindSociolAccountFormItem({
  isBind = false,
  icon,
  name,
  accountName,
  iconColor,
  uuid,
  recordId,
  channel,
}: BindSociolAccountFormItemProps) {
  const IconComponent = Icons[icon]
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleBindButtonClick = () => {
    setIsOpened(true)
  }

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <Button
        variant={isBind ? "ghost" : "outline"}
        size="sm"
        onClick={(e) => handleBindButtonClick()}
        className={cn("gap-2 text-xs", {
          "text-primary/60": !isBind,
        })}
        disabled={isLoading}
        title={isBind ? "点击取消绑定" : "点击绑定账号"}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-3 animate-spin" />
            处理中...
          </>
        ) : isBind ? (
          <>
            {/* <Check className="size-3 stroke-green-500" /> */}
            {accountName}
          </>
        ) : (
          <>
            {/* <Plus className="size-3" /> */}
            未绑定
          </>
        )}
      </Button>

      <div className="flex items-center gap-2">
        <IconComponent
          className={cn("size-10 rounded-full p-2", iconColor, {
            "": isBind,
          })}
        />
      </div>

      <BindAccountAlertDialog
        uuid={uuid}
        recordId={recordId}
        isBinded={isBind}
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        channel={channel}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  )
}
