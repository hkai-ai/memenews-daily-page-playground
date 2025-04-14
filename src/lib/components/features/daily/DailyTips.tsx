"use client"
import React from 'react'

export function DailyTips() {
    return (
        <div className="w-full border border-blue-200 bg-blue-50/80 dark:bg-blue-950/30 dark:border-blue-900/50 rounded-lg p-4 shadow-sm flex items-center space-x-3 mt-8">
            <div className="flex-shrink-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="text-blue-400 dark:text-blue-400 w-6 h-6"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    您的meme内容较少，您可以考虑往meme里添加信息源以解决该问题。
                </p>
            </div>
        </div>
    )
}