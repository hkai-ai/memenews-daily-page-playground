"use client"

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"

import { Button } from "../../common/ui/button"

import { cn } from "@/lib/utils"

/**
 * ReadingLimitMask 组件
 * 用于限制未登录用户的阅读行为，通过滚动触发显示遮罩层提醒登录
 *
 * 功能特点:
 * - 在滚动到 1200px 时显示第一次提醒，用户可关闭
 * - 在滚动到 3000px 时显示第二次提醒，用户无法关闭
 * - 提醒状态在 24 小时内保持
 * - 用户登录后自动清除所有限制状态
 * - 显示遮罩时锁定页面滚动
 */
export function ReadingLimitMask() {
  const { status: sessionStatus } = useSession()

  // 如果用户已登录，清除所有状态
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      localStorage.removeItem("firstPopupShown")
      localStorage.removeItem("secondPopupShown")
    }
  }, [sessionStatus])

  const [isShowMask, setIsShowMask] = useState(false)
  const [isSecondPopup, setIsSecondPopup] = useState(() => {
    // 只有在未登录状态下才检查localStorage
    if (sessionStatus === "unauthenticated") {
      const savedData = localStorage.getItem("secondPopupShown")
      if (savedData) {
        try {
          const { shown, timestamp } = JSON.parse(savedData)
          const now = Date.now()
          if (now - timestamp < 24 * 60 * 60 * 1000) {
            return true
          }
        } catch (e) {
          // 如果解析失败，重置状态
        }
      }
    }
    return false
  })

  // 检查是否显示过第一个弹窗（1200px）
  const [hasShownFirstPopup, setHasShownFirstPopup] = useState(() => {
    // 只有在未登录状态下才检查localStorage
    if (sessionStatus === "unauthenticated") {
      const savedData = localStorage.getItem("firstPopupShown")
      if (savedData) {
        try {
          const { shown, timestamp } = JSON.parse(savedData)
          const now = Date.now()
          if (now - timestamp < 24 * 60 * 60 * 1000) {
            return shown
          }
        } catch (e) {
          // 如果解析失败，重置状态
        }
      }
    }
    return false
  })

  // 检查是否显示过第二个弹窗（3000px）
  const [hasShownSecondPopup, setHasShownSecondPopup] = useState(() => {
    // 只有在未登录状态下才检查localStorage
    if (sessionStatus === "unauthenticated") {
      const savedData = localStorage.getItem("secondPopupShown")
      if (savedData) {
        try {
          const { shown, timestamp } = JSON.parse(savedData)
          const now = Date.now()
          if (now - timestamp < 24 * 60 * 60 * 1000) {
            return shown
          }
        } catch (e) {
          // 如果解析失败，重置状态
          return false
        }
      }
    }
    return false
  })

  // 初始化时，如果第二个弹窗已经显示过且在24小时内，直接显示遮罩
  useEffect(() => {
    if (hasShownSecondPopup && sessionStatus === "unauthenticated") {
      setIsShowMask(true)
      setIsSecondPopup(true)
    }
  }, [hasShownSecondPopup, sessionStatus])

  useEffect(() => {
    // 只在未登录状态下添加滚动监听
    if (sessionStatus !== "unauthenticated") return

    const handleScroll = () => {
      const scrollY = window.scrollY

      // 处理第一个弹窗（1200px）
      if (scrollY > 1200 && !hasShownFirstPopup && !isShowMask) {
        setIsShowMask(true)
        setIsSecondPopup(false)
        setHasShownFirstPopup(true)
        localStorage.setItem(
          "firstPopupShown",
          JSON.stringify({
            shown: true,
            timestamp: Date.now(),
          }),
        )
      }
      // 处理第二个弹窗（3000px）
      else if (
        scrollY > 3000 &&
        !hasShownSecondPopup &&
        !isShowMask &&
        hasShownFirstPopup
      ) {
        setIsShowMask(true)
        setIsSecondPopup(true)
        setHasShownSecondPopup(true)
        localStorage.setItem(
          "secondPopupShown",
          JSON.stringify({
            shown: true,
            timestamp: Date.now(),
          }),
        )
      }
    }

    // 只有在未显示第二个弹窗时才添加滚动监听
    if (!hasShownSecondPopup) {
      window.addEventListener("scroll", handleScroll)
      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [hasShownFirstPopup, hasShownSecondPopup, isShowMask, sessionStatus])

  // 添加滚动锁定的副作用
  useEffect(() => {
    if (isShowMask) {
      // 保存当前滚动位置
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
    } else {
      // 恢复滚动位置
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, parseInt(scrollY || "0") * -1)
    }
  }, [isShowMask])

  const handleClose = () => {
    // 只有第一个弹窗可以关闭
    if (!isSecondPopup) {
      setIsShowMask(false)
    }
  }

  return (
    <>
      {sessionStatus === "unauthenticated" && (
        <section
          className={cn(
            "pointer-events-none fixed inset-0 z-30 flex size-full items-end duration-1000 ease-in-out",
            "bg-white-to-transparent-25",
            isShowMask ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="pointer-events-auto z-20 mb-[20%] flex w-full flex-col items-center gap-4 text-black xl:mb-[6%]">
            <p className="flex flex-col items-center text-lg font-bold md:block lg:text-center lg:text-2xl">
              <span>👏 你好,</span>
              <span>这里是元狲科技产品「Memenews」的生成日报</span>
            </p>
            <p className="hidden items-center md:flex md:flex-col md:text-lg">
              Memenews 是一款生成式的日报产品，在确定了 meme
              并配置推送渠道进行订阅后，每天便会生成这样的一份日报。
            </p>
            <p className="flex flex-col text-center md:text-xl">
              <span>点击订阅按钮，配置推送渠道，</span>{" "}
              <span>即可在每一天接收到日报通知。</span>
            </p>
            <Button
              onClick={async () => {
                await signIn()
                handleClose()
              }}
              className="w-1/2 bg-blue-500 text-white hover:bg-blue-600 xl:w-1/3"
            >
              登录后体验
            </Button>

            {/* 只在第一个弹窗时显示"暂不登录"选项 */}
            {!isSecondPopup && (
              <p
                className="cursor-pointer text-sm text-muted-foreground"
                onClick={handleClose}
              >
                暂不登录
              </p>
            )}
          </div>
        </section>
      )}
    </>
  )
}
