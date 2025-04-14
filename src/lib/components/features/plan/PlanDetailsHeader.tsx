"use client"

import { useSession } from "next-auth/react"

import { Header } from "../../common/layout"

export function PlanDetailsHeader() {
  const { status } = useSession()

  return <>{status === "unauthenticated" ? <Header lang="en" /> : <></>}</>
}
