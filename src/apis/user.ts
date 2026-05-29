import type { UserInfo, UserLogin, UserLoginDto, UserRegisterDto } from '@/types/user'
import type { Article, UserLikeArticle } from '@/types/article'
import type { Result } from '@/types/api'
import http from '@/utils/http'

const BASE_URL = '/user'

/**
 * 用户登录
 * @param userLoginDto 用户登录信息
 * @returns 用户信息 + token
 */
export function login(userLoginDto: UserLoginDto): Promise<Result<UserLogin>> {
  return http.post(`${BASE_URL}/login`, userLoginDto)
}


/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<Result<UserInfo>> {
  return http.get(`${BASE_URL}/detail`)
}

/**
 * 用户注册
 * @param userRegisterDto 用户注册信息
 * @returns 用户登录信息
 */
export function register(userRegisterDto: UserRegisterDto): Promise<Result<UserLoginDto>> {
  return http.post(`${BASE_URL}/save`, userRegisterDto)
}

/**
 * 获取用户文章列表
 * @returns 文章列表
 */
export function getArticleList(): Promise<Result<Article[]>> {
  return http.get(`${BASE_URL}/articleList`)
}

/**
 * 获取用户喜欢列表
 * @returns  用户喜欢列表
 */
export function getUserLikeArticleList(): Promise<Result<UserLikeArticle[]>> {
  return http.get(`${BASE_URL}/likeList`)
}


