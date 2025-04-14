"use client"

import { Dialog, DialogContentMax } from "../../common/ui/dialog"

import { PlanPreviewPage } from "./PlanPreviewPage"

import { usePlanDialog } from "@/lib/context/plan/PlanDialogContext"

export function GlobalPlanPreviewDialog() {
  const { isPlanDialogOpen, setIsPlanDialogOpen, planDialogId } =
    usePlanDialog()

  if (!planDialogId) return null

  return (
    <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
      <DialogContentMax className="hide-scrollbar max-w-[90vw] xl:max-w-7xl">
        <div className="h-[80vh] overflow-auto">
          <PlanPreviewPage
            planId={planDialogId}
            setOpen={setIsPlanDialogOpen}
          />
        </div>
      </DialogContentMax>
    </Dialog>
  )
}
