import type { UserInfo, UserLogin, UserLoginDto, UserRegisterDto } from '@/types/user'
import type { Result } from '@/types/api'
import http from '@/utils/http'

/**
 * 用户登录
 * @param userLoginDto 用户登录信息
 * @returns 用户信息 + token
 */
export function login(userLoginDto: UserLoginDto): Promise<Result<UserLogin>> {
  return http.post('/user/login', userLoginDto)
}


/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<Result<UserInfo>> {
  return http.get('/user/detail')
}

/**
 * 用户注册
 * @param userRegisterDto 用户注册信息
 * @returns 用户登录信息
 */
export function register(userRegisterDto: UserRegisterDto): Promise<Result<UserLoginDto>> {
  return http.post('/user/save', userRegisterDto)
}