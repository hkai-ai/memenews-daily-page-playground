import { useSession } from "next-auth/react"
import { useRequest } from "ahooks"
import { HeartIcon } from "lucide-react"

import { showInfoToast } from "../../common/ui/toast"
import { Button, ButtonProps } from "../../common/ui/button"

import { addPlanFavoriteAction } from "@/lib/api/plan/add-plan-favorite"
import { deletePlanFavoriteAction } from "@/lib/api/plan/delete-plan-favorite"
import { cn } from "@/lib/utils"

export function FavoriteButton({
  className,
  size = "default",
  planId,
  isFavorite,
  onFavoriteSuccessCallback,
}: {
  className?: string
  size?: ButtonProps["size"]
  planId: string
  isFavorite: boolean
  onFavoriteSuccessCallback: (planId: string, isFavorite: boolean) => void
}) {
  const { data: session } = useSession()
  const userId = session?.user?.id || ""

  const { loading: loadingAddPlanFavorite, run: addPlanFavorite } = useRequest(
    () =>
      addPlanFavoriteAction({
        userId,
        planId: planId || "",
      }),
    {
      manual: true,
      ready: !!userId,
      onSuccess() {
        showInfoToast("收藏成功")
        onFavoriteSuccessCallback?.(planId || "", true)
      },
    },
  )

  const { loading: loadingDeletePlanFavorite, run: deletePlanFavorite } =
    useRequest(
      () =>
        deletePlanFavoriteAction({
          userId,
          planId: planId || "",
        }),
      {
        manual: true,
        ready: !!userId,
        onSuccess() {
          showInfoToast("取消收藏成功")
          onFavoriteSuccessCallback?.(planId || "", false)
        },
      },
    )

  const handleToggleFavorite = () => {
    if (isFavorite) {
      deletePlanFavorite()
    } else {
      addPlanFavorite()
    }
  }

  return (
    <Button
      size={size}
      variant="ghost"
      className={cn("justify-start gap-2", className)}
      onClick={handleToggleFavorite}
      disabled={loadingAddPlanFavorite || loadingDeletePlanFavorite}
    >
      <HeartIcon
        className={cn(
          "size-4",
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-500",
        )}
      />
      {isFavorite ? "取消收藏" : "收藏"}
    </Button>
  )
}
