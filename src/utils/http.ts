import type { Result } from '@/types/api'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import type { InternalAxiosRequestConfig } from 'axios'
import { useRouter } from 'vue-router'
import { refreshToken as refreshTokenApi } from '@/apis/token'

const router = useRouter()

// Token storage
let accessToken: string | null = null
let refreshTokenStr: string | null = null

// Refresh state
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

/**
 * 设置令牌（登录成功后调用）
 */
export function setTokens(access: string, refresh: string) {
  accessToken = access
  refreshTokenStr = refresh
}

/**
 * 从持久化存储恢复令牌（页面刷新后调用）
 */
export function restoreTokens(access: string, refresh: string) {
  if (access) accessToken = access
  if (refresh) refreshTokenStr = refresh
}

/**
 * 清除令牌
 */
function clearTokens() {
  accessToken = null
  refreshTokenStr = null
}

/**
 * 创建 axios 实例
 */
const http = axios.create({
  baseURL: '/api',
  timeout: 10000
})

/**
 * 请求拦截器——附加 Authorization 头
 */
http.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    // 如果已有预设的 Authorization 头则不覆盖，留给 refresh 调用自行设置
    if (userStore.isLogin && accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  e => Promise.reject(e)
)

/**
 * 响应拦截器——处理 401 并无感刷新 token
 */
http.interceptors.response.use(
  async response => {
    const res: Result<unknown> = response.data

    if (res.code === 401) {
      if (isRefreshRequest(response.config)) {
        handleLogout()
        return Promise.reject(new Error('登录已过期'))
      }
      return handleRefreshAndRetry(response.config)
    }

    return response.data
  },
  async error => {
    // HTTP 401（安全层直接拒绝，如 JWT 过期）
    if (error.response?.status === 401) {
      if (isRefreshRequest(error.config)) {
        handleLogout()
        return Promise.reject(new Error('登录已过期'))
      }
      return handleRefreshAndRetry(error.config)
    }
    return Promise.reject(error)
  }
)

/**
 * 无感刷新 token 并重试原请求
 */
async function handleRefreshAndRetry(config: InternalAxiosRequestConfig) {
  if (!refreshTokenStr) {
    handleLogout()
    return Promise.reject(new Error('缺少 refresh token'))
  }

  // 已有刷新进行中，加入等待队列
  if (isRefreshing) {
    return new Promise(resolve => {
      pendingRequests.push((newToken: string) => {
        config.headers.Authorization = `Bearer ${newToken}`
        resolve(http.request(config))
      })
    })
  }

  isRefreshing = true
  try {
    const result = await refreshTokenApi(refreshTokenStr)

    if (result.code === 200 && result.data) {
      const data = result.data
      const newToken = data.token
      if (newToken) {
        accessToken = newToken
      }

      // 重试排队的请求
      pendingRequests.forEach(cb => cb(accessToken!))
      pendingRequests = []

      // 重试当前请求
      config.headers.Authorization = `Bearer ${accessToken}`
      return http.request(config)
    }

    handleLogout()
    return Promise.reject(new Error('刷新 token 失败'))
  } catch {
    handleLogout()
    return Promise.reject(new Error('刷新 token 失败'))
  } finally {
    isRefreshing = false
    pendingRequests = []
  }
}

/**
 * 清除登录状态并跳转
 */
function handleLogout() {
  const userStore = useUserStore()
  userStore.clearUserInfo()
  clearTokens()
  router.push('/login')
}

/**
 * 是否为刷新 token 的请求
 */
function isRefreshRequest(config: InternalAxiosRequestConfig): boolean {
  return config.url?.includes('/token/refresh') ?? false
}

export default http
