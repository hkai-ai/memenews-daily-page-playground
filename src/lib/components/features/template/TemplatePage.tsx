import Image from "next/image"
import { useRequest } from "ahooks"
import { useSession } from "next-auth/react"
import { match } from "ts-pattern"

import { Button } from "../../common/ui/button"
import { PreviewDialog } from "../../common/ui/preview-dialog"
import { ScrollArea, ScrollBar } from "../../common/ui/scroll-area"
import { LoadingCat } from "../../common/ui/loading-cat"
import { IllustrationNoContent } from "../../common/illustrations"
import { Dialog, DialogContent, DialogTrigger } from "../../common/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../common/ui/card"
import { CreateMyPlanButton } from "../plan"
import { showInfoToast } from "../../common/ui/toast"
import { HintTip } from "../../common/ui/hint-tip"

import { cn } from "@/lib/utils"
import { getSubscribedPlansAction } from "@/lib/api/plan"
import { TemplateImages } from "@/lib/constants/template"

export function TemplatePage() {
  const { data: session } = useSession()
  const userId = session?.user?.id as string

  const {
    run: getSubscribePlans,
    data: getSubscribePlansQuery,
    loading: loadingGetSubscribedPlans,
  } = useRequest(() => getSubscribedPlansAction({ userId }), {
    ready: !!userId,
  })

  const emptySubscribedPlans = !getSubscribePlansQuery?.data.length

  return (
    <div className="space-y-6 p-4 pt-6">
      <section className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">选择默认模版</h2>

        <ScrollArea className="mx-4 rounded-md border">
          <div className="flex gap-8 p-4">
            {TemplateImages.map((image, index) => (
              <figure
                key={image.id}
                className={cn(
                  "flex h-[34rem] w-64 flex-col gap-2 overflow-hidden",
                  index < TemplateImages.length - 1 && "border-r pr-6",
                )}
              >
                <h3 className="text-sm font-semibold">
                  {index + 1}. {image.title}
                </h3>

                <PreviewDialog
                  trigger={
                    <div className="h-[85%] flex-1">
                      <HintTip label="单击预览大图" key={index}>
                        <>
                          <div className="h-full overflow-y-scroll">
                            <Image
                              src={image.url}
                              alt={`Photo by ${image.title}`}
                              className="w-60 object-cover object-top"
                              width={300}
                              height={400}
                            />
                          </div>
                        </>
                      </HintTip>
                    </div>
                  }
                >
                  <div className="mt-6 h-[90svh] overflow-y-scroll">
                    <Image
                      src={image.url}
                      alt={`Photo by ${image.title}`}
                      className="w-[50rem]"
                      width={300}
                      height={400}
                    />
                  </div>
                </PreviewDialog>

                <Button
                  variant={image.isDefault ? "default" : "secondary"}
                  onClick={() => showInfoToast("开发中")}
                  className={cn(
                    "h-9 w-full text-xs",
                    image.isDefault && "cursor-not-allowed",
                  )}
                >
                  {image.isDefault ? "当前默认模版" : "设为默认"}
                </Button>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">为 meme 选择模版</h2>

        <div>
          {match(loadingGetSubscribedPlans)
            .with(true, () => <LoadingCat />)
            .otherwise(() => (
              <>
                {emptySubscribedPlans ? (
                  <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 py-20">
                    <IllustrationNoContent className="size-40" />
                    <p>您还没有任何 meme，快去创建吧！</p>
                    <CreateMyPlanButton
                      variant="secondary"
                      align="center"
                      className="w-fit"
                    />
                  </div>
                ) : (
                  // <Masonry
                  //   className="mx-4"
                  //   direction="row"
                  //   columnsCountBreakPoints={{
                  //     1920: 5,
                  //     1536: 4,
                  //     1280: 4,
                  //     768: 3,
                  //     0: 2,
                  //   }}
                  // >
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {getSubscribePlansQuery?.data.map((plan) => (
                      <Dialog key={plan.planId}>
                        <DialogTrigger asChild className="text-start">
                          <Card className="w-60 overflow-hidden">
                            <CardHeader className="p-2">
                              <img
                                src={plan.planAvatarUrl || "/placeholder.svg"}
                                alt="Plan cover"
                                className="aspect-video rounded-lg object-cover"
                              />
                            </CardHeader>
                            <CardContent className="p-2">
                              <CardTitle className="text-xs group-hover:line-clamp-none md:text-sm lg:text-base">
                                {plan.planName}
                              </CardTitle>

                              <div className="relative">
                                <CardDescription
                                  className={`mb-2 line-clamp-1 text-[0.5rem] md:text-xs`}
                                >
                                  {plan.planDescription}
                                </CardDescription>
                              </div>
                            </CardContent>
                            <CardFooter className="w-full p-2">
                              <Button
                                variant="outline"
                                className="h-9 w-full text-xs"
                              >
                                选择一个模版
                              </Button>
                            </CardFooter>
                          </Card>
                        </DialogTrigger>

                        <DialogContent className="grid h-[85svh] max-w-5xl grid-cols-3 overflow-y-scroll pt-10">
                          {TemplateImages.map((image) => (
                            <div
                              key={image.id}
                              className="col-span-1 flex flex-col gap-1"
                            >
                              <PreviewDialog
                                trigger={
                                  <div className="flex-1">
                                    <HintTip
                                      label="单击预览大图"
                                      key={image.id}
                                    >
                                      <>
                                        <div className="h-[30rem] overflow-y-scroll">
                                          <Image
                                            src={image.url}
                                            alt={`Photo by ${image.title}`}
                                            className="object-cover object-top"
                                            width={300}
                                            height={400}
                                          />
                                        </div>
                                      </>
                                    </HintTip>
                                  </div>
                                }
                              >
                                <div className="mt-6 h-[90svh] overflow-y-scroll">
                                  <Image
                                    src={image.url}
                                    alt={`Photo by ${image.title}`}
                                    className="w-[50rem]"
                                    width={300}
                                    height={400}
                                  />
                                </div>
                              </PreviewDialog>

                              <Button
                                onClick={() => showInfoToast("开发中")}
                                variant={
                                  image.isDefault ? "default" : "outline"
                                }
                                className="h-8 w-full cursor-pointer select-none text-xs font-normal"
                              >
                                {image.isDefault ? "当前模版" : "选择改模版"}
                              </Button>
                            </div>
                          ))}
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                  // </Masonry>
                )}
              </>
            ))}
        </div>
      </section>

      {/* <section className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">
          选择一份日报查看效果
        </h2>
      </section> */}
    </div>
  )
}
