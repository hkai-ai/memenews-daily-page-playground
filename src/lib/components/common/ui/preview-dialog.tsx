import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/lib/components/common/ui/dialog"
import { cn } from "@/lib/utils"

export function PreviewDialog({
  children,
  trigger,
  className,
}: {
  children: React.ReactNode
  trigger: React.ReactNode
  className?: string
}) {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={cn("max-w-fit", className)}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
