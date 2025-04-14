import { Users } from "lucide-react"
import { VariantProps } from "class-variance-authority"

import { Button, buttonVariants } from "../../common/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../common/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "../../common/ui/avatar"
import { Card } from "../../common/ui/card"
import { showInfoToast } from "../../common/ui/toast"
import { Badge } from "../../common/ui/badge"

import { Account } from "@/types/plan"
import { cn } from "@/lib/utils"

interface CheckAccountSheetProps {
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  className?: string
  planName: string
  planDescription: string
  accounts: Account[]
}

/**
 * @description 这是一个用于快速查看当前 meme 订阅的账户并进行管理的 sheet 组件，类似于关注列表
 */
export function CheckAccountSheet({
  className,
  planName,
  planDescription,
  accounts,
  variant = "default",
  size = "default",
}: CheckAccountSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("justify-start gap-2", className)}
        >
          <Users className="size-3.5" />
          查看信息源
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-start">{planName}</SheetTitle>
          <SheetDescription className="text-start">
            {planDescription}
          </SheetDescription>

          {accounts?.map((account) => (
            <AccountItem key={account.id} {...account} />
          ))}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

function AccountItem({
  name,
  avatar,
  description,
  sourceKind,
  sourceLevel,
}: Account) {
  return (
    <Card className="cursor-pointer p-4">
      <section className="flex flex-col items-start gap-4 text-start">
        <div>
          <div>
            <h2 className="line-clamp-1 inline font-semibold">{name}</h2>
            <Badge variant="outline" className="ml-2">
              {sourceKind}
            </Badge>
          </div>

          <p className="line-clamp-3 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-4">
          <Avatar className="size-12">
            <AvatarImage className="object-cover" alt={name} src={avatar!} />
            <AvatarFallback className="skeleton size-full">
              {name?.charAt(0).toUpperCase() ?? ""}
            </AvatarFallback>
          </Avatar>
          {sourceLevel === "T0" && <span>123</span>}

          <Button variant="destructive" onClick={() => showInfoToast("开发中")}>
            UnFollow
          </Button>
        </div>
      </section>
    </Card>
  )
}
