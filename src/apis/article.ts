import type { ArticleVo, HotArticleVo, ArticleDto, ArticleUpdateDto } from '@/types/article'
import type { Result } from '@/types/api'
import http from '@/utils/http'

const BASE_URL = '/article'

/**
 * 获取推荐文章
 * @returns 推荐文章列表
 */
export function getHotDetail() :Promise<Result<HotArticleVo[]>> {
  return http.get(`${BASE_URL}/detail`)
}

/**
 * 查看文章
 * @param id 文章编号  
 * @returns 文章
 */
export function getArticleById(id: number): Promise<Result<ArticleVo>> {
  return http.get(`${BASE_URL}/browse/${id}`)
}

/**
 * 新增文章
 * @param article 文章信息 
 * @returns 无
 */
export function saveArticle(article: ArticleDto): Promise<Result<string>> {
  return http.post(`${BASE_URL}/save`, article)
}

/**
 * 更新文章
 * @param article 文章更新信息
 * @returns 无
 */
export function updateArticle(article: ArticleUpdateDto): Promise<Result<string>> {
  return http.post(`${BASE_URL}/update`, article)
}

/**
 * 删除文章
 * @param articleId 文章编号
 * @returns 无
 */
export function deleteArticle(articleId: number): Promise<Result<void>> {
  return http.delete(`${BASE_URL}/delete`, { params: { articleId } })
}