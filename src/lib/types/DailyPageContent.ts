export interface DailyPageContentResponse {
    statusCode: number
    statusText: string
    data: {
        id: number
        userName: string
        avatar: string
        verificationLevel: string
        userLevel: string
        isVerified: boolean
        refSubscribePlanId: string
        planAuthorId: string
        subscribePlanTitle: string
        date: string
        subscribedId: string | null
        channel: string | null
        timestamp: number
        title: string
        isFavorited: boolean
        views: number
        introduction: {
            slogan: string
            title: string
            planAvatar: string
            content: string
            hotSpot: {
                type: string
                index: number
                topic: string
                content: string
                briefTopic: string
                resultScore: number
                isRelated: boolean
            }[]
            date: string
            timestamp: number
        }
        content: {
            id: number
            summaryId: number
            title: string
            content: string
            referenceLinks: string[]
            tags: string[]
            associatedContent: any[]
            /**
             * 标识内容中是否包含词典术语
             */
            dictionaryTerms: string[]
            isDailyPush: boolean
            platform: string | null
            resultScore: number
            isRelated: boolean
            normalizedScore: number
            zScore: number
        }[]
        mixContent: { id: number }[]
        dailyPush: {}
    }
}
