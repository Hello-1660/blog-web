import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)
  // access token 令牌
  const token = ref('')
  // refresh token 令牌
  const refreshToken = ref('')

  // 是否登录
  const isLogin = computed(() => !!token.value)

  /**
   * 设置用户令牌
   * @param t 令牌
   */
  const setToken = (t: string) => {
    token.value = t
  }

  /**
   * 设置 refresh token
   * @param t refresh token
   */
  const setRefreshToken = (t: string) => {
    refreshToken.value = t
  }

  /**
   * 保存用户数据
   * @param info 用户数据 
   */ 
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  /**
   * 清空用户数据
   */
  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
    refreshToken.value = ''
  }

  return {
    userInfo,
    token,
    refreshToken,
    isLogin,
    setToken,
    setRefreshToken,
    setUserInfo,
    clearUserInfo
  }
}, {
  persist: true
})