"use client"

import { X } from "lucide-react"
import { useState } from "react"

import { Card, CardHeader, CardContent } from "../../common/ui/card"
import { SearchAccountInput } from "../../../../app/(dashboard)/memes/create/_components/Filter/SearchAccountInput"

import { Icons } from "@/lib/components/common/icon"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/lib/components/common/ui/avatar"
import { Button } from "@/lib/components/common/ui/button"
import { ChannelWithIsSub } from "@/lib/hooks/create-edit-plan/useAccounts"

interface SelectedAccountsListProps {
  className?: string
  selectedAccounts: ChannelWithIsSub[]
  setSelectedAccounts: (accounts: ChannelWithIsSub[]) => void
}

interface PlatformInfo {
  name: string
  icon: React.ReactNode
}

const PLATFORM_INFO: Record<string, PlatformInfo> = {
  wechat: {
    name: "微信",
    icon: <Icons.wechat className="size-4 fill-green-500" />,
  },
  twitter: {
    name: "Twitter",
    icon: <Icons.twitter className="size-4" />,
  },
  weibo: {
    name: "微博",
    icon: <Icons.weibo className="size-4 fill-red-500" />,
  },
} as const

export const SelectedAccountsList: React.FC<SelectedAccountsListProps> = ({
  className,
  selectedAccounts,
  setSelectedAccounts,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("")

  const filteredAccounts = selectedAccounts.filter((account) =>
    account.name?.toLowerCase().includes(searchKeyword.toLowerCase()),
  )

  const selectedAccountsGroupByPlatform = filteredAccounts.reduce(
    (acc, curr) => {
      acc[curr.sourceKind] = (acc[curr.sourceKind] || []).concat(curr)
      return acc
    },
    {} as Record<string, ChannelWithIsSub[]>,
  )

  return (
    <div className={className}>
      <Card className="flex-1 rounded-md">
        <CardHeader className="sticky top-0 z-10 flex h-12 flex-row items-center justify-between space-y-0 border-b bg-primary-foreground px-4 py-0">
          <h2 className="text-sm font-medium">
            已选择的账号({selectedAccounts.length})
            <span className="text-xs text-muted-foreground">
              {searchKeyword && ` • 搜索结果(${filteredAccounts.length})`}
            </span>
          </h2>
          {!!selectedAccounts.length && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setSelectedAccounts([])}
            >
              <X className="size-3" />
              清空
            </Button>
          )}
        </CardHeader>

        <div className="p-2">
          <SearchAccountInput
            className=""
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            placeholder="搜索已选择的账号..."
          />
        </div>

        <CardContent className="p-2 pt-0">
          {selectedAccounts.length === 0 ? (
            <p className="flex h-[calc(100vh-250px)] flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="font-sans">暂无已选择账号</span>
            </p>
          ) : filteredAccounts.length === 0 ? (
            <p className="flex h-[calc(100vh-250px)] flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="font-sans">未找到匹配的账号</span>
            </p>
          ) : (
            <div className="h-[calc(100vh-250px)] space-y-5 overflow-y-auto">
              {Object.entries(selectedAccountsGroupByPlatform).map(
                ([platform, accounts]) => (
                  <Card key={platform}>
                    <CardHeader className="sticky top-0 z-10 mb-2 flex items-center justify-between gap-2 rounded-t-md bg-card p-2 text-base font-semibold shadow-sm">
                      <span className="flex items-center gap-2">
                        {PLATFORM_INFO[platform]?.icon}
                        {PLATFORM_INFO[platform]?.name || platform}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => {
                          setSelectedAccounts(
                            selectedAccounts.filter(
                              (a) => a.sourceKind !== platform,
                            ),
                          )
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </CardHeader>

                    <CardContent>
                      <ul>
                        {accounts.map((account) => (
                          <li
                            key={`${account.id}-${account.isPersonal}`}
                            className="flex cursor-pointer items-center"
                          >
                            <Avatar className="mr-2 inline size-8 rounded-full">
                              <AvatarImage
                                className="object-cover"
                                src={account.avatar!}
                                alt={account.name}
                              />
                              <AvatarFallback className="skeleton size-full">
                                {account.name?.charAt(0).toUpperCase() ?? ""}
                              </AvatarFallback>
                            </Avatar>

                            <span className="line-clamp-1 grow">
                              {account.name}
                            </span>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => {
                                setSelectedAccounts(
                                  selectedAccounts.filter(
                                    (a) =>
                                      !(
                                        a.id === account.id &&
                                        a.isPersonal === account.isPersonal
                                      ),
                                  ),
                                )
                              }}
                            >
                              <X className="size-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
