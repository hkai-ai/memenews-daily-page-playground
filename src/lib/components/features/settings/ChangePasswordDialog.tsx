"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRequest } from "ahooks"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check } from "lucide-react"
import { useSession } from "next-auth/react"

import { LoadingSkeleton } from "../../common/ui/loading-skeleton"

import { changePasswordAction } from "@/lib/api/account/change-password"
import { Button } from "@/lib/components/common/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/common/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/common/ui/form"
import { Input } from "@/lib/components/common/ui/input"
import { showErrorToast } from "@/lib/components/common/ui/toast"
import { encrypt } from "@/lib/crypto/browser"
import { delay } from "@/utils"

const profileFormSchema = z
  .object({
    // password_original: z
    //   .string({
    //     required_error: "请输入原始密码。",
    //   })
    //   .min(8, {
    //     message: "密码至少8个字符。",
    //   })
    //   .max(16, {
    //     message: "密码最多16个字符。",
    //   }),
    password_new: z
      .string({
        required_error: "请输入新密码。",
      })
      .min(8, {
        message: "密码至少8个字符。",
      })
      .max(16, {
        message: "密码最多16个字符。",
      }),
    password_confirm: z
      .string({
        required_error: "请输入确认密码。",
      })
      .min(8, {
        message: "确认密码至少8个字符。",
      })
      .max(16, {
        message: "确认密码最多16个字符。",
      }),
  })
  .refine((data) => data.password_new === data.password_confirm, {
    message: "两次输入的密码不一致。",
    path: ["password_confirm"],
  })

type ProfileFormValues = z.infer<typeof profileFormSchema>

/**
 * 更改密码表单组件
 *
 * @returns 返回一个包含更改密码表单的 React 组件
 */
export function ChangePasswordDialog() {
  const uuid = useSession().data?.user?.id || ""
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  })

  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false)

  const { run: changePassword, loading: loadingChangePassword } = useRequest(
    changePasswordAction,
    {
      manual: true,
      onSuccess: () => {
        setChangePasswordSuccess(true)
      },
      onError: (error: any) => {
        showErrorToast(`更改密码失败：${error.message.statusText}`)
      },
      async onFinally() {
        await delay(1500)
        setIsOpened(false)
        form.reset({
          // password_original: "",
          password_new: "",
          password_confirm: "",
        })
      },
    },
  )

  const onSubmit = async (data: ProfileFormValues) => {
    const encryptedPassword = encrypt(data.password_new)
    const timestamp = new Date().getTime().toString()
    const verifyToken = encrypt(timestamp)

    changePassword({
      userId: uuid,
      password: encryptedPassword,
      timestamp,
      verifyToken,
    })
  }

  return (
    <Dialog
      open={isOpened}
      onOpenChange={(open) => {
        setIsOpened(open)
        setChangePasswordSuccess(false)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 text-xs">
          更改密码
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>更改密码</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* <FormField
              control={form.control}
              name="password_original"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>原密码</FormLabel>
                  <FormControl>
                    <Input
                      id="password_original"
                      type="password"
                      placeholder="请输入原始密码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="password_new"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新密码</FormLabel>
                  <FormControl>
                    <Input
                      id="password_new"
                      type="password"
                      placeholder="请输入新密码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认新密码</FormLabel>
                  <FormControl>
                    <Input
                      id="password_confirm"
                      type="password"
                      placeholder="请确认新密码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                disabled={loadingChangePassword || changePasswordSuccess}
                variant={changePasswordSuccess ? "success" : "default"}
                type="submit"
                className="px-10"
              >
                {changePasswordSuccess ? (
                  <>
                    <Check className="mr-2 size-4" /> 更改成功
                  </>
                ) : loadingChangePassword ? (
                  <LoadingSkeleton>正在更改</LoadingSkeleton>
                ) : (
                  "更改密码"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
