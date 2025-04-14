import { ReactNode, Children } from "react"

import { Card } from "../../common/ui/card"

import { Separator } from "@/lib/components/common/ui/separator"
import { cn } from "@/lib/utils"

interface SettingItemProps {
  title: string
  description?: string
  children: ReactNode
}

export function SettingItem({
  title,
  description,
  children,
}: SettingItemProps) {
  return (
    <div className="p-2 px-4">
      <section className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-sm">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        <div>{children}</div>
      </section>
    </div>
  )
}

interface SettingContentProps {
  children: ReactNode
  separator?: boolean
  className?: string
}

export function SettingContent({
  children,
  separator = false,
  className,
}: SettingContentProps) {
  const childrenArray = Children.toArray(children)

  return (
    <Card className={cn("rounded-md p-2", className)}>
      {childrenArray.map((child, index) => (
        <div key={index}>
          {child}
          {index < childrenArray.length - 1 && separator && (
            <div className="px-4">
              <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
            </div>
          )}
        </div>
      ))}
    </Card>
  )
}
