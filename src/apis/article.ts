import type { ArticleVo, ArticleSearchDto, ArticleSearchVo, HotArticleVo, ArticleDto } from '@/types/article'
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