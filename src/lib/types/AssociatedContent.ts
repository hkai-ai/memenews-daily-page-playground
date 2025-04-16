/**
 * 关系型信息源
 */
export interface AssociatedContent {
    authorName: string
    avatar: string
    originalText: string
    parsedText: string
    recordPublishedTime: number
    recordText: string
    sourceId: string
    platform: "微博" | "twitter"
    photosSrc: string[]
}