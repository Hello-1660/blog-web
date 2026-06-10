/**
 * 字体操作类型
 */
export type FontOption = {
  type: FontOptionType
  value: string
}

// 操作类型
export type FontOptionType = 'size' | 'color' | 'bold' | 'bgc' | 'family' | 'underline'

/**
 * 插入操作类型
 */
export type InsertOption = {
  type: insertType
  value: string
} 
// 插入类型
export type insertType = 'img' | 'link'