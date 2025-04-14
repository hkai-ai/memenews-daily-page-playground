"use client"
import { createContext, useContext, useState, ReactNode } from "react"
import { useSession } from "next-auth/react"

import { Dialog, DialogContent } from "@/lib/components/common/ui/dialog"
import { Button } from "@/lib/components/common/ui/button"
import { NEXT_PUBLIC_AUTH_SERVER_URL } from "@/config/api"

interface IntroStepContextType {
  openIntroStep: () => void
}

const IntroStepContext = createContext<IntroStepContextType | undefined>(
  undefined,
)

export function IntroStepProvider({ children }: { children: ReactNode }) {
  const { data: session, update } = useSession()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)

  const updateNewUserState = () =>
    fetch(
      `${NEXT_PUBLIC_AUTH_SERVER_URL}/api/user/profile/newsdiy?userId=${session?.user?.id}&isUserNew=false`,
      { method: "PUT" },
    )

  const openIntroStep = () => {
    if (session?.user?.isNew && !open) {
      setOpen(true)
    }
  }

  const handleNextStep = () => {
    setStep((prevStep) => (prevStep < 3 ? prevStep + 1 : prevStep))
  }

  const handlePreviousStep = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep))
  }

  return (
    <IntroStepContext.Provider value={{ openIntroStep }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[30rem]" withoutClose>
          <div className="flex flex-col items-center">
            {[
              {
                image: "/intro/first-step-plan.jpg",
                alt: "a page show some public plan",
                title: "订阅他人的 meme 或者自己 DIY",
                description:
                  "你可以自定义您 meme（订阅方案），或者在社区中寻找你喜欢的 meme。",
              },
              {
                image: "/intro/second-step-channel.jpg",
                alt: "a page show some channel",
                title: "添加你的推送渠道",
                description:
                  "选择你的推送渠道，你的 meme 将会通过这些渠道推送。",
              },
              {
                image: "/intro/third-step-read.jpg",
                alt: "a page show article",
                title: "开始你的阅读之旅",
                description:
                  "你已经完成了所有步骤，现在可以开始阅读专属于你的 meme 了。",
              },
            ].map((item, index) => (
              <div
                key={index + 1}
                className={step === index + 1 ? "block" : "hidden"}
              >
                <img
                  className="aspect-video w-full rounded-md object-cover drop-shadow-lg"
                  src={item.image}
                  alt={item.alt}
                />
                <div className="w-full py-6">
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}

            <div className="mt-4 flex w-full items-center justify-between">
              <div className="flex space-x-1">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    onClick={() => setStep(s)}
                    className={`size-3 rounded-full ${
                      step >= s ? "bg-gray-400" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                {step > 1 && (
                  <Button variant="outline" onClick={handlePreviousStep}>
                    上一步
                  </Button>
                )}
                {step < 3 ? (
                  <Button variant="default" onClick={handleNextStep}>
                    下一步
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={async () => {
                      // 这里其实存在一个问题，一个是我没有做是否成功修改的确认，直接就更新 session 了
                      // 二是，我感觉好像是开发环境下的问题，那就是 session 更新后会重新触发一次页面渲染，造成我要弹两次框，等等推到生产环境再看看
                      try {
                        await updateNewUserState()
                        await update({ isNew: false })
                        setOpen(false)
                      } catch (error) {
                        console.error("Failed to update new user state:", error)
                      }
                    }}
                  >
                    关闭
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </IntroStepContext.Provider>
  )
}

/**
 * 在客户端组件里调用该钩子即可弹出相应提示框
 * 其实我在想，也许最好的做法是服务端那边不保存新用户信息，而是每当有人的本地 localstorge 或者 cookie 里没有标识它用过的值而后弹出。
 * 但做都做了，就这样吧
 * @returns
 */
export function useIntroStep() {
  const context = useContext(IntroStepContext)
  if (context === undefined) {
    throw new Error("useIntroStep must be used within an IntroStepProvider")
  }
  return context
}
