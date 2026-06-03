/**
 * 历史状态操作类型
 */
export type OptionType = 'insert' | 'update' | 'delete'

/**
 * 位置类型
 */
export type Position = {
  // 位置
  path: [number, number]
  // 偏移量
  offset?: number
}

/**
 * 内容快照
 */
export type ContentSnapshot = {
  // 原内容
  proContent: any
  // 当前内容
  currentContent: any
}