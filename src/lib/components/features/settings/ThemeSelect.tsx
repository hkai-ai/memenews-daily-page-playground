"use client"

import { useTheme } from "next-themes"
import { SunIcon, MoonIcon, Monitor } from "lucide-react"

import { SettingItem } from "./SettingItem"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/lib/components/common/ui/select"

export function ThemeSelect() {
  const { theme, setTheme } = useTheme()

  const themeMap = {
    system: <Monitor className="size-3 opacity-60" />,
    dark: <MoonIcon className="size-3 opacity-60" />,
    light: <SunIcon className="size-3 opacity-60" />,
  }

  const curTheme =
    theme === "system" ? "系统" : theme === "dark" ? "深色" : "浅色"

  const curIcon = themeMap[theme as keyof typeof themeMap]

  return (
    <SettingItem title="外观">
      <Select onValueChange={(value) => setTheme(value)} defaultValue={theme}>
        <SelectTrigger hideIcon className="h-8 gap-2">
          {curIcon}
          <span className="text-xs">{curTheme}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <SunIcon className="mr-2 inline size-4 opacity-60" /> 浅色
          </SelectItem>
          <SelectItem value="dark">
            <MoonIcon className="mr-2 inline size-4 opacity-60" /> 深色
          </SelectItem>
          <SelectItem value="system">
            <Monitor className="mr-2 inline size-4 opacity-60" /> 系统
          </SelectItem>
        </SelectContent>
      </Select>
    </SettingItem>
  )
}
