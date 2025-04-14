"use client"

import { useRequest } from "ahooks"

import { Badge } from "@/lib/components/common/ui/badge"
import { getUserLevel } from "@/lib/api/auth/get-user-level"
import { UserLevelCNMap, UserLevel } from "@/types/plan"

interface UserLevelDisplayProps {
  userId: string
}

export function UserLevelDisplay({ userId }: UserLevelDisplayProps) {
  const { data: userLevelQueryRes, loading } = useRequest(
    () => getUserLevel({ userId }),
    {
      ready: !!userId,
    },
  )

  const userLevel = userLevelQueryRes?.data?.userLevel
  const proDate = userLevelQueryRes?.data?.proDate

  if (loading || !userLevel) {
    return (
      <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Badge
        className={`px-2 py-1 text-xs ${
          userLevel === UserLevel.Expert
            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
            : ""
        }`}
        variant={userLevel === UserLevel.Expert ? "default" : "secondary"}
      >
        {UserLevelCNMap[userLevel]}
      </Badge>
      {userLevel === UserLevel.Expert && proDate && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          有效期至: {new Date(proDate).toLocaleDateString()}
        </span>
      )}
    </div>
  )
}
