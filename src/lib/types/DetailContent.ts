import { AssociatedContent } from "./AssociatedContent"

export interface Content {
    id?: string | number
    summaryId?: string
    title?: string
    content?: string
}

export interface DetailContent extends Content {
    title: string
    id: number
    referenceLinks?: string[]
    dictionaryTerms?: string[]
    isRelated: boolean // 是否属于三幻神
    tags?: string[]
    associatedContent?: AssociatedContent[]
    isDailyPush?: boolean // 是否为日推
}