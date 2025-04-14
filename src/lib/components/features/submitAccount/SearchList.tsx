import { X } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { LoadingSkeleton } from "@/lib/components/common/ui/loading-skeleton"
import { ValidationSourceRes } from "@/types/plan"

interface SearchListProps {
  className?: string
  style?: React.CSSProperties
  placeholder: string
  // focusUidInput: boolean
  // setFocusUidInput: (focusUidInput: boolean) => void
  form: UseFormReturn<any>
  validateResult: ValidationSourceRes
  loading: boolean
  onItemClick: (item: { name: string; identifyId: string }) => void
  onClose: () => void
}

export function SearchList({
  className,
  style,
  placeholder,
  form,
  validateResult,
  loading,
  onItemClick,
  onClose,
}: SearchListProps) {
  const calculateName = (validateResult: ValidationSourceRes, item: typeof validateResult.data.matchedSources[0]) => {
    if (validateResult.data.isExisted) {
      return <span className="text-red-500">{validateResult.data.matchedSources[0].name}（已存在该公开信息源）</span>
    }

    if (item.isPersonal) {
      return `${item.name}（您已添加该信息源）`
    }

    return item.name

  }

  const renderItem = (validateResult: ValidationSourceRes, item: typeof validateResult.data.matchedSources[0]) => {
    if (validateResult.data.isExisted) {
      return <div
        key={item.identifyId}
        className="cursor-pointer space-x-10 border-b p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
        onClick={() => {
          onItemClick(item)
        }}
        title="我们不推荐您重建已存在在公开源里的信息源"
      >
        <span className="text-sm">{item.name}（已存在该公开信息源）</span>
      </div>
    }

    if (item.isPersonal) {
      return <div
        key={item.identifyId}
        className="cursor-not-allowed space-x-10 border-b p-2 bg-gray-200 dark:bg-gray-800"
        title="您无法重复添加相同的私有信息源"
      >
        <span className="text-sm text-red-600">{item.name}（您已添加该信息源）</span>
      </div>
    }

    return <div
      key={item.identifyId}
      className="cursor-pointer space-x-10 border-b p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
      onClick={() => {
        onItemClick(item)
      }}
    >
      <span className="text-sm">{item.name}</span>
    </div>
  }


  return (
    <div
      style={{
        boxShadow: "0 0 2px 2px #e5e5e5",
      }}
      className={cn(
        "absolute left-0 top-10 z-20 min-h-32 max-h-52 w-full rounded-md bg-white dark:bg-gray-950 overflow-y-auto",
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between border-b bg-muted p-3 py-2 pr-1">
          <span className="text-sm">搜索结果：</span>
          <X
            className="size-7 cursor-pointer rounded-sm p-1 outline-1 hover:bg-gray-100 hover:outline"
            onClick={onClose}
          />
        </div>
        {loading ? (
          <div className="flex size-full h-40 items-center justify-center">
            <LoadingSkeleton className="text-xs">验证中...</LoadingSkeleton>
          </div>
        ) : (
          <>
            {!form.watch("id") &&
              !validateResult?.data.matchedSources.length ? (
              <div className="flex size-full h-40 max-h-40 items-center justify-center text-xs dark:text-gray-400">
                {placeholder}
              </div>
            ) : (
              <>
                {(
                  <>
                    {!validateResult?.data.matchedSources.length ? (
                      <div className="flex size-full h-40 items-center justify-center text-xs text-red-500">
                        未找到匹配信息源
                      </div>
                    ) : (
                      validateResult?.data.matchedSources.map((item) => renderItem(validateResult, item))
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
