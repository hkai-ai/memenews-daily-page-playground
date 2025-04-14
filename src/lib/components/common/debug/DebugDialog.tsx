import { Bug } from "lucide-react"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogContentMax,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

import { isDEV } from "@/config"
import { cn } from "@/lib/utils"

export function DebugDialog({
  isSidebarExist,
  side = "left",
  children,
}: {
  isSidebarExist?: boolean
  side?: "left" | "right"
  children: React.ReactNode
}) {
  if (!isDEV) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "fixed bottom-4 z-[999] size-8",
            side === "left" ? "left-4" : "right-4",
            isSidebarExist ? "left-72" : "",
          )}
        >
          <Bug className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bottom-4 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Debug Info</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 overflow-y-scroll break-all text-sm">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
