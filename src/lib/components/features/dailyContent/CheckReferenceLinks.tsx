import { ExternalLink } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/common/ui/popover"
import { cn } from "@/lib/utils"

export function CheckReferenceLinks({
  referenceLinks,
  className,
}: {
  referenceLinks: string[]
  className?: string
}) {
  return (
    <div className={cn("xs:w-full mb-[15px]", className)}>
      <Popover>
        <PopoverTrigger className="flex items-center text-sm text-primary/60 hover:underline">
          <span className="text-xs font-bold">查看来源</span>
          <ExternalLink className="ml-1 h-3 w-3" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">参考来源：</h4>
            <ul className="space-y-1">
              {!!referenceLinks.length ? (
                referenceLinks.map((origin, index) => (
                  <li key={index} className="flex max-w-full items-center">
                    <a
                      href={origin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 items-center truncate text-sm text-blue-500 hover:underline"
                    >
                      {origin}
                    </a>
                    <ExternalLink
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        window.open(origin, "_blank")
                      }}
                      className="ml-1 h-3 w-3 cursor-pointer"
                    />
                  </li>
                ))
              ) : (
                <div className="py-2 text-sm text-muted-foreground">
                  暂无来源
                </div>
              )}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
