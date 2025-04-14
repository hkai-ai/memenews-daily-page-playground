"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useRequest } from "ahooks"
import confetti from "canvas-confetti"
import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { showErrorToast, showSuccessToast } from "../../common/ui/toast"
import { DebugDialog } from "../../common/debug/DebugDialog"

import { PlatformSelector } from "./PlatformSelect"
import { UrlInput } from "./UrlInput"
import { AiSuggestionInput } from "./AiSuggestionInput"
import { DomainSelect } from "./DomainSelect"
import { AccountTypeSelect } from "./AccountTypeSelect"
import { PublicSwitch } from "./PublicSwitch"
import { SubmitButton } from "./SubmitButton"
import { CommentField } from "./CommentField"
import { UidInput } from "./UidInput"
import { NameInputField } from "./NameInputField"

import { Form } from "@/lib/components/common/ui/form"
import { validationSourceAction } from "@/lib/api/plan/validation-source"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/lib/components/common/ui/collapsible"
import { API_CONTENT_BASE_URL } from "@/config/api"

const formSchema = z.object({
  name: z.string().min(1, { message: "名称必须至少为1个字符。" }),
  url: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "请输入有效的URL。",
    }),
  id: z.string().optional(),
  introduction: z.string().min(5, { message: "介绍必至少为5个字符。" }),
  platform: z.enum(["wechat", "twitter", "weibo", "rss"], {
    required_error: "请选择一个平台。",
  }),
  account_type: z.enum(["媒体", "机构", "个人", "权威"], {
    required_error: "请选择账号类别。",
  }),
  domain: z.array(z.string()).min(1, { message: "请选择至少一个领域。" }),
  comment: z.string().optional(),
  public: z.boolean().default(true),
})

export function SubmitAccountForm() {
  const { data: session } = useSession()
  const [focusNameInput, setFocusNameInput] = useState(false)
  const [focusUidInput, setFocusUidInput] = useState(false)
  const [validateResult, setValidateResult] =
    useState<Awaited<ReturnType<typeof validationSourceAction>>>()
  const [isExpanded, setIsExpanded] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      id: "",
      introduction: "",
      platform: undefined,
      account_type: undefined,
      domain: [],
      public: false,
    },
  })
  const selectedPlatform = form.watch("platform")

  /**
   * 提交私有信息源的请求
   * @param data 
   * @returns 
   */
  const createRecord = async (data: {
    /**
 * 个性化评论
 */
    sourceComment: string
    /**
     * 是否为私有信息源
     */
    isPrivate: boolean
    platform: 'wechat' | 'twitter' | 'weibo' | 'rss'
    /**
     * 信息源的唯一标识符。
     * 根据信息源渠道的不同，其值意义不同。例如：
     * - wechat: 微信公众号的BookId
     * - twitter: 推特at username
     * - weibo: 微博用户的uid
     * - rss: rss 的 url 内容
     */
    sourceId: string
    description: string
    /**
     * 信息源名称
     */
    sourceName: string
    /**
     * 信息源领域，默认为 all
     */
    sourceDomain: string[]
    /**
     * 信息源所有者类型
     * 类型有：
     * - 个人
     * - 机构
     * - 媒体
     * - 权威
     */
    sourceOwnerTypes: string
    /**
     * 信息源评级，私有信息源默认评级为 T2
     */
    sourceLevel: string
    /**
     * 提交的用户 id
     */
    userId: string

  }) => {
    const response = await fetch(`${API_CONTENT_BASE_URL}/v2/infoSource`, {
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

  const resetForm = () => {
    form.setValue("name", "")
    form.setValue("id", "")
    form.setValue("url", "")
    form.setValue("introduction", "")
    form.setValue("comment", "")
    form.setValue("account_type", "媒体")
    form.setValue("domain", [])
    form.setValue("public", true)

    setAiSuggestion("")
    setValidateResult(undefined)
    setFocusNameInput(false)
    setFocusUidInput(false)
  }

  /**
   * 提交信息源相关钩子
   */
  const { loading: loadingCreateRecord, run: createRecordRequest } = useRequest(
    createRecord,
    {
      manual: true,
      ready: !!session?.user?.id,
      onSuccess(res) {

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        showSuccessToast("提交成功")
        resetForm()
      },
      onError(error: any) {
        showErrorToast(`提交失败: ${error.msg}`)
      },
    },
  )

  // 从url中提取uid
  useEffect(() => {
    const url = form.watch("url")
    if (url) {
      const urlParts = url.split("/")
      const lastSegment = urlParts[urlParts.length - 1]

      if (!isNaN(Number(lastSegment))) {
        form.setValue("id", lastSegment)
      }
    }
  }, [form.watch("url")])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createRecordRequest({
      sourceName: values.name,
      platform: values.platform,
      sourceOwnerTypes: values.account_type,
      description: values.introduction || "",
      sourceId: values.platform === "rss" ? values.url ?? "" : values.id || "",
      sourceDomain: [...values.domain],
      sourceComment: values.comment || "",
      isPrivate: values.public,
      sourceLevel: "T2",
      userId: session?.user?.id || "",
    })
  }

  const { run: validateName, loading: loadingValidateSource } = useRequest(
    validationSourceAction,
    {
      debounceWait: 1000,
      manual: true,
      ready: !!form.watch("name"),
      refreshDeps: [
        selectedPlatform === "wechat" || selectedPlatform === "weibo",
      ],
      onSuccess(data) {
        setValidateResult(data)
      },
      onError(error: any) {
        showErrorToast(
          `😵验证失败: 频率过高，请稍后再试`,
        )
      },
    },
  )

  const { run: validateUid, loading: loadingValidateUid } = useRequest(
    validationSourceAction,
    {
      debounceWait: 1000,
      debounceTrailing: true,
      manual: true,
      ready: !!form.watch("id"),
      refreshDeps: [form.watch("id")],
      onSuccess(data) {
        setValidateResult(data)
      },
      onError(error: any) {
        showErrorToast(
          `😵验证失败: 频率过高，请稍后再试`,
        )
      },
    },
  )

  const { run: validateUrl, loading: loadingValidateUrl } = useRequest(
    validationSourceAction,
    {
      debounceWait: 1000,
      manual: true,
      ready: !!form.watch("url"),
      refreshDeps: [form.watch("url")],
      onSuccess(data) {
        form.setValue("name", data?.data?.matchedSources[0]?.name ?? '')
        setValidateResult(data)
      },
      onError(error: any) {
        showErrorToast(
          `😵验证失败: 频率过高，请稍后再试`,
        )
      },
    }
  )

  // 验证名称
  useEffect(() => {
    if (selectedPlatform === "wechat" || selectedPlatform === "weibo") {
      validateName({
        infoChannel: selectedPlatform,
        content: form.getValues("name"),
        userId: session?.user?.id || "",
      })
      setValidateResult(undefined)
    }
  }, [form.watch("name")])

  // 验证uid
  useEffect(() => {
    if (form.watch("platform") !== "wechat") {
      validateUid({
        infoChannel: form.getValues("platform") as
          | "wechat"
          | "twitter"
          | "weibo",
        content: form.getValues("id")!,
        userId: session?.user?.id || "",
      })
    }
  }, [form.watch("id")])

  // 验证 url
  useEffect(() => {
    if (form.watch("platform") === "rss") {
      validateUrl({
        infoChannel: "rss",
        content: form.getValues("url")!,
        userId: session?.user?.id || "",
      })
    }
  }, [form.watch("url")])

  // 重置表单
  useEffect(() => {
    resetForm()

    setFocusNameInput(false)
  }, [form.watch("platform")])

  const disableSubmit =
    loadingCreateRecord ||
    !form.watch("platform") ||
    (selectedPlatform !== "rss" && !form.watch("name")) ||
    // !form.watch("introduction") ||
    !form.watch("account_type") ||
    !form.watch("domain")?.length ||
    // !form.watch("comment") ||
    !!validateResult?.data.isExisted

  const nameInputRef = useRef<HTMLDivElement>(null)
  const uidInputRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭输入框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        nameInputRef.current &&
        !nameInputRef.current.contains(event.target as Node) &&
        focusNameInput
      ) {
        setFocusNameInput(false)
      }

      if (
        uidInputRef.current &&
        !uidInputRef.current.contains(event.target as Node) &&
        focusUidInput
      ) {
        setFocusUidInput(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [focusNameInput, focusUidInput])

  useEffect(() => {
    if (loadingValidateSource || validateResult) {
      setFocusNameInput(true)
    }
  }, [loadingValidateSource, validateResult])

  const [aiSuggestion, setAiSuggestion] = useState<string>("")

  /**
   * 使用 AI 生成关于账号的内容。
   * @param query 
   * @returns 
   */
  const runSearch = async (query: string) => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error.message || "搜索请求失败")
      }

      if (result.success && result.data) {
        return result.data
      } else {
        throw new Error(result.error.message || "搜索失败")
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      throw new Error(errorMessage)
    }
  }

  const { loading: loadingAiSuggestion, run: runAiSuggestion } = useRequest(
    runSearch,
    {
      manual: true,
      onSuccess(data) {
        setAiSuggestion(data)
        form.setValue("introduction", data)
      },
      onError(error: any) {
        showErrorToast(`获取AI建议失败: ${error.message || "未知错误"}`)
        setAiSuggestion("")
      },
    },
  )

  const isExisted = !!validateResult?.data.isExistedInFeishu

  const displayName =
    selectedPlatform === "wechat" || selectedPlatform === "weibo"
  const displayUid = selectedPlatform === "twitter"
  const displayUrl = selectedPlatform === "rss"

  return (
    <Form {...form}>
      <form className="space-y-6 overflow-x-visible p-2">
        <PlatformSelector form={form} />

        {selectedPlatform && (
          <div className="flex flex-col gap-4">
            {displayUid && (
              <UidInput
                form={form}
                loadingValidateUid={loadingValidateUid}
                validateResult={validateResult!}
              />
            )}

            {displayUrl && <UrlInput required form={form} loadingValidateUrl={loadingValidateUrl} validaeResults={validateResult!} />}

            {displayName && (
              <NameInputField
                form={form}
                validateResult={validateResult}
                loadingValidateSource={loadingValidateSource}
                runAiSuggestion={runAiSuggestion}
              />
            )}


            <DomainSelect form={form} />

            <Collapsible
              open={isExpanded}
              onOpenChange={setIsExpanded}
              className="w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm transition-all duration-300 ease-in-out"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200">
                <span className="text-sm">🥰我想填写更多内容</span>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=open]:animate-smoothDown data-[state=closed]:animate-smoothUp">
                <div
                  className={cn(
                    "flex flex-col gap-4 pt-2",
                    isExisted
                      ? "pointer-events-none cursor-not-allowed opacity-50"
                      : "",
                  )}
                >
                  <AiSuggestionInput
                    form={form}
                    accountName={form.watch("name")}
                    suggestionValue={aiSuggestion}
                    loading={loadingAiSuggestion}
                    onGenerate={runAiSuggestion}
                    showAiButton={selectedPlatform !== "rss"}
                  />
                  <CommentField form={form} />
                  <AccountTypeSelect form={form} />
                  <PublicSwitch form={form} />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <SubmitButton
              onClick={() => {
                onSubmit(form.getValues())
              }}
              loading={loadingCreateRecord}
              disabled={disableSubmit}
              isExisted={isExisted}
              existedName={validateResult?.data.matchedSources[0]?.name}
            />
          </div>
        )}
      </form>

      <DebugDialog>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">表单数据:</h3>
            <pre className="mt-2 rounded bg-slate-950 p-4 text-sm text-slate-50">
              {JSON.stringify(form.getValues(), null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">验证结果:</h3>
            <pre className="mt-2 rounded bg-slate-950 p-4 text-sm text-slate-50">
              {JSON.stringify(validateResult, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">AI 建议:</h3>
            <pre className="mt-2 rounded bg-slate-950 p-4 text-sm text-slate-50">
              {aiSuggestion || "暂无"}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">表单错误:</h3>
            <pre className="mt-2 rounded bg-slate-950 p-4 text-sm text-slate-50">
              {JSON.stringify(form.formState.errors, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          {isExisted}
          <h3 className="font-medium">已存在:</h3>
          <pre className="mt-2 rounded bg-slate-950 p-4 text-sm text-slate-50">
            {JSON.stringify(validateResult?.data.matchedSources[0], null, 2)}
          </pre>
        </div>
      </DebugDialog>
    </Form>
  )
}