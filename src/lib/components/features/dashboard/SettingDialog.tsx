"use client"

import { useState, useEffect, useRef } from "react"
import { Settings } from "lucide-react"

import { Button } from "../../common/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/common/ui/dialog"

export function SettingDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [boxWidth, setBoxWidth] = useState("w-0")
  const [hideBorder, setHideBorder] = useState(true)
  const boxRef = useRef<HTMLDivElement>(null)

  const handleOpen = () => {
    setIsOpen(true)
    setBoxWidth("w-44")
    setHideBorder(false)
  }
  const handleClose = () => setIsOpen(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setBoxWidth("w-0")
        setHideBorder(true)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <Button className="w-full" onClick={handleOpen}>
        <Settings className="mr-2 size-4" />
        设置
      </Button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="flex min-h-[36rem] flex-col rounded-2xl bg-[#f8f8f8] p-0 md:flex-row lg:min-w-[52rem]">
            <div className="hidden basis-1/3 rounded-2xl p-2 md:block">
              <h1 className="p-2 text-2xl font-bold">设置</h1>

              <div className="flex w-full flex-col text-sm">
                <Button variant="secondary" className="">
                  个人信息
                </Button>
                <Button variant="ghost" className="">
                  账户信息
                </Button>
                <Button variant="ghost" className="w-full">
                  设置
                </Button>
              </div>
            </div>

            <div className="flex w-full items-center rounded-t-2xl md:hidden">
              <Button variant="ghost" onClick={handleOpen}>
                展开菜单
              </Button>
            </div>
            <div className="flex grow flex-col rounded-xl bg-white">
              <DialogHeader className="rounded-xl border-t p-4">
                <DialogTitle>设置</DialogTitle>
              </DialogHeader>

              <div className="p-4"></div>
            </div>

            <div
              ref={boxRef}
              className={`absolute bottom-0 left-0 top-0 ${boxWidth} ${hideBorder ? "border-none" : "border-r"} rounded-2xl bg-[#f8f8f8]`}
            ></div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
