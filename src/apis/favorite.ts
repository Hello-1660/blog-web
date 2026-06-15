import type { Favorite } from '@/types/favorite'
import type { Article } from '@/types/article'
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
 * @param status 收藏夹状态 0私有 1公有
 * @returns 无
 */
export function createFavorite(name: string, status?: number): Promise<Result<void>> {
  return http.post(`${BASE_URL}/save`, { name, status })
}

/**
 * 更新收藏夹
 * @param id 收藏夹编号
 * @param name 收藏夹名称
 * @param status 收藏夹状态
 * @returns 无
 */
export function updateFavorite(id: number, name: string, status: number): Promise<Result<void>> {
  return http.post(`${BASE_URL}/update`, { id, name, status })
}

/**
 * 删除收藏夹
 * @param favoriteId 收藏夹编号
 * @returns 无
 */
export function deleteFavorite(favoriteId: number): Promise<Result<void>> {
  return http.delete(`${BASE_URL}/delete/${favoriteId}`)
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

/**
 * 获取收藏夹文章列表
 * @param favoriteId 收藏夹编号
 * @returns 文章列表
 */
export function getFavoriteArticles(favoriteId: number): Promise<Result<Article[]>> {
  return http.get(`${BASE_URL}/listArticle/${favoriteId}`)
}

/**
 * 移除收藏夹中的文章
 * @param favoriteId 收藏夹编号
 * @param articleId 文章编号
 * @returns 无
 */
export function removeArticleFromFavorite(favoriteId: number, articleId: number): Promise<Result<void>> {
  return http.delete(`${BASE_URL}/removeArticle`, { params: { favoriteId, articleId } })
}

/**
 * 移除收藏夹中所有文章
 * @param favoriteId 收藏夹编号
 * @returns 无
 */
export function removeAllArticlesFromFavorite(favoriteId: number): Promise<Result<void>> {
  return http.delete(`${BASE_URL}/removeAllArticles/${favoriteId}`)
}