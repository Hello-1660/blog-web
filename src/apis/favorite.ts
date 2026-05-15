import type { Favorite } from '@/types/favorite'
import type { Result } from '@/types/api'
import http from '@/utils/http'

const BASE_URL = '/favorite'

/**
 * 获取收藏夹列表
 * @returns 收藏夹列表 
 */
export function getFavoriteList(): Promise<Result<Favorite[]>> {
  return http.get(`${BASE_URL}/list`)
}