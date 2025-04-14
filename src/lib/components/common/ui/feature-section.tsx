import {
  Cookie,
  Apple,
  Banana,
  Grape,
  Candy,
  Carrot,
  Pizza,
  Nut,
} from "lucide-react"

import { cn } from "@/lib/utils"

export default function FeaturesSection() {
  const features = [
    {
      title: "信息聚合，打破茧房",
      description: "打破信息茧房，获取多元化资讯。",
      icon: <Nut />,
    },
    {
      title: "了解行业专家都在看的内容",
      description: "了解行业专家关注的内容。",
      icon: <Pizza />,
    },
    {
      title: "对于发布者",
      description: "分享优质博主清单，提升影响力。",
      icon: <Banana />,
    },
    {
      title: "对于普通人",
      description: "与其花费时间鉴别信息，不如相信推荐信息的人。",
      icon: <Grape />,
    },
    {
      title: "生成式AI，更专业、更有趣",
      description: "智能推荐，提升用户体验。",
      icon: <Candy />,
    },
    {
      title: "千人千面，个性化推送",
      description: "量身定制内容，满足独特需求。",
      icon: <Apple />,
    },
    {
      title: "多端推送",
      description: "微信、邮箱、钉钉...",
      icon: <Carrot />,
    },
  ]

  return (
    <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  )
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}) => {
  return (
    <section
      id="feature"
      className={cn(
        "group/feature relative flex flex-col py-10 dark:border-neutral-800 lg:border-r",
        (index === 0 || index === 4) && "dark:border-neutral-800 lg:border-l",
        index < 4 && "dark:border-neutral-800 lg:border-b",
      )}
    >
      {index < 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      )}
      {index >= 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      )}
      <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700" />
        <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </section>
  )
}
