import Link from "next/link"
import Image from "next/image"

import { Icons } from "../../common/icon"

import { cn } from "@/lib/utils"
import { getDailyDetailByIdAction } from "@/lib/api/daily"

interface NewsHeaderProps {
  getDailyDetailQuery: Awaited<ReturnType<typeof getDailyDetailByIdAction>>
  date: string
  planId: string
  onSubscribeSuccessCallback: () => void
}

export const NewsHeader = ({
  getDailyDetailQuery,
  date,
  planId,
  onSubscribeSuccessCallback,
}: NewsHeaderProps) => {
  const isSubscribed = !!getDailyDetailQuery?.data.channel

  return (
    <header
      className={cn(
        "container mt-4 flex flex-col items-start justify-start gap-4 px-4 md:max-w-3xl",
      )}
    >
      <section className="flex flex-col rounded-md bg-white p-6 dark:bg-neutral-900">
        <div className="mb-3 flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl font-bold tracking-tight">
            {getDailyDetailQuery?.data.subscribePlanTitle}
          </h2>

          <span className="text-xs font-medium text-gray-400 dark:text-gray-100">
            MemeNews
          </span>
        </div>

        <div className="flex flex-col items-center gap-5 md:flex-row">
          <Image
            aria-label="封面"
            className="aspect-video h-fit w-full rounded-md object-cover md:w-1/2"
            src={
              getDailyDetailQuery?.data?.introduction?.planAvatar ??
              "https://yuansun-assests.oss-cn-hangzhou.aliyuncs.com/newsdiy/assets/subscribeChannel/templatePlanCover/cat_01.jpg"
            }
            alt={`${getDailyDetailQuery?.data.introduction.title}的封面`}
            width={500}
            height={280}
            priority
          />

          <div className="flex w-full flex-col gap-3 md:w-1/2">
            <b className="flex items-center gap-1.5 text-base">
              <Icons.quote className="size-4 text-gray-600" />
              摘要
            </b>

            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              {getDailyDetailQuery?.data.introduction.content}
            </p>

            <ul className="mt-2 space-y-1">
              {getDailyDetailQuery?.data.introduction.hotSpot.map(
                (item, index) => {
                  let normalArticleCount = -1
                  getDailyDetailQuery.data.introduction.hotSpot
                    .slice(0, index + 1)
                    .forEach((spot) => {
                      if (!spot.isRelated) {
                        normalArticleCount++
                      }
                    })

                  const formattedIndex = item.isRelated
                    ? "related"
                    : String(normalArticleCount + 1)

                  return (
                    <li className="flex items-center gap-1.5" key={index}>
                      <span className="font-medium leading-none text-orange-500">
                        {formattedIndex === "related" ? (
                          <Icons.fire className="size-3.5" />
                        ) : (
                          <span className="ml-0.5 mr-1">{formattedIndex}</span>
                        )}
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-100">
                        {item.briefTopic}
                      </p>
                    </li>
                  )
                },
              )}
            </ul>
          </div>
        </div>
      </section>
    </header>
  )
}
