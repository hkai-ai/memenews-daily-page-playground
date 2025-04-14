"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../../common/ui/toast"

import { Input } from "@/lib/components/common/ui/input"
import { activePushAction } from "@/lib/api/channel/home-page-active-push"
import { cn } from "@/lib/utils"

export function ActivePushSectionForm() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValid, setIsValid] = useState(true)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async () => {
    if (!email) {
      showInfoToast("请输入邮箱地址")
      return
    }

    if (!validateEmail(email)) {
      setIsValid(false)
      showInfoToast("请输入有效的邮箱地址")
      return
    }

    setIsSubmitting(true)

    try {
      await activePushAction({
        channels: [
          {
            id: "",
            name: "email",
            address: email,
            pushTime: new Date().toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
        userId: userId!,
      })

      showSuccessToast("订阅成功！示例日报将发送到您的邮箱，请注意查收")
      setEmail("")
    } catch (error) {
      showErrorToast("订阅失败，请稍后再试")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (!isValid) {
      setIsValid(validateEmail(e.target.value))
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl text-center">
      <h2 className="mb-6 text-3xl font-bold">😏 别BB，先收一份看看效果</h2>
      <p className="mb-8 text-gray-600">
        我们将向您提供的邮箱发送示例日报，您可以查看效果
      </p>

      <div className="mx-auto flex max-w-md rounded-md shadow-sm">
        <Input
          id="email"
          className={cn(
            "-me-px flex-1 rounded-e-none rounded-s-md border-r py-6 pl-4 pr-2 text-base focus-visible:ring-offset-0",
            !isValid && "border-red-500 focus-visible:ring-red-500",
          )}
          placeholder="输入你的邮箱地址"
          type="email"
          value={email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
        />
        <button
          aria-label="立即订阅"
          className="rounded-e-md bg-blue-600 px-6 py-2 font-medium text-white outline-blue-600 transition-colors duration-200 hover:bg-blue-700 disabled:opacity-70"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          立即订阅
        </button>
      </div>
    </div>
  )
}
