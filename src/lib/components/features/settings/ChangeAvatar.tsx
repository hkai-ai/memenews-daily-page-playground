"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Edit } from "lucide-react"
import imageCompression from "browser-image-compression"

import { uploadAvatar } from "@/lib/api/userinfo"
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { Button } from "@/lib/components/common/ui/button"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/lib/components/common/ui/avatar"
import { Skeleton } from "@/lib/components/common/ui/skeleton"
import request from "@/utils/request"

interface ChangeAvatarProps {
  initialAvatar?: string | null
}

export function ChangeAvatar({ initialAvatar }: ChangeAvatarProps) {
  const { data: session, update } = useSession()
  const [avatar, setAvatar] = useState(initialAvatar ?? "")

  useEffect(() => {
    if (session) {
      setAvatar(session?.user?.avatar || "")
    }
  }, [session])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    const verifyToken = ""
    const timestamp = new Date().getTime().toString()
    const userName = session?.user?.name || ""
    const userId = session?.user?.id || ""

    if (file) {
      try {
        // 压缩图片选项
        const options = {
          maxSizeMB: 1, // 最大文件大小
          maxWidthOrHeight: 1024, // 最大宽高
          useWebWorker: true, // 使用web worker加速
        }

        // 如果文件大于1MB，进行压缩
        const compressedFile =
          file.size > 1024 * 1024 ? await imageCompression(file, options) : file

        const result = await uploadAvatar({
          file: compressedFile,
          verifyToken,
          timestamp,
          userName,
          userId,
        })

        if (result.statusCode !== 200) {
          showErrorToast(`上传头像失败，${result.message}`)
          return
        }

        update({ avatar: result.data?.url })
        setAvatar(result.data?.url ?? "")

        try {
          await request.get({
            url: `/user/profile`,
            params: { userId },
            userId: userId,
          })
        } catch (error) {
          console.error("同步资料失败：", error)
        }

        showSuccessToast("上传头像成功")
      } catch (error) {
        showErrorToast("图片处理失败，请重试")
      }
    }
  }

  return (
    <div className="relative">
      {avatar ? (
        <Avatar className="size-20 rounded-full">
          <AvatarImage className="object-cover" src={avatar} alt="avatar" />
          <AvatarFallback className="skeleton size-full">
            {session?.user?.name?.charAt(0).toUpperCase() ?? ""}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Skeleton className="size-20 rounded-full" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        style={{ display: "none" }}
        id="avatarInput"
      />
      <label htmlFor="avatarInput">
        <Button
          variant="outline"
          size="xs"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("avatarInput")?.click()
          }}
        >
          <Edit className="size-3" />
        </Button>
      </label>
    </div>
  )
}
