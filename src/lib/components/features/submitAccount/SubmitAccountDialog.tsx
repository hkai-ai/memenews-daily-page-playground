"use client"

import { Plus } from "lucide-react"

import { SidebarMenuButton } from "../../common/ui/sidebar"
import { HintTip } from "../../common/ui/hint-tip"

import { SubmitAccountForm } from "./SubmitAccountForm"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/common/ui/dialog"

export function SubmitAccountDialog() {
  return (
    <Dialog>
      <HintTip label="提交您认为有价值的信息源" asChild>
        <DialogTrigger asChild>
          <SidebarMenuButton>
            <Plus />
            <span>提交信息源</span>
          </SidebarMenuButton>
        </DialogTrigger>
      </HintTip>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-x-visible overflow-y-scroll" style={{
        scrollbarWidth: 'none'
      }}>
        <DialogHeader>
          <DialogTitle>😎提交信息源</DialogTitle>
          <SubmitAccountForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
