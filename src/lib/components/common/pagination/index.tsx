"use client"

import { type SetState } from "ahooks/lib/useSetState"
import { Ellipsis } from "lucide-react"
import React from "react"

import { Button } from "@/lib/components/common/ui/button"
import { Input } from "@/lib/components/common/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/common/ui/select"

interface PaginationProps {
  total?: number
  params: {
    pageIndex: number
    pageSize: number
  }
  updateParams: SetState<{
    pageIndex: number
    pageSize: number
  }>
  showSizeChanger?: boolean
  showQuickJumper?: boolean
}

/**
 * 分页组件
 */
export const Pagination = ({
  params,
  updateParams,
  total = 0,
  showSizeChanger,
  showQuickJumper,
}: PaginationProps) => {
  const pageCount = Math.ceil(total / params.pageSize)
  const delta = 2
  const pageSizeOptions =
    total > 50 ? [10, 20, 50] : total > 20 ? [10, 20] : [10]

  const [quickJumpPage, setQuickJumpPage] = React.useState("")

  // 从 localStorage 读取缓存的 pageSize
  React.useEffect(() => {
    const cachedPageSize = localStorage.getItem("preferredPageSize")
    if (cachedPageSize && Number(cachedPageSize) !== params.pageSize) {
      const size = Number(cachedPageSize)
      // 确保缓存的值在当前可选范围内
      if (pageSizeOptions.includes(size)) {
        updateParams({
          pageIndex: 1,
          pageSize: size,
        })
      }
    }
  }, [])

  // 当 pageSize 改变时保存到 localStorage
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value)
    localStorage.setItem("preferredPageSize", value)
    updateParams({
      pageIndex: 1,
      pageSize: newSize,
    })
  }

  // 根据给定的页码总数和当前页码，计算出一个分页范围数组。
  const paginationRange = React.useMemo(() => {
    const range = []
    const maxRange = Math.min(pageCount - 1, Number(params.pageIndex) + delta)
    const minRange = Math.max(2, maxRange - 2 * delta)

    // 将范围内的页码添加到数组中
    for (let i = minRange; i <= maxRange; i++) {
      range.push(i)
    }

    // 如果范围之前还有更多的页码，则添加省略号
    if (minRange > 2) {
      range.unshift("...")
    }
    // 如果范围之后还有更多的页码，则添加省略号
    if (maxRange < pageCount - 1) {
      range.push("...")
    }

    // 添加第一个页码
    range.unshift(1)
    // 如果有多于一页的页码，则添加最后一个页码
    if (pageCount !== 1) {
      range.push(pageCount)
    }

    return range
  }, [pageCount, params])

  return (
    <div className="space-x-6 py-4 text-xs md:text-base lg:space-x-8">
      <div className="flex flex-wrap justify-end gap-2 first-line:space-x-2 md:gap-4">
        <div>
          {pageCount > 1 &&
            paginationRange.map((pageNumber, i) =>
              pageNumber === "..." ? (
                <Button key={i} variant="ghost" className="!cursor-not-allowed">
                  <Ellipsis className="size-2" />
                </Button>
              ) : (
                <Button
                  key={i}
                  size="icon"
                  variant={
                    pageNumber === Number(params.pageIndex)
                      ? "outline"
                      : "ghost"
                  }
                  onClick={() => {
                    updateParams({
                      pageIndex: Number(pageNumber),
                    })
                  }}
                >
                  {pageNumber}
                </Button>
              ),
            )}
        </div>

        {showQuickJumper && pageCount > 1 && (
          <div className="mr-3 flex items-center space-x-2">
            跳转至
            <Input
              className="mx-2 w-10"
              value={quickJumpPage}
              onChange={(e) => {
                if (Number(e.target.value?.trim())) {
                  setQuickJumpPage(`${Number(e.target.value?.trim())}`)
                }
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  updateParams({
                    pageIndex: Math.min(Number(quickJumpPage), pageCount),
                  })
                  setQuickJumpPage("")
                }
              }}
            />
            页
          </div>
        )}
        {showSizeChanger && total > 0 && (
          <div className="hidden items-center space-x-2 md:flex">
            <p className="whitespace-nowrap text-sm font-medium">每页条数</p>
            <Select
              value={`${params.pageSize}`}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-10 w-[70px] text-muted-foreground">
                <SelectValue placeholder={params.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}

type PaginationInfoProps = Pick<PaginationProps, "params" | "total">

export const PaginationInfo = ({ params, total = 0 }: PaginationInfoProps) => {
  return (
    <p>
      显示第
      <span className="mx-1 font-semibold">
        {params.pageIndex === 1 ? 1 : (params.pageIndex - 1) * params.pageSize}
      </span>
      条-第
      <span className="mx-1 font-semibold">
        {Math.min(total, params.pageIndex * params.pageSize)}
      </span>
      条，共
      <span className="mx-1 font-semibold">{total}</span>条
    </p>
  )
}
