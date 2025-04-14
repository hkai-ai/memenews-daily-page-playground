import { Link } from "next-view-transitions"

import { Logo } from "../logo"
import { Badge } from "../ui/badge"

import { cn } from "@/lib/utils"

export function LogoTitle({
  className,
  src = "/",
  hideBetaBadge = false,
}: {
  className?: string
  src?: string
  hideBetaBadge?: boolean
}) {
  return (
    <Link
      href={src}
      className={cn("flex w-fit cursor-pointer items-center gap-2", className)}
    >
      {/* <Logo /> */}
      <h1 className="font-semibold">MemeNews</h1>
      {!hideBetaBadge && <Badge variant="secondary">Beta</Badge>}
    </Link>
  )
}
