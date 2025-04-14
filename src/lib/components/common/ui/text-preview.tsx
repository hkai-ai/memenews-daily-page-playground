"use client"

import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

type TextPreviewProps = {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
}

export const TextPreview = ({
  children,
  content,
  className,
}: TextPreviewProps) => {
  const [isOpen, setOpen] = React.useState(false)

  return (
    <>
      <HoverCardPrimitive.Root
        openDelay={50}
        closeDelay={100}
        onOpenChange={(open) => {
          setOpen(open)
        }}
      >
        <HoverCardPrimitive.Trigger className={cn("cursor-pointer", className)}>
          {children}
        </HoverCardPrimitive.Trigger>

        <HoverCardPrimitive.Content
          className="z-[999] rounded-md bg-white p-2 text-base shadow-xl dark:bg-gray-800"
          side="top"
          align="center"
          sideOffset={10}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
              >
                <div>{content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Root>
    </>
  )
}
