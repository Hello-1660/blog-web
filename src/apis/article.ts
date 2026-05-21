import type { Article, ArticleSearchDto, ArticleSearchVo, HotArticleVo } from '@/types/article'
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