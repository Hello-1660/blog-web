import type { Result } from '@/types/api'
import axios from 'axios'
import { useUserStore } from '@/stores/user'


/**
 * 创建 axios 实例 
 */
const http = axios.create({
  baseURL: '/api',
  timeout: 10000
})

/**
 * axios 请求拦截器
 */
http.interceptors.request.use(
  config => {
    const userStore = useUserStore()

    if (userStore.isLogin) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  e => Promise.reject(e)
)

/**
 * axios 响应拦截器
 */
http.interceptors.response.use(
  response => {
    const res: Result<unknown> = response.data

    return response.data
  },
  e => Promise.reject(e)
)


export default http