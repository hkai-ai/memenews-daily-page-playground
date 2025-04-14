"use client"

/**
 * AI 懂王（即将推出）🥽
 * 因为是Demo特性所以取名为DemoFeature
 * @bb 主要是AI懂王我真不知道取什么合适
 */
import { motion } from "framer-motion"
import { Newspaper } from "lucide-react"

import { LampContainer } from "@/lib/components/common/ui/lamp"

const DEMO = {
  title: "AI 懂王（即将推出）🥽",
  content: [
    {
      subTitle: "事实验证：精准核查信息真实性",
      describe:
        "提供事实验证功能，帮助用户精准核查信息的真实性。通过多维度的数据分析和验证，确保用户获取到的都是可靠的信息。",
    },
    {
      subTitle: "拓展搜索：了解专家们对该信息的看法",
      describe:
        "通过拓展搜索功能，用户可以了解专家们对某条信息的看法。AI 懂王将汇集各领域专家的观点和分析，帮助用户更全面地理解信息。",
    },
    {
      subTitle: "知识检索：重现唯物世界的时间线",
      describe:
        "知识检索功能将帮助用户重现唯物世界的时间线。通过对历史事件和数据的检索，用户可以更好地理解事件的背景和发展脉络。",
    },
  ],
}

export function DemoFeature() {
  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="space-y-20"
      >
        <h1 className="bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent md:my-0 md:from-slate-300 md:to-slate-500 md:text-7xl">
          {DEMO.title}
        </h1>

        <div className="-mb-52 flex flex-wrap md:-mb-10">
          {DEMO.content.map((content, index) => (
            <div
              key={index}
              className="mb-6 flex cursor-pointer flex-col p-10 transition-transform duration-200 hover:scale-110 md:mb-0 md:w-1/3"
            >
              <div className="pattern-dots-md gray-light">
                <div className="-translate-y-6 translate-x-6 rounded bg-gray-800 p-4 md:min-h-72">
                  <div className="mb-5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 p-2 text-green-500">
                    <Newspaper className="size-6" />
                  </div>
                  <div className="grow">
                    <h2 className="title-font mb-3 text-xl font-medium">
                      {content.subTitle}
                    </h2>
                    <p className="text-justify text-sm leading-relaxed text-primary-foreground/60 dark:text-primary/60">
                      {content.describe}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </LampContainer>
  )
}
