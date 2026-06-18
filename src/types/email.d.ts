/**
 * 邮件
 */
export type Email = {
  id: number
  title: string
  content: string
  receiverId: number
  senderId: number
  createTime: string
  status: number  // 0 未读 1 已读
}

/**
 * 邮件内容片段
 */
export type EmailContentVo = {
  type: 'text' | 'link'
  value?: string
  text?: string
  route?: string
}
