"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/lib/components/common/ui/button";

/**
 * 提取错误消息格式化函数
 */
const getErrorMessage = (errorType: string | null) => {
    const errorMessages = {
        'Invalid podcast URL': '无效的播客链接',
        'Network error': '网络连接失败',
        'Podcast not found': '未找到此播客',
        'Server error': '服务器错误',
        'Invalid data': '数据格式错误'
    };

    return errorMessages[errorType as keyof typeof errorMessages] || '暂无此播客';
};

interface ErrorStateProps {
    error: string | null;
    router: any;
}

/**
 * 错误状态组件
 */
const ErrorState = ({ error, router }: ErrorStateProps) => (
    <div className="min-h-screen bg-black">
        <div className="relative z-10 min-h-screen flex flex-col">
            {/* 顶部导航栏 */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/podcast')}
                            className="rounded-full hover:bg-black/5 transition-colors duration-200"
                        >
                            <ArrowLeft className="h-6 w-6 text-white/70" />
                        </Button>

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center"
                        >
                            <h1 className="text-xl font-bold text-white/90 tracking-tight">
                                Memenews Podcast
                            </h1>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* 错误状态的主要内容区域 */}
            <main className="flex-1 flex items-center justify-center bg-black w-full h-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-5xl bg-black"
                >
                    <div className="flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{
                                scale: [0.8, 1.1, 1],
                                rotate: [-10, 10, 0]
                            }}
                            transition={{
                                duration: 1.2,
                                ease: "easeOut"
                            }}
                            className="mb-6"
                        >
                            <span className="text-6xl md:text-7xl">🤔</span>
                        </motion.div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-3xl font-bold text-white mb-4 text-center"
                        >
                            {getErrorMessage(error)}
                        </motion.h2>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-white/70 text-sm mb-4 text-center"
                        >
                            {error === 'Network error'
                                ? '请检查您的网络连接后重试'
                                : 'Meaow~ 该播客资源可能不存在或已被删除'}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="text-white/60 italic text-sm mb-8"
                        >
                            &quot;遇到梗的时候，梗却遇到了问题...&quot;
                        </motion.p>
                    </div>
                </motion.div>
            </main>
        </div>
    </div>
);

export { ErrorState, getErrorMessage };