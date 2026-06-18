import http from '@/utils/http'
import type { Result } from '@/types/api'
import type { Email } from '@/types/email'

const BASE_URL = 'email'

/**
 * 获取邮件列表
 */
export function getEmailList(): Promise<Result<Email[]>> {
  return http.get(`${BASE_URL}/list`)
}

/**
 * 阅读邮件
 */
export function readEmail(id: number): Promise<Result<Email>> {
  return http.get(`${BASE_URL}/read/${id}`)
}

/**
 * 全部已读
 */
export function allRead(): Promise<Result<void>> {
  return http.get(`${BASE_URL}/allRead`)
}

/**
 * 批量删除邮件
 */
export function deleteEmails(ids: number[]): Promise<Result<void>> {
  return http.post(`${BASE_URL}/delete`, ids)
}
