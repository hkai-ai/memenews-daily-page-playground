"use client"

import { match } from "ts-pattern"
import {
  type ColumnDef,
  flexRender,
  useReactTable,
} from "@tanstack/react-table"
import { getCoreRowModel } from "@tanstack/table-core"
import { Trash, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRequest } from "ahooks"

import { Button } from "../../common/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../common/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../common/ui/table"
import { Checkbox } from "../../common/ui/checkbox"
import { Badge } from "../../common/ui/badge"
import { Separator } from "../../common/ui/separator"

import { WechatServiceCard } from "./WechatServiceCard"
import { AddChannelDialog } from "./AddChannelDialog"

import { Channel, ChannelName } from "@/types/channel/model"
import { CHANNEL_OPTIONS } from "@/lib/constants/channel"
import { isEmpty } from "@/utils/isEmpty"
import { cn } from "@/lib/utils"
import { getChannelsAction } from "@/lib/api/channel"

interface ChannelWithDefault extends Channel {
  isDefault: boolean
}

interface ChannelTableViewProps {
  channels: ChannelWithDefault[]
  onDeleteChannel: (
    channels: Pick<Channel, "name" | "address" | "secret">[],
  ) => void
  onEmailVerify: (email: string) => void
  userId: string
}

function SecretCell({ value }: { value: string }) {
  const [showSecret, setShowSecret] = useState(false)

  if (!value) return "-"

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        onClick={() => setShowSecret(!showSecret)}
      >
        {showSecret ? (
          <EyeOff className="size-3" />
        ) : (
          <Eye className="size-3" />
        )}
      </Button>
      <span className={cn("truncate leading-none", !showSecret && "mt-2")}>
        {showSecret ? value : "******"}
      </span>
    </div>
  )
}

export function ChannelTableView({
  channels,
  onDeleteChannel,
  onEmailVerify,
  userId,
}: ChannelTableViewProps) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  const [theChannels, setTheChannels] = useState<ChannelWithDefault[]>(channels)

  const { run: getChannels, loading: loadingGetChannels } = useRequest(
    () => getChannelsAction({ userId }),
    {
      ready: !!userId,
      onSuccess: (data) => {
        setTheChannels(
          data.data[0].channel.map((channel, index) => ({
            ...channel,
            isDefault: index === 0,
          })).filter((channel) => channel.name != ChannelName.wechat),
        )
      },
    },
  )

  const columns: ColumnDef<ChannelWithDefault>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "类型",
      cell: ({ row }) => {
        const name = row.getValue("name")
        const channel = CHANNEL_OPTIONS.find((option) => option.name === name)
        if (!channel) return name

        return (
          <div className="flex items-center">
            <channel.icon className="size-5" />
            <span className="ml-2">{channel.label}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "address",
      header: "地址",
      cell: ({ row }) => {
        const address = row.getValue("address") as string
        const name = row.getValue("name") as string

        if (name === "wxBot" && isEmpty(address)) {
          return <span className="text-muted-foreground">未激活</span>
        }

        return (
          <span className="line-clamp-1 max-w-60 text-muted-foreground">
            {address}
          </span>
        )
      },
    },
    {
      accessorKey: "secret",
      header: "密钥",
      cell: ({ row }) => {
        const secret = row.getValue("secret") as string
        return (
          <div className="min-w-[80px]">
            <SecretCell value={secret} />
          </div>
        )
      },
    },
    {
      id: "isDefault",
      header: "状态",
      cell: ({ row }) => {
        const channel = row.original
        return match(channel.name)
          .with(ChannelName.邮箱, () => {
            return channel.isValidated ? (
              <Badge
                className="cursor-pointer bg-green-600 text-xs font-normal text-white hover:bg-green-700"
                title="🎉您已验证该邮箱"
              >
                已验证
              </Badge>
            ) : (
              <Badge
                className="cursor-pointer bg-red-600 text-xs font-normal text-white hover:bg-red-700"
                title="点击验证该邮箱"
                onClick={() => onEmailVerify(channel.address)}
              >
                未验证
              </Badge>
            )
          })
          .with(ChannelName.email, () => {
            return channel.isValidated ? (
              <Badge
                className="cursor-pointer bg-green-600 text-xs font-normal text-white hover:bg-green-700"
                title="🎉您已验证该邮箱"
              >
                已验证
              </Badge>
            ) : (
              <Badge
                className="cursor-pointer bg-red-600 text-xs font-normal text-white hover:bg-red-700"
                title="点击验证该邮箱"
                onClick={() => onEmailVerify(channel.address)}
              >
                未验证
              </Badge>
            )
          })
          .with(ChannelName.wxBot, () => {
            return channel.address != null ? (
              <Badge
                className="bg-green-600 text-xs font-normal text-white"
                title="🎉您已激活该渠道"
              >
                已激活
              </Badge>
            ) : (
              <Badge
                className="cursor-pointer bg-red-600 text-xs font-normal text-white"
                title="您未激活该渠道，点击查看激活教程"
                onClick={() =>
                  window.open(
                    "https://m0e8x072xo3.feishu.cn/docx/BwZ5dQFWFocvrOxz59Xc8uL4n1c",
                    "_blank",
                  )
                }
              >
                未激活
              </Badge>
            )
          })
          .otherwise(() => (
            <Button
              variant="outline"
              size="xs"
              onClick={() => { }}
              className="rounded-full px-2 text-xs"
            >
              -
            </Button>
          ))
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="size-8" size="icon">
              <Trash className="size-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                确认删除推送渠道 {row.original.address}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                此操作不能撤消。这将永久地删除该推送渠道。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  onDeleteChannel([
                    {
                      name: row.original.name,
                      address: row.original.address,
                      secret: row.original.secret,
                    },
                  ])
                }
              >
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ]

  const table = useReactTable({
    data: theChannels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
  })

  return (
    <div className="space-y-8">
      <div>
        <section className="space-y-4">
          <Separator />
          <h2 className="text-2xl font-semibold">微信服务号</h2>
          <p className="text-sm text-muted-foreground">
            😺关注我们的微信服务号，您可以通过服务号的消息提醒接受通知。
          </p>
          <div className="flex w-full items-center justify-center">
            <WechatServiceCard userId={userId} />
          </div>
        </section>
        <section className="space-y-4">
          <Separator />
          <h2 className="text-2xl font-semibold">更多渠道</h2>
          <p className="text-sm text-muted-foreground">
            您可以添加其他渠道来接收通知。该页面配置的UI我们还在优化中，如果有什么建议可以向我们反馈。
          </p>
        </section>
        <div className="flex justify-end">
          <AddChannelDialog
            channels={theChannels}
            className="ml-auto"
            variant="outline"
            onSuccessCallback={getChannels}
          />
        </div>
        <div className="mt-3 overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn({
                        "max-w-[50px]": header.id === "select",
                        "max-w-[120px]": header.id === "name",
                        "max-w-[200px]": header.column.id === "address",
                        "max-w-[150px]": header.column.id === "secret",
                        "max-w-[100px]": header.id === "isDefault",
                        "max-w-[80px]": header.id === "actions",
                      })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn({
                          "max-w-[50px]": cell.column.id === "select",
                          "max-w-[120px]": cell.column.id === "name",
                          "max-w-[200px]": cell.column.id === "address",
                          "max-w-[150px]": cell.column.id === "secret",
                          "max-w-[100px]": cell.column.id === "isDefault",
                          "w-[80px]": cell.column.id === "actions",
                        })}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    暂无渠道
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              已选择 {table.getFilteredSelectedRowModel().rows.length} 个渠道
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="h-8 gap-2 text-xs">
                  <Trash className="inline size-3" />
                  批量删除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除这些推送渠道?</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作不能撤消。这将永久地删除选中的推送渠道。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const selectedRows = table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original)

                      onDeleteChannel(selectedRows)
                      setRowSelection({})
                    }}
                  >
                    确认删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  )
}
