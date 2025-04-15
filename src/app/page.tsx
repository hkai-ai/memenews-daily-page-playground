"use client"
import { DictionaryManager } from '@/components/DictionaryManager'

export default function DictionaryPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold text-center my-8">词典管理</h1>
      <DictionaryManager />
    </main>
  )
}