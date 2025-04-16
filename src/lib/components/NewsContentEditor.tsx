import { useState } from 'react'

import { DailyPageContentResponse } from '@/lib/types/DailyPageContent'

type NewsContentEditorProps = {
    initialContent: DailyPageContentResponse['data']['content'][0]
    onChange: (content: DailyPageContentResponse['data']['content'][0]) => void
}

/**
 * 新闻内容编辑器组件
 * @param props - 组件属性
 */
export function NewsContentEditor({ initialContent, onChange }: NewsContentEditorProps) {
    const [content, setContent] = useState(initialContent)
    const [dictionaryTermsText, setDictionaryTermsText] = useState(
        initialContent.dictionaryTerms.join('\n')
    )

    const handleChange = (field: 'title' | 'content', value: string) => {
        const newContent = {
            ...content,
            [field]: value
        }
        setContent(newContent)
        onChange(newContent)
    }

    /**
     * 同步词典术语到主内容
     */
    const syncDictionaryTerms = () => {
        const terms = dictionaryTermsText
            .split('\n')
            .map(term => term.trim())
            .filter(Boolean)

        const newContent = {
            ...content,
            dictionaryTerms: terms
        }
        setContent(newContent)
        onChange(newContent)
    }

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">内容编辑器</h2>
                <button
                    onClick={syncDictionaryTerms}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    同步更新词典术语
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">标题</label>
                    <input
                        type="text"
                        value={content.title}
                        onChange={e => handleChange('title', e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">内容</label>
                    <textarea
                        value={content.content}
                        onChange={e => handleChange('content', e.target.value)}
                        className="w-full p-2 border rounded min-h-[200px]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">词典术语（每行一个）</label>
                    <textarea
                        value={dictionaryTermsText}
                        onChange={e => setDictionaryTermsText(e.target.value)}
                        className="w-full p-2 border rounded min-h-[100px]"
                    />
                </div>
            </div>
        </div>
    )
} 