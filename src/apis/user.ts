import type { 
  UserInfo, 
  UserLogin, 
  UserLoginDto, 
  UserRegisterDto, 
  UserUpdateDto, 
  UserVo,
  UserMsgVo 
} from '@/types/user'
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

/**
 * 更新用户信息
 * @returns 用户信息
 */
export function userUpdate(data: UserUpdateDto): Promise<Result<UserVo>> {
  return http.post(`${BASE_URL}/update`, data)
} 

/**
 * 点赞/取消点赞文章
 * @param articleId 文章编号
 * @returns 无
 */
export function likeArticle(articleId: number): Promise<Result<void>> {
  return http.post(`${BASE_URL}/likeArticle`, null, { params: { articleId } })
}

/**
 * 获取注册验证码
 * @param email 邮箱
 * @returns 验证码
 */
export function getRegisterVerificationCode(email: string): Promise<Result<String>> {
  return http.get(`${BASE_URL}/verificationCode/${email}`)
}

/**
 * 获取用户互动信息
 * @param id 用户编号
 * @returns 用户互动信息
 */
export function getUserMsg(id?: number): Promise<Result<UserMsgVo>> {
  if (id) {
    return http.get(`${BASE_URL}/userMsg/${id}`)
  } else {
    return http.get(`${BASE_URL}/userMsg`)
  }
}

/**
 * 用户浏览文章记录
 * @param id 文章编号
 * @returns 无
 */
export function userBrowse(id: number): Promise<Result<void>> {
  return http.post(`${BASE_URL}/browse`, null, { params: { articleId: id } } )
}