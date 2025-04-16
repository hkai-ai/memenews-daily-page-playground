"use client"
import { useState } from 'react'

import { DictionaryManager } from '@/lib/components/DictionaryManager'
import { NewsContent } from '@/lib/components/NewsContent'
import { DailyPageContentResponse } from '@/lib/types/DailyPageContent'
import { NewsContentEditor } from '@/lib/components/NewsContentEditor'

const sampleData: DailyPageContentResponse["data"]["content"] = [
  {
    "id": 18313,
    "summaryId": 2464,
    "title": "从发布到迭代：OpenAI 的产品哲学大揭秘",
    "content": "OpenAI 的理念是\"迭代部署\"，这意味着与其等待模型完全成熟再发布，不如先发布已有的版本，通过持续的反馈进行优化。这让团队能够快速获取用户反馈，从而了解模型的优缺点。这样的思维灵活性和快速应变能力使得 OpenAI 能够保持其产品的竞争力。\n\nKevin Weil 表示，发布新模型时，无需过于关注模型命名的细节，重要的是如何在用户中获得实质性的使用反馈。尽管命名可能令人困惑，但只要产品在市场上大受欢迎，就说明了一切。更重要的是，团队能够不断从每个发布中学习、调整方向，这种迭代过程在 AI 领域中至关重要。\n\n与此同时，微调将成为未来 AI 产品开发中的核心要素。针对特定业务需求定制模型，能够显著提升其在特定领域的表现。虽然基础模型功能强大，但微调后表现出的精确性和适用性更能满足特定客户的需求。微调不仅提升了产品的有效性，还让团队更清晰地了解模型的强弱。\n\n在未来，AI 产品经理的核心技能将是撰写有效的评估报告。通过量化模型在特定任务中的表现，评估团队将能够更好地设计出符合市场需求的产品。如果模型的有效性可以通过数据明确展现，那么产品和用户的互动也会变得更加顺利。此外，聊天作为与 AI 交互的主要方式，因其灵活性和人性化的特性，预计将在未来的技术设计中继续发挥重要作用。",
    "referenceLinks": [
      "https://mp.weixin.qq.com/s/OPg2OBQELl8Uzv1F5GC_OA"
    ],
    "tags": [],
    "associatedContent": [],
    "dictionaryTerms": [
      "OpenAI",
      "微调"
    ],
    "isDailyPush": false,
    "platform": null,
    "resultScore": 59.5,
    "isRelated": true,
    "normalizedScore": 59.5,
    "zScore": 1.7795130420052188
  }
]

export default function DictionaryPage() {
  const [currentContent, setCurrentContent] = useState(sampleData[0])

  return (
    <main className="h-screen p-4 flex gap-8">
      {/* 左侧编辑区域 */}
      <div className="flex-1 flex flex-col gap-4 overflow-auto">
        <NewsContentEditor
          initialContent={currentContent}
          onChange={content => setCurrentContent(content)}
        />
        <div className="flex-1 overflow-auto">
          <DictionaryManager />
        </div>
      </div>

      {/* 右侧预览区域 */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        <div className="w-[45%]">
          <NewsContent
            dailies={[currentContent]}
          />
        </div>
      </div>
    </main>
  )
}