import { cn } from "@/lib/utils"
import { VerificationLevel } from "@/types/plan/model"

interface VerificationBadgeProps {
  level: VerificationLevel
  className?: string
}

export function VerificationBadge({
  level,
  className,
}: VerificationBadgeProps) {
  if (level === VerificationLevel.None) return null

  return (
    <span
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-full text-[8px] font-bold text-white",
        {
          "bg-red-500": level === VerificationLevel.Personal,
          "bg-[#02A4FF]": [
            VerificationLevel.Company,
            VerificationLevel.Government,
            VerificationLevel.Media,
          ].includes(level),
        },
        className,
      )}
    >
      V
    </span>
  )
}
