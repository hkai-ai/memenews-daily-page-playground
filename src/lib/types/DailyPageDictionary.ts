interface DailyPageDictionary {
    statusCode: number
    statusText: string
    data: {
        id: number
        term: string
        definition: string
        origin: string | null
        refTerm: string | null
        domain: string[]
        imageUrls: string[]
        /**
         * 基础定义
         */
        aiBasicDefinition: string
        /**
         * 最简定义
         */
        aiSimplestDefinition: string
        /**
         * 复杂定义
         */
        aiComplexDefinition: string
        createdAt: string
        updatedAt: string
        /**
         * 引用列表
         */
        references: {
            [key: string]: string
        }
    }
}
