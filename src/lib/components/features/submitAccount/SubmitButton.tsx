import { Loader2 } from "lucide-react"

import { Button } from "../../common/ui/button"

interface SubmitButtonProps {
  loading: boolean
  disabled?: boolean
  isExisted: boolean
  existedName?: string
  onClick?: () => void
}

export function SubmitButton({
  loading,
  disabled,
  isExisted,
  existedName,
  onClick,
}: SubmitButtonProps) {
  return (
    <Button
      disabled={disabled}
      type="submit"
      variant={isExisted ? "destructive" : "default"}
      className="line-clamp-1 flex w-full justify-center text-sm"
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center gap-1">
          <Loader2 className="size-3.5 animate-spin" />
          提交中...
        </div>
      ) : isExisted ? (
        `(${existedName}),该信息源已存在`
      ) : (
        <>{isExisted ? "已存在该信息源" : "提交"}</>
      )}
    </Button>
  )
}
