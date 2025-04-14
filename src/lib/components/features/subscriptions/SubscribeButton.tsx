import { Bell } from "lucide-react"

import { Button } from "@/lib/components/common/ui/button"
import { usePlanDialog } from "@/lib/context/plan/PlanDialogContext"

export function SubscribeButton({ planId }: { planId: string }) {
  const { setPlanDialogId, setIsPlanDialogOpen } = usePlanDialog()

  return (
    <Button
      variant="default"
      className="gap-2"
      onClick={() => {
        setPlanDialogId(planId)
        setIsPlanDialogOpen(true)
      }}
    >
      <Bell className="size-4" />
      订阅
    </Button>
  )
}
