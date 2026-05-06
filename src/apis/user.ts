import type { userInfo, userLoginDto } from '@/types/user'
import type { Result } from '@/types/api'
import http from '@/utils/http'

/**
 * 用户登录
 * @param userLoginDto 用户登录信息
 * @returns 令牌
 */
export function login(userLoginDto: userLoginDto): Promise<Result<string>> {
  return http.post('/user/login', userLoginDto)
}


/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<Result<userInfo>> {
  return http.get('/user/detail')
}