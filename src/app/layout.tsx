import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { TranslationProvider } from "@/lib/context/TranslationContext"
import { DictionaryDialogProvider } from "@/lib/context/DictionaryDialog"
import { DefinitionProvider } from "@/lib/context/DictionaryContext"
import { DictionaryTooltipProvider } from "@/lib/context/DictionaryTooltipContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YuanSunTemplate",
  description: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <DictionaryDialogProvider>
        <DictionaryTooltipProvider>
          <DefinitionProvider>
            <TranslationProvider>
              <body className={inter.className}>{children}</body>
            </TranslationProvider>
          </DefinitionProvider>
        </DictionaryTooltipProvider>
      </DictionaryDialogProvider>
    </html>
  )
}
