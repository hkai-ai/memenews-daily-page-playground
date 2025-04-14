"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { HintTip } from "../ui/hint-tip"

import { Tooltip } from "@/lib/components/common/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * Intro Scroll Mouse
 */
export const IntroScrollMouse = ({ className }: { className?: string }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      className={cn("w-fit", className)}
      data-tip
      data-for="scroll-tooltip"
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative grid justify-center rounded-full border-2 border-primary/50 pt-2 ~h-10/12 ~w-6/8 hover:animate-bounce">
        <div className="animate-intro-scroll rounded-full bg-primary/70 ~h-2.5/3 ~w-0.5/1"></div>
      </div>
    </motion.div>
  )
}
