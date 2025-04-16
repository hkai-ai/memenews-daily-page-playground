"use client"

import React, { createContext, useContext, useState } from "react"

import { DictionaryDialog } from "@/lib/components/DictionaryDialog"

interface DictionaryDialogContextType {
    openDictionaryDialog: (term: string) => void
    closeDictionaryDialog: () => void
}

const DictionaryDialogContext = createContext<
    DictionaryDialogContextType | undefined
>(undefined)

export function useDictionaryDialog() {
    const context = useContext(DictionaryDialogContext)
    if (!context) {
        throw new Error(
            "useDictionaryDialog must be used within a DictionaryDialogProvider",
        )
    }
    return context
}

/**
 * 名词词典对话框Provider，用于桌面端
 * @param {React.ReactNode} children - 子组件
 * @returns {React.ReactNode} - 名词词典对话框Provider
 */
export function DictionaryDialogProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentTerm, setCurrentTerm] = useState("")

    const openDictionaryDialog = (term: string) => {
        setCurrentTerm(term)
        setIsOpen(true)
    }

    const closeDictionaryDialog = () => {
        setIsOpen(false)
    }

    return (
        <DictionaryDialogContext.Provider
            value={{ openDictionaryDialog, closeDictionaryDialog }}
        >
            {children}
            <DictionaryDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                term={currentTerm}
            />
        </DictionaryDialogContext.Provider>
    )
}
