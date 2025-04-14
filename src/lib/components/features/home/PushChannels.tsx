"use client"

import React, { useEffect, useState } from "react"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/lib/components/common/ui/carousel"
import { Icons } from "@/lib/components/common/icon"

const IconWrapper = ({
  Icon,
  fillColor,
  name,
}: {
  Icon: React.ElementType
  fillColor: string
  name: string
}) => (
  <div className="flex flex-col items-center">
    <Icon className={`h-10 w-10 text-primary ${fillColor}`} />
    <span className="mt-2 text-sm">{name}</span>
  </div>
)

const iconComponents = [
  { Icon: Icons.email, fillColor: "fill-blue-500", name: "邮箱" },
  { Icon: Icons.wechat, fillColor: "fill-green-500", name: "微信群" },
  { Icon: Icons.dingding, fillColor: "fill-blue-700", name: "钉钉" },
  { Icon: Icons.feishu, fillColor: "fill-blue-300", name: "飞书" },
  { Icon: Icons.email, fillColor: "fill-blue-500", name: "邮箱" },
  { Icon: Icons.wechat, fillColor: "fill-green-500", name: "微信群" },
  { Icon: Icons.dingding, fillColor: "fill-blue-700", name: "钉钉" },
]

export const PushChannels = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0)
        api.scrollTo(0)
      } else {
        api.scrollNext()
        setCurrent(current + 1)
      }
    }, 1000)
  }, [api, current])

  return (
    <div className="grid grid-cols-5 items-center gap-10">
      <h3 className="font-regular text-left text-xl tracking-tighter lg:max-w-xl">
        支持的推送渠道
      </h3>
      <div className="relative col-span-4 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-full bg-gradient-to-r from-background via-white/0 to-background"></div>
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {iconComponents.map((IconComponent, index) => (
              <CarouselItem className="basis-1/4 lg:basis-1/6" key={index}>
                <div className="flex aspect-square items-center justify-center rounded-md bg-muted p-2">
                  <IconWrapper
                    Icon={IconComponent.Icon}
                    fillColor={IconComponent.fillColor}
                    name={IconComponent.name}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
