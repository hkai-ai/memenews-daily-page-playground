"use client"

import { SessionProvider as Provider } from "next-auth/react"

/**
 * 提供登录上下文的组件。
 * 由于 context 的注入只能在客户端组件中使用，因此使用该用法。
 */
export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider>{children}</Provider>
}
