"use client"

import { useSession, signOut, signIn } from "next-auth/react"
import { Link } from "next-view-transitions"
import { Home, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { useRequest } from "ahooks"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Badge } from "../ui/badge"

import { delay } from "@/utils"
import { showSuccessToast } from "@/lib/components/common/ui/toast"
import { getUserLevel } from "@/lib/api/auth/get-user-level"
import { UserLevelCNMap, UserLevel } from "@/types/plan"

export function UserNav({ className }: { className?: string }) {
  const { data: session, status } = useSession()
  const userId = session?.user?.id || ""
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await delay(800)
    showSuccessToast("退出登录成功")
    signOut({ callbackUrl: "/" })
    setIsLoading(false)
  }

  const { data: userLevelQueryRes } = useRequest(
    () => getUserLevel({ userId }),
    {
      ready: !!userId,
    },
  )

  const userLevel = userLevelQueryRes?.data?.userLevel
  const proDate = userLevelQueryRes?.data?.proDate

  return (
    <>
      {status === "unauthenticated" ? (
        <Button variant="outline" onClick={() => signIn()}>
          登录
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar
              className={className}
              role="img"
              aria-label={`${session?.user?.name || "用户"}的头像`}
            >
              <AvatarImage
                className="size-9 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900"
                src={
                  !session?.user?.avatar || session.user?.avatar === ""
                    ? "/user/default_avatar.png"
                    : session.user.avatar
                }
                alt="user's avatar"
              />
              <AvatarFallback className="size-full">
                {session?.user?.name?.charAt(0).toUpperCase() ?? ""}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 overflow-hidden rounded-xl border border-zinc-200 p-0 dark:border-zinc-800"
            align="end"
            forceMount
          >
            <div className="px-6 pb-4 pt-6">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <Avatar className="size-14">
                    <AvatarImage
                      className="rounded-full object-cover ring-2 ring-white dark:ring-zinc-900"
                      src={
                        !session?.user?.avatar || session.user?.avatar === ""
                          ? "/user/default_avatar.png"
                          : session.user.avatar
                      }
                      alt="user's avatar"
                    />
                    <AvatarFallback className="size-full">
                      {session?.user?.name?.charAt(0).toUpperCase() ?? ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {session?.user?.name ?? "佚名用户"}
                  </h2>
                  <p className="max-w-36 truncate text-sm text-zinc-600 dark:text-zinc-400">
                    {session?.user?.email ?? "还未登记邮箱哦~"}
                  </p>
                </div>
              </div>
              {userLevel && (
                <div className="mt-2 flex flex-col gap-1">
                  <Badge
                    className={`px-2 py-1 text-xs ${
                      userLevel === UserLevel.Expert
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                        : ""
                    }`}
                    variant={
                      userLevel === UserLevel.Expert ? "default" : "secondary"
                    }
                  >
                    {UserLevelCNMap[userLevel]}
                  </Badge>
                  {userLevel === UserLevel.Expert && proDate && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      有效期至: {new Date(proDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mx-6 h-px bg-zinc-200 dark:bg-zinc-800" />

            <div className="space-y-1.5 p-2 px-5">
              <DropdownMenuItem asChild className="rounded-lg px-2">
                <Link href="/" className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="size-4" />
                    <span className="text-sm font-medium">主页</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-lg px-2">
                <Link
                  href="/settings"
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="size-4" />
                    <span className="text-sm font-medium">设置</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-2 rounded-lg p-1 p-1.5 px-2 text-sm hover:bg-accent focus:bg-accent focus:text-accent-foreground">
                      <LogOut className="size-4" />
                      <span className="font-medium">退出登录</span>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>退出登录</AlertDialogTitle>
                      <AlertDialogDescription>
                        确定要退出登录吗？
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <Button
                        disabled={isLoading}
                        variant="destructive"
                        onClick={handleLogout}
                      >
                        退出登录
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
