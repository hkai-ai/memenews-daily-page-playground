"use client"

import { Languages } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC } from "react"

import { Button } from "@/lib/components/common/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/lib/components/common/ui/dropdown-menu"
import { LocalLanguage } from "@/types/common/language"

interface LanguageSwitcherProps {
  currentLanguage: LocalLanguage
  setLanguage: (language: LocalLanguage) => void
}

/**
 * @deprecated 语言切换器组件，暂时弃用
 *
 * @param currentLanguage 当前语言
 * @param setLanguage 设置语言的回调函数
 * @returns 语言切换器组件
 */
export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  currentLanguage,
  setLanguage,
}) => {
  const { theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const switchLanguage = (lng: LocalLanguage) => {
    // 检查当前路径是否已经包含语言标识符
    const segments = pathname.split("/")
    if (["zh", "en", "tw"].includes(segments[1])) {
      segments[1] = lng
    } else {
      segments.unshift("", lng) // 添加新的语言标识符
    }
    const newPath = segments.join("/")

    // 保留查询参数
    const params = new URLSearchParams(searchParams).toString()
    const url = params ? `${newPath}?${params}` : newPath

    router.push(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-transparent"
          id="language-switch-button"
          aria-label="Click to switch language of this page"
        >
          <Languages className="size-5 lg:size-6" strokeWidth={1} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuCheckboxItem
          checked={currentLanguage === LocalLanguage.ZH_CN}
          onCheckedChange={() => {
            setLanguage(LocalLanguage.ZH_CN)
          }}
          aria-label="简体中文"
        >
          简体中文
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={currentLanguage === LocalLanguage.ZH_TW}
          onCheckedChange={() => {
            setLanguage(LocalLanguage.ZH_TW)
          }}
          aria-label="繁體中文"
        >
          繁體中文
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={currentLanguage === LocalLanguage.EN}
          onCheckedChange={() => {
            setLanguage(LocalLanguage.EN)
          }}
          aria-label="English"
        >
          English
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
