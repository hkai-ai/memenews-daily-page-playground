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

export function ActivePushForm() {
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

      showSuccessToast(
        "订阅成功！示例日报将发送到您的邮箱，可能会稍有延迟，请耐心等待",
      )
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
    <div className="shadow-xs flex max-w-xs rounded-md">
      <Input
        id="email"
        className={cn(
          "-me-px flex-1 rounded-ee-none shadow-none placeholder:text-sm focus-visible:z-10 focus-visible:ring-0",
          !isValid && "border-red-500 focus-visible:ring-red-500",
        )}
        placeholder="输入邮箱，接收示例日报"
        type="email"
        value={email}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
      />
      <button
        aria-label="Subscribe"
        className="inline-flex items-center rounded-e-md border border-input bg-background px-4 text-sm font-medium text-foreground outline-none transition-[color,box-shadow] hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        发送
      </button>
    </div>
  )
}
