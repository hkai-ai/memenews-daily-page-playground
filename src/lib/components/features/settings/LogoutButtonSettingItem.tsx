"use client"

import { LogOut } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import { Button } from "../../common/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../common/ui/alert-dialog"

import { SettingItem } from "./SettingItem"

import { showSuccessToast } from "@/lib/components/common/ui/toast"
import { delay } from "@/utils"

interface LogoutButtonSettingItemProps {
  initialUserName?: string | null
}

export function LogoutButtonSettingItem({
  initialUserName,
}: LogoutButtonSettingItemProps) {
  const { data: session } = useSession()

  const handleLogout = async () => {
    showSuccessToast("退出登录成功")
    await delay(800)
    signOut({ callbackUrl: "/" })
  }

  return (
    <SettingItem
      title="活跃账户"
      description={`当前登录的账户: ${session?.user?.name ?? ""}`}
    >
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" className="gap-2 text-xs">
            <LogOut className="size-4" />
            退出登录
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>退出登录</AlertDialogTitle>
            <AlertDialogDescription>确定要退出登录吗？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <Button variant="destructive" onClick={handleLogout}>
              退出登录
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingItem>
  )
}
