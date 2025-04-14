"use client"

import { Check, Edit, X } from "lucide-react"
import { useRef, useState } from "react"
import { useSession } from "next-auth/react"

import { LoadingSkeleton } from "../../common/ui/loading-skeleton"
import { showErrorToast, showSuccessToast } from "../../common/ui/toast"

import { Input } from "@/lib/components/common/ui/input"
import { updateUserProfile } from "@/lib/api/userinfo"
import { cn } from "@/lib/utils"
import { FormHint } from "@/lib/components/common/ui/form"
import request from "@/utils/request"

interface UsernameInputProps {
  initialName?: string | null
}

export function UsernameInput({ initialName }: UsernameInputProps) {
  const { data: session, update } = useSession()
  const userId = session?.user?.id || ""
  const [name, setName] = useState(initialName ?? "")
  const [isEdited, setIsEdited] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(true)
    const res = await updateUserProfile({
      verifyToken: "",
      timestamp: new Date().getTime().toString(),
      userId,
      _body: {
        username: name,
      },
    })

    if (res?.data === undefined) {
      showErrorToast("更新用户名失败")
      setIsEditing(false)
      return
    }

    try {
      await request.get({
        url: `/user/profile`,
        params: { userId },
        userId: userId,
      })
    } catch (error) {
      console.error("同步资料失败：", error)
    }

    showSuccessToast("更新用户名成功")
    setIsEditing(false)

    update({ newUserName: res.data.newUserName })
    setIsEdited(false)
  }

  return (
    <form onSubmit={handleChangeUsername} className="relative">
      <Input
        disabled={!isEdited || isEditing}
        placeholder="您的昵称"
        ref={inputRef}
        value={name}
        className={cn({
          "w-80 bg-background": isEditing || isEdited,
        })}
        onChange={(e) => {
          if (e.target.value.length <= 16) {
            setName(e.target.value)
          }
        }}
      />

      {name.length > 16 && <FormHint>昵称不能超过16个字符</FormHint>}

      {isEdited ? (
        <div className="absolute right-3 top-1.5 flex gap-3">
          {isEditing ? (
            <LoadingSkeleton className="text-sm">修改中</LoadingSkeleton>
          ) : (
            <>
              <button type="submit" tabIndex={0}>
                <Check className="size-6 p-1" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setName(session?.user?.name || "")
                  setIsEdited(false)
                }}
                className="cursor-pointer"
              >
                <X className="size-6 p-1" />
              </button>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsEdited(true)
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
          className="absolute right-3 top-1.5 size-5"
        >
          <Edit className="size-6 p-1" />
        </button>
      )}
    </form>
  )
}
