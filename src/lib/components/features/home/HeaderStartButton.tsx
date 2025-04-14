"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/lib/components/common/ui/button"

export function HeaderStartButton() {
  const router = useRouter()
  const { data: session, status } = useSession()
  console.log("session", session)

  return (
    <>
      {status === "unauthenticated" && (
        <Button variant="outline" onClick={() => signIn()}>
          登录
        </Button>
      )}

      <Button
        size="sm"
        onClick={() => {
          if (status === "authenticated") {
            router.push(session?.user?.redirectUrl || "/memes")
          } else {
            signIn()
          }
        }}
      >
        前往订阅
      </Button>
    </>
  )
}
