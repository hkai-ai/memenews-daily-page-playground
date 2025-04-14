"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Send } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRequest } from "ahooks"
import Link from "next/link"

import { SidebarMenuButton } from "../../common/ui/sidebar"
import { showErrorToast, showSuccessToast } from "../../common/ui/toast"
import { HintTip } from "../../common/ui/hint-tip"

import { createDoubleByteString } from "@/utils/zod-helpers"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/common/ui/dialog"
import { Button } from "@/lib/components/common/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/common/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/common/ui/select"
import { Textarea } from "@/lib/components/common/ui/textarea"
import { Input } from "@/lib/components/common/ui/input"

const formSchema = z.object({
  category: z.string(),
  description: createDoubleByteString({
    max: 500,
    min: 1,
    maxMessage: "描述不能超过500字",
    minMessage: "请描述您的问题",
  }),
  email: z.string().email("请输入有效的邮箱地址"),
  // files: z.array(z.instanceof(File)),
})

/**
 * @deprecated
 */
async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/feishu/material/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("文件上传失败")
  }

  return await response.json()
}

/**
 * @deprecated
 */
export function FeedbackFormDialog() {
  const { data: session } = useSession()
  const [currentCharCount, setCurrentCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const createFeedback = async (data: {
    问题类型: string
    内容: string
    提交人邮箱: string
  }) => {
    const response = await fetch("/api/feishu/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error)
    }

    return await response.json()
  }

  const { loading: loadingCreateFeedback, run: createFeedbackRequest } =
    useRequest(createFeedback, {
      manual: true,
      ready: !!session?.user?.id,
      onSuccess(res) {
        if (res.code !== 0) {
          showErrorToast(`提交失败: ${res.msg}`)
          return
        }

        showSuccessToast("提交成功")
      },
      onError(error: any) {
        showErrorToast(`提交失败: ${error.msg}`)
      },
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      email: session?.user?.email || "",
    },
  })

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "category") {
        const category = value.category
        if (category === "提个Bug") {
          const template = `设备:
系统版本:
浏览器:
浏览器版本:

问题描述：
`
          form.setValue("description", template)
          setCurrentCharCount(template.length)
        } else {
          form.setValue("description", "")
          setCurrentCharCount(0)
        }
        setTimeout(() => {
          textareaRef.current?.focus()
        }, 0)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createFeedbackRequest({
      问题类型: values.category,
      内容: values.description,
      提交人邮箱: values.email,
    })
  }

  useEffect(() => {
    if (session?.user?.email) {
      form.setValue("email", session.user.email)
    }
  }, [session?.user?.email])

  return (
    <Dialog>
      <HintTip label="提出您宝贵的建议，帮助我们改进产品" asChild>
        <DialogTrigger asChild>
          <SidebarMenuButton>
            <Send />
            <span>给我们反馈</span>
          </SidebarMenuButton>
        </DialogTrigger>
      </HintTip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>给我们反馈</DialogTitle>
          <DialogDescription>
            您可以在这里给我们反馈您遇到的问题
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>你在哪个页面遇到了问题</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="您遇到了什么问题" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="账号相关">账号相关</SelectItem>
                      <SelectItem value="内容相关">内容相关</SelectItem>
                      <SelectItem value="推送相关">推送相关</SelectItem>
                      <SelectItem value="体验相关">体验相关</SelectItem>
                      <SelectItem value="提个Bug">提个Bug</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述你的问题</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Textarea
                        {...field}
                        ref={textareaRef}
                        id="textarea-16"
                        className="min-h-48 resize-none text-xs placeholder:text-xs"
                        maxLength={500}
                        onChange={(e) => {
                          field.onChange(e)
                          setCurrentCharCount(e.target.value.length)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault()
                            const start = e.currentTarget.selectionStart
                            const end = e.currentTarget.selectionEnd
                            const value = e.currentTarget.value

                            // 插入两个空格作为缩进
                            const newValue =
                              value.substring(0, start) +
                              "  " +
                              value.substring(end)

                            // 更新表单值
                            field.onChange(newValue)

                            // 设置光标位置
                            requestAnimationFrame(() => {
                              e.currentTarget.selectionStart =
                                e.currentTarget.selectionEnd = start + 4
                            })
                          }
                        }}
                        aria-describedby="characters-left-textarea"
                      />

                      <p
                        id="characters-left-textarea"
                        className="mt-2 text-right text-xs text-muted-foreground"
                        role="status"
                        aria-live="polite"
                      >
                        <span className="tabular-nums">
                          {currentCharCount}/500
                        </span>
                      </p>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>上传截图</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={(newFiles) => {
                        if (newFiles) {
                          handleFileUpload(Array.from(newFiles))
                        }
                      }}
                      dropzoneOptions={{
                        maxFiles: 5,
                        maxSize: 1024 * 1024 * 4,
                        multiple: true,
                        accept: {
                          "image/*": [".png", ".jpg", ".jpeg", ".gif"],
                        },
                      }}
                      className="relative rounded-lg bg-background p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-dashed outline-1 outline-slate-500"
                      >
                        <div className="flex w-full flex-col items-center justify-center p-8">
                          {isUploading ? (
                            <div className="flex items-center space-x-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-500"></div>
                              <span className="text-sm text-gray-500">
                                上传中...
                              </span>
                            </div>
                          ) : (
                            <>
                              <CloudUpload className="h-10 w-10 text-gray-500" />
                              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  点击上传或拖拽上传
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG 或 GIF (最大 4MB)
                              </p>
                            </>
                          )}
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>您的邮箱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-xs placeholder:text-xs"
                      placeholder="example@example.com"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            disabled={loadingCreateFeedback}
            onClick={() => {
              form.handleSubmit(onSubmit)()
            }}
          >
            {loadingCreateFeedback ? "提交中..." : "提交"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function FeedbackDialog() {
  return (
    <Link
      target="_blank"
      href="https://m0e8x072xo3.feishu.cn/share/base/form/shrcn8CItXLpxpUX7zcvQJPjoXy"
    >
      <SidebarMenuButton variant="outline">
        <Send className="size-3.5" />
        给我们反馈
      </SidebarMenuButton>
    </Link>
  )
}
