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

/**
 * 新建收藏夹
 * @param name 收藏夹名称
 * @returns 无
 */
export function createFavorite(name: string): Promise<Result<void>> {
  return http.post(`${BASE_URL}/save`, { name })
}

/**
 * 添加文章到收藏夹
 * @param favoriteId 收藏夹编号
 * @param articleId 文章编号
 * @returns 无
 */
export function addArticleToFavorite(favoriteId: number, articleId: number): Promise<Result<void>> {
  return http.post(`${BASE_URL}/addArticle`, { favoriteId, articleId })
}