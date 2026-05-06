import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { userInfo } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<userInfo | null>(null)
  // token 令牌
  const token = ref('')

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
   * 保存用户数据
   * @param info 用户数据 
   */ 
  const setUserInfo = (info: userInfo) => {
    userInfo.value = info
  }

  /**
   * 清空用户数据
   */
  const clearUserInfo = () => {
    userInfo.value = null
  }

  return {
    userInfo,
    token,
    isLogin,
    setToken,
    setUserInfo,
    clearUserInfo
  }
}, {
  persist: true
})