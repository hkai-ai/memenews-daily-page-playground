import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

export interface HintProps {
  label: string
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
}

export function Hint({
  label,
  children,
  side,
  align,
  sideOffset,
  alignOffset,
}: HintProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="bg-background shadow-md"
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          <p className="text-sm capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
