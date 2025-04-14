"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"

import { Dialog, DialogContent } from "../../common/ui/dialog"

interface PlanDetailsDialogProps {
  children: ReactNode
}

export function PlanDetailsDialog({ children }: PlanDetailsDialogProps) {
  const router = useRouter()

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open onOpenChange={handleOnOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <div className="mt-8 h-[80vh] overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
