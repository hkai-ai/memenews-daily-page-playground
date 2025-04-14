import { Avatar, AvatarFallback, AvatarImage } from "../../common/ui/avatar"
import { VerificationBadge } from "../../common/ui/verification-badge"

import { cn } from "@/lib/utils"
import { VerificationLevel } from "@/types/plan"

interface VerifiedAvatarProps {
  src?: string
  size?: "sm" | "md" | "lg"
  userName?: string
  verificationLevel?: VerificationLevel
  className?: string
}

const avatarVariant = {
  sm: "~size-4/6",
  md: "~size-7/8",
  lg: "~size-9/10",
}

const badgeVariant = {
  sm: "absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 ~size-2/3",
  md: "absolute -bottom-1 -right-1 ~size-2.5/3.5",
  lg: "absolute -bottom-1 -right-1 ~size-3/4",
}

export const VerifiedAvatar = ({
  src,
  size = "md",
  userName,
  verificationLevel,
  className,
}: VerifiedAvatarProps) => {
  return (
    <div className={cn("relative", className)}>
      <Avatar className={avatarVariant[size]}>
        <AvatarImage
          className="object-cover"
          src={src}
          alt={`${userName}'s avatar`}
        />
        <AvatarFallback className="line-clamp-1 flex size-full items-center justify-center">
          {userName?.charAt(0).toUpperCase() ?? ""}
        </AvatarFallback>
      </Avatar>
      {verificationLevel && (
        <VerificationBadge
          level={verificationLevel}
          className={badgeVariant[size]}
        />
      )}
    </div>
  )
}
