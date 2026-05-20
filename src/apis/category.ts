import type { Category } from '@/types/category'
import type { Result } from '@/types/api'
import http from '@/utils/http'

const BASE_URL = '/category'

/**
 * 获取分类列表
 * @returns 分类列表
 * @returns 
 */
export function getCategoryList(): Promise<Result<Category[]>> {
  return http.get(`${BASE_URL}/list`)
}