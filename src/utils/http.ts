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
let refreshTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 解码 JWT 获取过期时间（秒）
 */
function getTokenExp(access: string): number | null {
  try {
    const payload = JSON.parse(atob(access.split('.')[1]))
    return payload.exp ?? null
  } catch {
    return null
  }
}

/**
 * 定时无感刷新——在过期前 5 分钟自动刷新
 */
function scheduleTokenRefresh(access: string) {
  clearRefreshTimer()
  const exp = getTokenExp(access)
  if (!exp) return
  const delay = (exp - Date.now() / 1000 - 5 * 60) * 1000
  if (delay <= 0) return
  refreshTimer = setTimeout(() => {
    silentRefresh()
  }, delay)
}

function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

/**
 * 静默刷新 token（无 401 触发时主动调用）
 */
async function silentRefresh() {
  if (isRefreshing || !refreshTokenStr) return
  isRefreshing = true
  try {
    const result = await refreshTokenApi(refreshTokenStr)
    if (result.code === 200 && result.data) {
      const newToken = result.data.token
      if (newToken) {
        accessToken = newToken
        const userStore = useUserStore()
        userStore.setToken(newToken)
        scheduleTokenRefresh(newToken)
      }
    }
  } catch {
    // 静默刷新失败不处理，等下次 401 触发手动刷新
  } finally {
    isRefreshing = false
  }
}

/**
 * 设置令牌（登录成功后调用）
 */
export function setTokens(access: string, refresh: string) {
  accessToken = access
  refreshTokenStr = refresh
  scheduleTokenRefresh(access)
}

/**
 * 从持久化存储恢复令牌（页面刷新后调用）
 */
export function restoreTokens(access: string, refresh: string) {
  if (access) {
    accessToken = access
    scheduleTokenRefresh(access)
  }
  if (refresh) refreshTokenStr = refresh
}

/**
 * 清除令牌
 */
function clearTokens() {
  accessToken = null
  refreshTokenStr = null
  clearRefreshTimer()
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
 * 响应拦截器——统一处理 code 和 HTTP 状态码
 */
http.interceptors.response.use(
  async response => {
    const res: Result<unknown> = response.data

    // 控制器直接返回的 401（HTTP 200，body.code=401），如 TokenController 的刷新/登出
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
    const status = error.response?.status
    const data = error.response?.data as Result<unknown> | undefined

    // HTTP 401 —— 安全层或异常处理器返回的 401
    if (status === 401) {
      if (isRefreshRequest(error.config)) {
        handleLogout()
        return Promise.reject(new Error(data?.message || '登录已过期'))
      }
      return handleRefreshAndRetry(error.config)
    }

    // HTTP 403 / 400 / 500 等 —— 透传 body 中的 Result，保持调用方兼容
    if (data && typeof data.code === 'number') {
      return data
    }

    return Promise.reject(error)
  }
)

/**
 * 无感刷新 token 并重试原请求
 */
async function handleRefreshAndRetry(config: InternalAxiosRequestConfig) {
  const userStore = useUserStore()

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
        userStore.setToken(newToken)
        scheduleTokenRefresh(newToken)
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
