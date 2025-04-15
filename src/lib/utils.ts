import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { DailyPageContentResponse } from "./types/DailyPageContent";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 将日报内容数据存储到浏览器的本地存储中。
 * @param {DailyPageContentResponse} data - 要存储的日报内容数据。
 * @param {string} key - 存储的键名。
 */
export function storeDailyPageContent(data: DailyPageContentResponse, key: string = "daily-page-content"): void {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("存储日报内容数据时出错:", error);
  }
}

/**
 * 从浏览器的本地存储中获取日报内容数据。
 * @param {string} key - 存储的键名。
 * @returns {DailyPageContentResponse | null} - 获取的日报内容数据，如果未找到则返回 null。
 */
export function getDailyPageContent(key: string = "daily-page-content"): DailyPageContentResponse | null {
  try {
    const serializedData = localStorage.getItem(key);
    if (!serializedData) return null;
    return JSON.parse(serializedData) as DailyPageContentResponse;
  } catch (error) {
    console.error("获取日报内容数据时出错:", error);
    return null;
  }
}

/**
 * 将词典数据存储到浏览器的本地存储中。
 * @param {DailyPageDictionary} data - 要存储的词典数据。
 * @param {string} key - 存储的键名，此处是该词的词典名。
 */
export function setDictionaryData(data: DailyPageDictionary, key: string = "daily-page-dictionary"): void {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("存储词典数据时出错:", error);
  }
}

/**
 * 从浏览器的本地存储中获取词典数据。
 * @param {string} key - 存储的键名。
 * @returns {DailyPageDictionary | null} - 获取的词典数据，如果未找到则返回 null。
 */
export function getDictionaryData(key: string = "daily-page-dictionary"): DailyPageDictionary | null {
  try {
    const serializedData = localStorage.getItem(key);
    if (!serializedData) return null;
    return JSON.parse(serializedData) as DailyPageDictionary;
  } catch (error) {
    console.error("获取词典数据时出错:", error);
    return null;
  }
}
