"use client"

import React, { useState, useEffect, useCallback } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { getDictionaryAction } from "@/lib/api/daily/get-dictionary"
import { useDictionaryTooltip } from "@/lib/context/article/DictionaryTooltipContext"
import { dictionaryMarkdownConvertComponents } from "@/lib/markdown/converter"

interface DictionaryTooltipProps {
  term: string
  uniqueId: string
}

export const dictionaryPreProcessContent = (markdownContent: string) => {
  const withLineBreaks = markdownContent.replace(/\\n/g, "  \n")

  return withLineBreaks.replace(
    /(\*\*)([^*]+?)(\*\*)/g,
    (match, p1, p2, p3) => {
      if (/["'""'"]/.test(p2)) {
        return ` ${p1}${p2}${p3} `
      }
      return match
    },
  )
}

export function DictionaryTooltip({ term, uniqueId }: DictionaryTooltipProps) {
  const { currentTerm, currentTooltipId } = useDictionaryTooltip()
  const [isLoading, setIsLoading] = useState(true)
  const [dictionaryData, setDictionaryData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // 打字效果状态
  const [typingStates, setTypingStates] = useState({
    basic: { hasStarted: false, index: 0, text: "" },
    simple: { hasStarted: false, index: 0, text: "" },
    complex: { hasStarted: false, index: 0, text: "" },
  })

  // 激活的标签
  const [activeTab, setActiveTab] = useState<"basic" | "simple" | "complex">(
    "basic",
  )

  // 详情是否展开
  const [detailsOpen, setDetailsOpen] = useState(false)

  // 更新tooltip位置
  const updatePosition = useCallback(() => {
    const keywordElement = document.getElementById(`keyword-${uniqueId}`)
    const tooltipContainer = document.getElementById(
      `dictionary-tooltip-container-${uniqueId}`,
    )

    if (keywordElement && tooltipContainer) {
      const rect = keywordElement.getBoundingClientRect()
      const scrollY = window.scrollY
      const scrollX = window.scrollX

      // 计算位置，使tooltip显示在关键词下方
      const top = rect.bottom + scrollY
      const left = Math.max(0, rect.left + scrollX)

      // 设置tooltip容器的位置
      tooltipContainer.style.top = `${top}px`
      tooltipContainer.style.left = `${left}px`
      setPosition({ top, left })
    }
  }, [uniqueId])

  // 监听滚动和调整大小事件
  useEffect(() => {
    if (currentTerm === term && currentTooltipId === uniqueId) {
      updatePosition()
      window.addEventListener("scroll", updatePosition)
      window.addEventListener("resize", updatePosition)

      return () => {
        window.removeEventListener("scroll", updatePosition)
        window.removeEventListener("resize", updatePosition)
      }
    }
  }, [currentTerm, currentTooltipId, term, uniqueId, updatePosition])

  // Fetch dictionary data when tooltip is mounted and visible
  useEffect(() => {
    if (currentTerm === term && currentTooltipId === uniqueId) {
      fetchDictionaryData()
    }
  }, [currentTerm, currentTooltipId, term, uniqueId])

  const fetchDictionaryData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getDictionaryAction({ term })
      setDictionaryData(response.data)
      setIsLoading(false)

      // Reset typing states
      setTypingStates({
        basic: { hasStarted: false, index: 0, text: "" },
        simple: { hasStarted: false, index: 0, text: "" },
        complex: { hasStarted: false, index: 0, text: "" },
      })
    } catch (error) {
      console.error("Error fetching dictionary data:", error)
      setError("加载失败，请稍后重试")
      setIsLoading(false)
    }
  }

  // 开始打字效果
  const startTypingEffect = (type: "basic" | "simple" | "complex") => {
    if (typingStates[type].hasStarted || !dictionaryData) return

    const definitionText =
      type === "basic"
        ? dictionaryData.aiBasicDefinition
        : type === "simple"
          ? dictionaryData.aiSimplestDefinition
          : dictionaryData.aiComplexDefinition

    let index = 0
    const newTypingStates = { ...typingStates }
    newTypingStates[type].hasStarted = true
    setTypingStates(newTypingStates)

    // 先显示第一个词，然后再开始打字效果
    const firstWord = definitionText.split(" ")[0]
    setTypingStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        text: firstWord + " ",
      },
    }))

    index = firstWord.length + 1

    const typeText = () => {
      if (index < definitionText.length) {
        setTypingStates((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            index: index + 1,
            text: definitionText.substring(0, index + 1),
          },
        }))
        index++
        setTimeout(typeText, 10)
      }
    }

    setTimeout(typeText, 100) // 给一个短暂的延迟再开始打字效果
  }

  // 处理标签切换
  const handleTabChange = (tab: "basic" | "simple" | "complex") => {
    setActiveTab(tab)
    startTypingEffect(tab)
  }

  // 处理详情切换
  const handleDetailsToggle = () => {
    const newDetailsOpen = !detailsOpen
    setDetailsOpen(newDetailsOpen)

    if (newDetailsOpen && !typingStates.basic.hasStarted) {
      startTypingEffect("basic")
    }
  }

  // 如果当前tooltip不是激活的，不渲染内容
  if (currentTerm !== term || currentTooltipId !== uniqueId) {
    return null
  }

  return (
    <div
      className="definition-tooltip absolute z-10 w-96 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      onClick={(e) => e.stopPropagation()}
    >
      {isLoading ? (
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-5 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <div className="h-8 w-1/3 rounded bg-gray-200"></div>
              <div className="h-4 w-10 rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200"></div>
              <div className="h-4 w-5/6 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <div className="text-red-500 dark:text-red-400">
            <svg
              className="mx-auto mb-2 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        dictionaryData && (
          <div className="overflow-hidden font-mono">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-5 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {dictionaryData.term}
                </h2>
                <div className="mr-6 flex flex-wrap gap-2">
                  {dictionaryData.domain.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-300/50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-800/50 dark:text-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 dark:bg-gray-800">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {dictionaryData.definition}
              </p>

              <div className="my-4 border-t border-gray-100 dark:border-gray-700"></div>

              <div className="mt-3">
                <button
                  onClick={handleDetailsToggle}
                  className="mb-2 flex w-full cursor-pointer items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className={`mr-2 h-4 w-4 transform transition-transform ${detailsOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span>AI解释</span>
                </button>

                {detailsOpen && (
                  <div className="mt-3">
                    <div className="mb-4 flex border-b border-gray-200 dark:border-gray-700">
                      <button
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "simple"
                            ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                        onClick={() => handleTabChange("simple")}
                      >
                        😜通俗解释
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "basic"
                            ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                        onClick={() => handleTabChange("basic")}
                      >
                        😉基础解释
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "complex"
                            ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                        onClick={() => handleTabChange("complex")}
                      >
                        🤔深入解释
                      </button>
                    </div>

                    <div className="pl-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      <div className={activeTab === "basic" ? "" : "hidden"}>
                        <Markdown
                          className="typing-effect"
                          components={dictionaryMarkdownConvertComponents()}
                          remarkPlugins={[remarkGfm]}
                        >
                          {dictionaryPreProcessContent(
                            typingStates.basic.text || "",
                          )}
                        </Markdown>
                      </div>
                      <div className={activeTab === "simple" ? "" : "hidden"}>
                        <Markdown
                          className="typing-effect"
                          components={dictionaryMarkdownConvertComponents()}
                          remarkPlugins={[remarkGfm]}
                        >
                          {dictionaryPreProcessContent(
                            typingStates.simple.text || "",
                          )}
                        </Markdown>
                      </div>
                      <div className={activeTab === "complex" ? "" : "hidden"}>
                        <Markdown
                          className="typing-effect"
                          components={dictionaryMarkdownConvertComponents()}
                          remarkPlugins={[remarkGfm]}
                        >
                          {dictionaryPreProcessContent(
                            typingStates.complex.text || "",
                          )}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
