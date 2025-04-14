"use client"

import { useSession } from "next-auth/react"
import useSWR from "swr"
import { match } from "ts-pattern"

import { BindSociolAccountFormItem } from "./BindSociolAccountFormItem"
import { SettingItem } from "./SettingItem"

import { NEXT_PUBLIC_AUTH_SERVER_URL } from "@/config/api"

/**
 * @description 获取用户资料的接口返回数据
 */
interface GetResponse {
  user?: {
    id: string
    email: string
    username: string
    avatar: string
    thirdPartyAccounts: {
      source: string
      username: string
      loginname: string
      avatarUrl: string
      email: string
      recordId: string
    }[]
  }
  message?: string
  error?: string
}

/**
 * @description SWR用于持续获取用户资料，该 props 定义了相应的 fetcher 所需要的参数
 */
interface ProfileFetcherProps {
  baseUrl: string
  userId: string
  verifyToken: string
  timestamp: string
  platform: string
}

/**
 * SWR fetcher 函数，用于获取用户资料
 * @param param0
 * @returns
 */
const profileFetcher = async ({
  baseUrl,
  userId,
  verifyToken,
  timestamp,
  platform,
}: ProfileFetcherProps) => {
  if (!userId) {
    throw new Error("userId is required")
  }
  const response = await fetch(
    `${baseUrl}/api/user/profile/newsdiy?userId=${userId}&verifyToken=${verifyToken}&timestamp=${timestamp}&platform=${platform}`,
  )
  const data = await response.json()
  return data
}

interface BindSociolAccountsDialogSettingItemProps {
  initialUserId?: string | null
}

export function BindSociolAccountsDialogSettingItem({ initialUserId }: BindSociolAccountsDialogSettingItemProps) {
  const { data: session } = useSession()
  const userId = initialUserId ?? session?.user?.id ?? ""
  /**
   * @description 使用 SWR 进行用户资料的持续获取
   * 为什么这么写呢？因为我们需要在用户绑定第三方账号后，立即更新页面上的绑定状态
   * 如果通过 session 回调的方式使用 session 信息和账户资料绑定，需要对 session 进行修改，代码会有糟糕的耦合性
   * @mention 突然发现搭配现在的登录逻辑没必要使用 SWR，因为登录后会自动刷新页面，但是我还是想保留这个代码，也许这个会在以后有其他地方可以绑定取消账号的时候有意义
   */
  const { data, isLoading } = useSWR<GetResponse, any>(
    "/api/profile/newsdiy",
    () =>
      profileFetcher({
        baseUrl: NEXT_PUBLIC_AUTH_SERVER_URL,
        userId,
        verifyToken: "",
        timestamp: new Date().getTime().toString(),
        platform: "newsdiy",
      }),
    {
      shouldRetryOnError: true,
      //  refreshInterval: 2000
    },
  )

  /**
   * 判断第三方账号是否已经绑定
   * @param data 从接口获取的用户资料数据
   * @param thirdPartyPlatform
   * @returns
   */
  const isThirdPartyAccountBinded = (
    data: GetResponse,
    thirdPartyPlatform: string,
  ) => {
    if (!data.user) {
      return false
    }
    const targetThirdPartyAccount = data.user.thirdPartyAccounts.find(
      (account) => account.source === thirdPartyPlatform,
    )
    return targetThirdPartyAccount != undefined
  }

  /**
   * 获取第三方账号的用户名
   * @param data
   * @param thirdPartyPlatform
   * @returns
   */
  const getThirdPartyAccountName = (
    data: GetResponse,
    thirdPartyPlatform: string,
  ) => {
    if (!data.user) {
      return ""
    }
    const targetThirdPartyAccount = data.user.thirdPartyAccounts.find(
      (account) => account.source === thirdPartyPlatform,
    )
    return match(targetThirdPartyAccount)
      .with({ source: "github" }, (ele) => ele.loginname)
      .with({ source: "wechat" }, (ele) => ele.username)
      .with({ source: "google" }, (ele) => ele.email)
      .otherwise(() => "")
  }

  const getThirdPartyAccountRecordId = (
    data: GetResponse,
    thirdPartyPlatform: string,
  ) => {
    if (!data.user) {
      return ""
    }
    const targetThirdPartyAccount = data.user.thirdPartyAccounts.find(
      (account) => account.source === thirdPartyPlatform,
    )
    return match(targetThirdPartyAccount)
      .with({ source: "github" }, (ele) => ele.recordId)
      .with({ source: "wechat" }, (ele) => ele.recordId)
      .with({ source: "google" }, (ele) => ele.recordId)
      .otherwise(() => "")
  }

  return (
    <>
      <SettingItem title="GitHub">
        <BindSociolAccountFormItem
          channel="Github"
          uuid={session?.user?.id ?? ""}
          recordId={
            data != undefined
              ? getThirdPartyAccountRecordId(data, "github")
              : ""
          }
          isBind={
            data != undefined && isThirdPartyAccountBinded(data, "github")
          }
          accountName={
            data != undefined ? getThirdPartyAccountName(data, "github") : ""
          }
          icon={"gitHub"}
          name=""
        />
      </SettingItem>

      <SettingItem title="微信">
        <BindSociolAccountFormItem
          channel="微信"
          uuid={session?.user?.id ?? ""}
          recordId={
            data != undefined
              ? getThirdPartyAccountRecordId(data, "wechat")
              : ""
          }
          isBind={
            data != undefined && isThirdPartyAccountBinded(data, "wechat")
          }
          icon={"wechat"}
          name=""
          accountName={
            data != undefined ? getThirdPartyAccountName(data, "wechat") : ""
          }
        />
      </SettingItem>

      <SettingItem title="Google">
        <BindSociolAccountFormItem
          channel="Google"
          uuid={session?.user?.id ?? ""}
          recordId={
            data != undefined
              ? getThirdPartyAccountRecordId(data, "google")
              : ""
          }
          isBind={
            data != undefined && isThirdPartyAccountBinded(data, "google")
          }
          icon={"google"}
          name=""
          accountName={
            data != undefined ? getThirdPartyAccountName(data, "google") : ""
          }
        />
      </SettingItem>
    </>
  )
}
