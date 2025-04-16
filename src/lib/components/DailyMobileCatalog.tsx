"use client"

import { useEffect, useState } from "react"
import { AlignLeft } from "lucide-react"

import { Button } from "../../common/ui/button"

import { formatIndex } from "./NewsContent"

import { cn } from "@/lib/utils"
import { Icons } from "@/lib/components/common/icon"
import { getDailyDetailByIdAction } from "@/lib/api/daily"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/lib/components/common/ui/sheet"

interface DailyMobileCatalogProps {
  title: string
  catalogs: { title: string; id: number }[]
  contents: Awaited<
    ReturnType<typeof getDailyDetailByIdAction>
  >["data"]["content"]
}

export function DailyMobileCatalog({
  title,
  catalogs,
  contents,
}: DailyMobileCatalogProps) {
  const [activeSection, setActiveSection] = useState<number | null>(0)
  const [showMobileCatalog, setShowMobileCatalog] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = null
      const scrollPosition = window.scrollY + window.innerHeight / 2

      // 从后往前遍历，确保获取到最后一个符合条件的section
      for (let i = catalogs.length - 1; i >= 0; i--) {
        const section = document.getElementById(`section${i}`)
        if (section && scrollPosition >= section.offsetTop) {
          currentSection = i
          break
        }
      }
      setActiveSection(currentSection)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [catalogs])

  return (
    <Sheet open={showMobileCatalog} onOpenChange={setShowMobileCatalog}>
      <SheetTrigger>
        <Button size="icon" variant="outline">
          <AlignLeft className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="xl:hidden">
        <div className="flex flex-col gap-4 overflow-auto font-read-title">
          <span className="text-sm font-semibold leading-loose text-primary">
            目录
          </span>

          <ul className="flex flex-col gap-2">
            {contents.map((content, index) => {
              let normalArticleCount = -1
              contents.slice(0, index + 1).forEach((contentItem) => {
                if (!contentItem.isRelated) {
                  normalArticleCount++
                }
              })

              const formattedIndex = content.isRelated
                ? "related"
                : formatIndex(String(normalArticleCount))

              return (
                <li
                  key={index}
                  className={cn(
                    "flex items-center gap-2 text-primary/50 hover:text-primary",
                    {
                      "font-semibold text-primary": activeSection === index,
                    },
                  )}
                >
                  {!content.isDailyPush && (
                    <span className="text-sm text-red-500">
                      {formattedIndex === "related" ? (
                        <Icons.fire className="size-3" />
                      ) : (
                        formattedIndex
                      )}
                    </span>
                  )}

                  <a
                    href={`#section${String(index)}`}
                    className="max-w-96 overflow-hidden text-ellipsis text-nowrap text-sm transition-colors duration-300 ease-in-out hover:text-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowMobileCatalog(false)
                      const section = document.getElementById(`section${index}`)
                      if (section) {
                        window.scrollTo({
                          top: section.offsetTop - 10,
                          behavior: "smooth",
                        })
                      }
                    }}
                  >
                    {content.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
