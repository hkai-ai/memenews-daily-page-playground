"use client"

import React, { createContext, useContext, useState } from "react"

interface DictionaryTooltipContextType {
    openTooltip: (term: string, uniqueId: string) => void
    closeAllTooltips: () => void
    currentTerm: string | null
    currentTooltipId: string | null
}

const DictionaryTooltipContext = createContext<
    DictionaryTooltipContextType | undefined
>(undefined)

export function useDictionaryTooltip() {
    const context = useContext(DictionaryTooltipContext)
    if (!context) {
        throw new Error(
            "useDictionaryTooltip must be used within a DictionaryTooltipProvider",
        )
    }
    return context
}

/**
 * 名词词典移动端提示框Provider
 * @param {React.ReactNode} children - 子组件
 * @returns {React.ReactNode} - 名词词典移动端提示框Provider
 */
export function DictionaryTooltipProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [currentTerm, setCurrentTerm] = useState<string | null>(null)
    const [currentTooltipId, setCurrentTooltipId] = useState<string | null>(null)

    const openTooltip = (term: string, uniqueId: string) => {
        setCurrentTerm(term)
        setCurrentTooltipId(uniqueId)
    }

    const closeAllTooltips = () => {
        setCurrentTerm(null)
        setCurrentTooltipId(null)
    }

    // 添加全局点击事件监听器，用于关闭所有定义弹窗
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            // 如果点击的不是tooltip内部元素，则关闭所有tooltip
            if (!target.closest(".definition-tooltip")) {
                closeAllTooltips()
            }
        }

        document.addEventListener("click", handleClickOutside)

        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])

    return (
        <DictionaryTooltipContext.Provider
            value={{
                openTooltip,
                closeAllTooltips,
                currentTerm,
                currentTooltipId,
            }}
        >
            {children}
        </DictionaryTooltipContext.Provider>
    )
}
