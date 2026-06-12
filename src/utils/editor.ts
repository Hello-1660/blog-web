export class EditorStyle {
  fontSize: string
  fontBold: string 
  fontColor: string 

  constructor() {
    this.fontSize = '20px'
    this.fontBold = '700'
    this.fontColor = '#000'
  }
}

/**
 * 去除 html 标签
 * @param html html 字符串
 * @returns  去除标签后的字符串
 */
export function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}