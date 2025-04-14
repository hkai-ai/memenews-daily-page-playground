import { Bell } from "lucide-react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/lib/components/common/ui/alert-dialog"
import { Button } from "@/lib/components/common/ui/button"

interface SubscribeSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscribeSuccessDialog({
  open,
  onOpenChange,
}: SubscribeSuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            订阅成功
          </AlertDialogTitle>
          <AlertDialogDescription>
            您将在明早 8:30 收到我们的日报推送
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            知道了
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
