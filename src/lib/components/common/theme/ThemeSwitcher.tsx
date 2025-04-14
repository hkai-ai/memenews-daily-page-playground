"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "../ui/button"

/**
 * 主题切换器
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "切换到亮色主题" : "切换到暗色主题"}
    >
      {theme === "dark" ? (
        <SunIcon className="size-4 opacity-60" />
      ) : (
        <MoonIcon className="size-4 opacity-60" />
      )}
    </Button>
  )
}
