/**
 * 字体操作类型
 */
export type FontOption = {
  type: FontOptionType
  value: string
}

export type FontOptionType = 'size' | 'color' | 'bold' | 'bgc' | 'family'