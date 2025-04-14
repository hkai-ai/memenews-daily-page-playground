"use client"
import { useRouter } from "next/navigation"

import { IllustrationNoContent } from "@/lib/components/common/illustrations"
import { Button } from "@/lib/components/common/ui/button"

export function ErrorDaily() {
  const router = useRouter()
  return (
    <section className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center gap-4 px-4 text-center text-sm">
      <IllustrationNoContent />
      <div className="w-full max-w-md space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            哎呀，暂时没有找到内容 🕵️‍♀️
          </h3>
          <p className="mt-2 font-bold text-muted-foreground">
            可能出现了一些意外的小状况。
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            可能的原因
          </h4>
          <div className="space-y-2">
            <div className="flex items-start">
              <div className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="text-gray-500 dark:text-gray-400"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <p className="flex-1 text-left text-xs text-gray-600 dark:text-gray-400">
                访问的内容不存在或已被移除
              </p>
            </div>
            <div className="flex items-start">
              <div className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="text-gray-500 dark:text-gray-400"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.48.41-2.86 1.12-4.06l11.94 11.94C14.86 19.59 13.48 20 12 20zm6.88-3.94L6.12 5.12C7.86 3.54 9.82 3 12 3c4.41 0 8 3.59 8 8 0 1.48-.41 2.86-1.12 4.06z" />
                </svg>
              </div>
              <p className="flex-1 text-left text-xs text-gray-600 dark:text-gray-400">
                网络问题导致内容加载失败
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 max-w-md text-xs text-muted-foreground">
          您是从我们向您提供的内容中进入此页面的么？如果不是，请
          <a
            href="https://m0e8x072xo3.feishu.cn/share/base/form/shrcn8CItXLpxpUX7zcvQJPjoXy"
            className="mx-1 text-primary underline"
          >
            联系我们
          </a>
          获取帮助。
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="h-9 text-xs"
          onClick={() => router.refresh()}
        >
          刷新试试
        </Button>
        <Button className="h-9 text-xs" onClick={router.back}>
          返回上一页
        </Button>
      </div>
    </section>
  )
}
