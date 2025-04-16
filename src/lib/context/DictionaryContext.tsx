"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface DefinitionContextType {
    hideDefinitions: boolean
    setHideDefinitions: (value: boolean) => void
}

const DefinitionContext = createContext<DefinitionContextType | undefined>(
    undefined,
)

export function DefinitionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [hideDefinitions, setHideDefinitions] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("hideDefinitions") === "true"
        }
        return false
    })

    useEffect(() => {
        localStorage.setItem("hideDefinitions", hideDefinitions.toString())
    }, [hideDefinitions])

    return (
        <DefinitionContext.Provider value={{ hideDefinitions, setHideDefinitions }}>
            {children}
        </DefinitionContext.Provider>
    )
}

export function useDefinition() {
    const context = useContext(DefinitionContext)
    if (context === undefined) {
        throw new Error("useDefinition must be used within a DefinitionProvider")
    }
    return context
}
