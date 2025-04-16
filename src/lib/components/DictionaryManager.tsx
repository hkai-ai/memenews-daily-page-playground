"use client"
import { useState, useEffect } from 'react'

import { getDictionaryData, setDictionaryData } from '@/lib/utils'

/**
 * @typedef {Object} DictionaryFormData
 * @property {string} term - 词条名称
 * @property {string} definition - 词条定义
 * @property {string | null} origin - 词源
 * @property {string | null} refTerm - 参考词条
 * @property {string[]} domain - 所属领域
 * @property {string[]} imageUrls - 图片URL列表
 * @property {string} aiBasicDefinition - AI基础定义
 * @property {string} aiSimplestDefinition - AI最简定义
 * @property {string} aiComplexDefinition - AI复杂定义
 */

/**
 * 词典管理器组件
 */
export function DictionaryManager() {
    const [dictionaries, setDictionaries] = useState<string[]>([])
    const [selectedDict, setSelectedDict] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        id: Date.now(),
        term: '',
        definition: '',
        origin: null,
        refTerm: null,
        domain: [],
        imageUrls: [],
        aiBasicDefinition: '',
        aiSimplestDefinition: '',
        aiComplexDefinition: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })

    // 加载已存储的词典列表
    useEffect(() => {
        const storedKeys = Object.keys(localStorage).filter(key =>
            key.startsWith('dict_')
        )
        setDictionaries(storedKeys.map(key => key.replace('dict_', '')))
    }, [])

    /**
     * 处理表单提交
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.term || formData.term.trim().length === 0) {
            alert('请输入词条名称')
            return
        }
        const dictionaryData = {
            statusCode: 200,
            statusText: 'OK',
            data: formData
        }
        const storageKey = `dict_${formData.term}`
        setDictionaryData(dictionaryData, storageKey)

        // 只有当词典不存在时才添加到列表中
        setDictionaries(prev => {
            if (!prev.includes(formData.term)) {
                return [...prev, formData.term]
            }
            return prev
        })
    }

    /**
     * 加载选中的词典数据
     */
    const loadDictionary = (term: string) => {
        const data = getDictionaryData(`dict_${term}`)
        setSelectedDict(term)
        if (data) {
            setFormData(data.data)
        }
    }

    /**
     * 删除选中的词典
     * @param term - 要删除的词条名称
     */
    const handleDelete = (term: string) => {
        const storageKey = `dict_${term}`
        localStorage.removeItem(storageKey)
        setDictionaries(prev => prev.filter(dict => dict !== term))
        if (selectedDict === term) {
            setSelectedDict(null)
            setFormData({
                id: Date.now(),
                term: '',
                definition: '',
                origin: null,
                refTerm: null,
                domain: [],
                imageUrls: [],
                aiBasicDefinition: '',
                aiSimplestDefinition: '',
                aiComplexDefinition: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        }
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-12 gap-6">
                {/* 词典列表 */}
                <div className="col-span-3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">词典列表</h2>
                        <div className="divide-y divide-gray-200">
                            {dictionaries.map(dict => (
                                <div
                                    key={dict}
                                    className="py-2 flex items-center justify-between group"
                                >
                                    <div
                                        className={`flex-grow cursor-pointer p-2 rounded-md transition-colors
                                            ${selectedDict === dict
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'hover:bg-gray-50'}`}
                                        onClick={() => loadDictionary(dict)}
                                    >
                                        {dict}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(dict)}
                                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 
                                            transition-opacity p-2"
                                        title="删除词典"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 表单区域 */}
                <div className="col-span-9">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {selectedDict ? '编辑词典' : '添加新词典'}
                                </h2>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            id: Date.now(),
                                            term: '',
                                            definition: '',
                                            origin: null,
                                            refTerm: null,
                                            domain: [],
                                            imageUrls: [],
                                            aiBasicDefinition: '',
                                            aiSimplestDefinition: '',
                                            aiComplexDefinition: '',
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString()
                                        })}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 
                                            hover:bg-gray-50 transition-colors"
                                    >
                                        新增词典
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                                            transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        保存词典
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        词条名称
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.term}
                                        onChange={e => setFormData(prev => ({ ...prev, term: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 
                                            focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        定义(支持Markdown)
                                    </label>
                                    <textarea
                                        value={formData.definition}
                                        onChange={e => setFormData(prev => ({ ...prev, definition: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 
                                            focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        AI 基础定义(支持Markdown)
                                    </label>
                                    <textarea
                                        value={formData.aiBasicDefinition}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            aiBasicDefinition: e.target.value
                                        }))}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 
                                            focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        AI 最简定义(支持Markdown)
                                    </label>
                                    <textarea
                                        value={formData.aiSimplestDefinition}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            aiSimplestDefinition: e.target.value
                                        }))}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 
                                            focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        AI 复杂定义(支持Markdown)
                                    </label>
                                    <textarea
                                        value={formData.aiComplexDefinition}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            aiComplexDefinition: e.target.value
                                        }))}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 
                                            focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        所属领域（用逗号分隔）
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.domain.join(',')}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            domain: e.target.value.split(',').map(d => d.trim())
                                        }))}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 
                                            focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
} 