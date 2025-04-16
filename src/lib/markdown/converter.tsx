/**
 * @module markdown/converter
 * 如果要使用 react-markdown ，需要自己写相应的转义函数以适应相应样式
 * 该模块用于定义在 daily page 中使用的转义函数以适应相应页面样式
 */

import { type Components } from "react-markdown"
import { useEffect, useState } from "react"

import { cn, isUrl, hasChineseCharacters } from "../utils"

import { useDefinition } from "@/lib/context/DictionaryContext"
import { useDictionaryDialog } from "@/lib/context/DictionaryDialog"
import { useDictionaryTooltip } from "@/lib/context/DictionaryTooltipContext"
import { DictionaryTooltip } from "@/lib/components/DictionaryTooltip"


export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false)

    const handleResize = () => {
        setIsMobile(window.innerWidth < 768)
    }

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return isMobile
}


/**
 * 如果是纯英文文本，排版为左对齐，中英文混排文本，排版为两端对齐
 * 如果是 URL ，则强制换行
 */
const getTextWrapClassName = (text: string | React.ReactNode): string => {
    return cn(
        hasChineseCharacters(text) ? "text-justify" : "text-start",
        typeof text === "string" && isUrl(text) ? "break-all" : "break-words",
    )
}

/**
 * 对于触发名词词典的关键词进行高亮特殊化处理
 */
const useKeywordDefinitions = (terms: string[] = []) => {
    const isMobile = useIsMobile()
    const { openDictionaryDialog } = useDictionaryDialog()
    const { openTooltip, currentTerm, currentTooltipId } = useDictionaryTooltip()

    /**
     * 高亮文本中的关键词并添加交互功能
     * @param text - 需要处理的原始文本
     * @param hideDefinitions - 是否隐藏定义功能的标志
     * @returns 处理后的 React 节点或原始文本
     */
    const highlightKeywords = (text: string, hideDefinitions: boolean) => {
        // 如果不是字符串或需要隐藏定义，直接返回原文本
        if (typeof text !== "string") return text
        if (hideDefinitions) return text

        // 创建一个组件来处理高亮和词典功能
        const KeywordHighlighter = () => {
            // 在客户端环境中添加词典对话框打开函数
            useEffect(() => {
                if (typeof window !== "undefined") {
                    ; (window as any).openDictionaryDialog = openDictionaryDialog
                        ; (window as any).openTooltip = openTooltip
                }

                return () => {
                    if (typeof window !== "undefined") {
                        delete (window as any).openDictionaryDialog
                        delete (window as any).openTooltip
                    }
                }
            }, [openDictionaryDialog, openTooltip])

            let result = text
            let instanceCounter = 0
            const tooltips: { term: string; uniqueId: string }[] = []

            // 用于追踪每段文本中已处理过的关键词
            const processedTerms = new Set<string>()

            // 遍历每个关键词进行处理
            terms.forEach((keyword) => {
                // 重置已处理关键词集合
                processedTerms.clear()

                try {
                    const isChinese = /[\u4e00-\u9fa5]/.test(keyword)
                    const regex = isChinese
                        ? new RegExp(`(${keyword})`, "g")
                        : new RegExp(`(?<![a-zA-Z])(${keyword})s?(?![a-zA-Z-])`, "g")

                    // 替换文本中的关键词为带有交互功能的 HTML 结构
                    result = result.replace(regex, (match, _, offset) => {
                        // 如果这个词已经在当前段落中处理过，则返回原文本
                        if (processedTerms.has(match)) {
                            return match
                        }

                        // 将这个词添加到已处理集合中
                        processedTerms.add(match)

                        // 生成唯一ID并返回带有交互功能的HTML结构
                        const uniqueId = `${match}-${offset}-${instanceCounter++}`
                        tooltips.push({ term: match, uniqueId })

                        // 移动设备使用简化的点击处理
                        if (isMobile) {
                            return `
                <span 
                  class="cursor-pointer border-b border-dashed border-gray-600"
                  onclick="
                    window.openDictionaryDialog('${match}');
                    event.stopPropagation();
                  "
                >${match}</span>
              `
                        }

                        // 桌面设备使用原有的tooltip
                        return `
              <div class="relative inline-block">
                <span 
                  class="cursor-pointer border-b border-dashed border-gray-600"
                  onclick="
                    window.openTooltip('${match}', '${uniqueId}');
                    event.stopPropagation();
                  "
                  id="keyword-${uniqueId}"
                >${match}</span>
                <div id="dictionary-tooltip-container-${uniqueId}" class="definition-tooltip hidden fixed" style="z-index: 1000;">
                  ${currentTerm === match && currentTooltipId === uniqueId
                                ? `
                    <div class="absolute">
                      <DictionaryTooltip term="${match}" uniqueId="${uniqueId}" />
                    </div>
                  `
                                : ""
                            }
                </div>
              </div>`
                    })
                } catch (error) {
                    console.error(`Error processing keyword "${keyword}":`, error)
                    return
                }
            })

            return (
                <>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: result,
                        }}
                    />
                    {tooltips.map(
                        ({ term, uniqueId }) =>
                            currentTerm === term &&
                            currentTooltipId === uniqueId && (
                                <DictionaryTooltip
                                    key={uniqueId}
                                    term={term}
                                    uniqueId={uniqueId}
                                />
                            ),
                    )}
                </>
            )
        }

        return <KeywordHighlighter />
    }

    return { highlightKeywords }
}

/**
 * 日报详情页正文的转换函数
 */
export const dailyPageMarkdownConvertComponents = (
    dictionaryTerms?: string[],
): Components => ({
    // 由于 DailyPage 的条目标题为 h1 ，因此，原文总结的所有内容标题都要进行相应的降级
    /**
     * 🗑️ 大概率不会用到
     */
    h1: ({ children }) => (
        <h1 className="mb-2 mt-6 font-semibold leading-loose tracking-wide text-blue-400 dark:text-blue-300 md:text-base lg:text-2xl">
            {children}
        </h1>
    ),
    /**
     * 🗑️ 大概率不会用到
     */
    h2: ({ children }) => (
        <h2 className="mb-2 mt-5 font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100 md:text-base lg:text-xl">
            {children}
        </h2>
    ),
    /**
     * 👾 正常来说正文的标题级别
     */
    h3: ({ children }) => (
        <h3
            id="subTitle"
            className="mb-1.5 mt-4 text-base font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100"
        >
            {children}
        </h3>
    ),
    /**
     * 🗑️ 大概率不会用到
     */
    h4: ({ children }) => (
        <h4 className="mb-1 mt-3.5 text-sm font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100">
            {children}
        </h4>
    ),
    /**
     * 🗑️ 大概率不会用到
     */
    h5: ({ children }) => (
        <h5 className="mb-0.5 mt-3 font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100 lg:text-sm">
            {children}
        </h5>
    ),
    /**
     * 🗑️ 大概率不会用到
     */
    h6: ({ children }) => (
        <h6 className="mb-0.5 mt-2 font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100 lg:text-xs">
            {children}
        </h6>
    ),
    /**
     * 👾 正文的内容
     */
    p: ({ children }) => {
        const ParagraphComponent = () => {
            const { hideDefinitions } = useDefinition()
            const { highlightKeywords } = useKeywordDefinitions(dictionaryTerms)

            return (
                <p
                    className={cn(
                        "relative mb-5 text-base leading-[30px] text-[#4c4e4d] dark:text-gray-200",
                        getTextWrapClassName(children),
                    )}
                >
                    {highlightKeywords(children as string, hideDefinitions)}
                </p>
            )
        }

        return <ParagraphComponent />
    },
    /**
     * 👾 可能会被匹配到
     */
    ul: ({ children }) => <ul className="my-2 ml-4 list-disc">{children}</ul>,
    /**
     * 👾 可能会被匹配到
     */
    ol: ({ children }) => (
        <ol className="my-2 ml-4 list-decimal text-justify">{children}</ol>
    ),
    /**
     * 👾 列表会被匹配到这里
     */
    li: ({ children }) => (
        <li
            className={cn(
                "my-1 text-sm text-[#4c4e4d] dark:text-gray-300",
                getTextWrapClassName(children),
            )}
        >
            {children}
        </li>
    ),
    /**
     * 👾 可能会被匹配到
     */
    blockquote: ({ children }) => (
        <blockquote className="my-2 border-l-4 border-gray-400 pl-2 dark:border-gray-600 dark:text-gray-300">
            {children}
        </blockquote>
    ),
    br: () => <br className="my-2" />,
    // 代码块的渲染应该考虑使用其他 plugins
    code: ({ children }) => (
        <code className="my-2 whitespace-pre-wrap text-base">{children}</code>
    ),
    pre: ({ children }) => (
        <pre className="my-2 whitespace-pre-wrap text-base">{children}</pre>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => (
        <strong className="font-normal text-[#A60000] dark:text-[#FF9999]">
            {children}
        </strong>
    ),
    del: ({ children }) => <del className="line-through">{children}</del>,
    /**
     * 👾 链接会被匹配到
     */
    a: ({ children, href }) => (
        <a
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "text-blue-500 underline hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300",
                getTextWrapClassName(children),
            )}
            href={href}
        >
            {children}
        </a>
    ),
    /**
     * 👾 图片会被匹配到
     */
    img: ({ src, alt }) => (
        <img className="my-2 w-full object-cover" src={src} alt={alt} />
    ),
    /**
     * 👾 分割线，目前在日推项见过
     */
    hr: () => <hr className="my-2 dark:border-gray-700" />,
    /**
     * 🗑️ 大概率不会用到
     */
    table: ({ children }) => (
        <table className="border-collapse dark:text-gray-200">{children}</table>
    ),
})

/**
 * 日报详情页关系型数据的转换函数
 */
export const dailyPageRelationArticleMarkdownConvertComponents: Components = {
    // 由于 DailyPage 的条目标题为 h1 ，因此，原文总结的所有内容标题都要进行相应的降级
    // @todo 响应式的测试
    h1: ({ children }) => (
        <h1 className="mb-2 mt-6 font-semibold leading-loose tracking-wide text-blue-400 dark:text-blue-300 md:text-base lg:text-2xl">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="mb-2 mt-5 font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100 md:text-base lg:text-xl">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3
            id="subTitle"
            className="mb-1.5 mt-4 text-base font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100"
        >
            {children}
        </h3>
    ),
    h4: ({ children }) => (
        <h4 className="mb-1 mt-3.5 text-sm font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100">
            {children}
        </h4>
    ),
    h5: ({ children }) => (
        <h5 className="mb-0.5 mt-3 font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100 lg:text-sm">
            {children}
        </h5>
    ),
    h6: ({ children }) => (
        <h6 className="mb-0.5 mt-2 font-semibold leading-loose tracking-wide text-gray-800 dark:text-gray-100 lg:text-xs">
            {children}
        </h6>
    ),
    p: ({ children }) => (
        <p
            className={cn(
                "text-sm leading-[22px] text-[#4c4e4d] dark:text-gray-200",
                getTextWrapClassName(children),
            )}
        >
            {children}
        </p>
    ),
    ul: ({ children }) => <ul className="my-2 ml-4 list-disc">{children}</ul>,
    ol: ({ children }) => (
        <ol className="my-2 ml-4 list-decimal text-justify">{children}</ol>
    ),
    li: ({ children }) => (
        <li
            className={cn(
                "my-1 text-sm text-[#4c4e4d] dark:text-gray-300",
                getTextWrapClassName(children),
            )}
        >
            {children}
        </li>
    ),
    // 下面的内容没有测试过。
    blockquote: ({ children }) => (
        <blockquote className="my-2 border-l-4 border-gray-400 pl-2 dark:border-gray-600 dark:text-gray-300">
            {children}
        </blockquote>
    ),
    br: () => <br className="my-2" />,
    // 代码块的渲染应该考虑使用其他 plugins
    code: ({ children }) => (
        <code className="my-2 whitespace-pre-wrap text-base dark:text-gray-200">
            {children}
        </code>
    ),
    pre: ({ children }) => (
        <pre className="my-2 whitespace-pre-wrap text-base dark:text-gray-200">
            {children}
        </pre>
    ),
    em: ({ children }) => (
        <em className="italic dark:text-gray-200">{children}</em>
    ),
    strong: ({ children }) => (
        <strong className="font-normal dark:text-gray-200">{children}</strong>
    ),
    del: ({ children }) => (
        <del className="line-through dark:text-gray-300">{children}</del>
    ),
    a: ({ children, href }) => (
        <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                e.stopPropagation()
            }}
            className={cn(
                "text-blue-500 underline hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300",
                getTextWrapClassName(children),
            )}
            href={href}
        >
            链接
        </a>
    ),
    img: ({ src, alt }) => (
        <img className="my-2 w-full object-cover" src={src} alt={alt} />
    ),
    hr: () => <hr className="my-2 dark:border-gray-700" />,
    table: ({ children }) => (
        <table className="border-collapse dark:text-gray-200">{children}</table>
    ),
}

/**
 * 词典页的转换函数
 */
export const dictionaryMarkdownConvertComponents = (): Components => ({
    p: ({ children }) => <p className="my-2 text-sm">{children}</p>,
    ul: ({ children }) => <ul className="my-2 ml-4 list-disc">{children}</ul>,
    ol: ({ children }) => (
        <ol className="my-2 ml-4 list-decimal text-justify">{children}</ol>
    ),
    li: ({ children }) => (
        <li
            className={cn(
                "my-1 text-sm text-[#4c4e4d] dark:text-gray-300",
                getTextWrapClassName(children),
            )}
        >
            {children}
        </li>
    ),
    blockquote: ({ children }) => (
        <blockquote className="my-2 border-l-4 border-gray-400 pl-2 dark:border-gray-600 dark:text-gray-300">
            {children}
        </blockquote>
    ),
    br: () => <br className="my-2" />,
    code: ({ children }) => (
        <code className="my-2 whitespace-pre-wrap text-base">{children}</code>
    ),
    pre: ({ children }) => (
        <pre className="my-2 whitespace-pre-wrap text-base">{children}</pre>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => (
        <strong className="font-normal text-[#A60000] dark:text-[#FF9999]">
            {children}
        </strong>
    ),
    del: ({ children }) => <del className="line-through">{children}</del>,
    a: ({ children, href }) => (
        <a
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "text-blue-500 underline hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300",
                getTextWrapClassName(children),
            )}
            href={href}
        >
            {children}
        </a>
    ),
    img: ({ src, alt }) => (
        <img className="my-2 w-full object-cover" src={src} alt={alt} />
    ),
    hr: () => <hr className="my-2 dark:border-gray-700" />,
})
