"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface TranslationContextType {
    defaultTranslation: boolean
    setDefaultTranslation: (value: boolean) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(
    undefined,
)

export function TranslationProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [defaultTranslation, setDefaultTranslation] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("defaultTranslation") === "true"
        }
        return false
    })

    useEffect(() => {
        localStorage.setItem("defaultTranslation", defaultTranslation.toString())
    }, [defaultTranslation])

    return (
        <TranslationContext.Provider
            value={{ defaultTranslation, setDefaultTranslation }}
        >
            {children}
        </TranslationContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(TranslationContext)
    if (context === undefined) {
        throw new Error("useTranslation must be used within a TranslationProvider")
    }
    return context
}
