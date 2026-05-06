<script setup lang="ts">
import { login, getUserInfo } from '@/apis/user'
import type { userLoginDto, userInfo } from '@/types/user'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const userStore = useUserStore()
const userLoginDto = ref<userLoginDto>({
  email: '',
  password: '',
})

/**
 * 用户登录
 */
const handleLogin = async () => {
  if (!(userLoginDto.value.email && userLoginDto.value.password)) return 

  const result = await login(userLoginDto.value)

  console.log(result.data)
  userStore.setToken(result.data)
}
</script>

<template> 
  <!-- <form> -->
    <input v-model="userLoginDto.email" type="text" placeholder="邮箱"></input>
    <input v-model="userLoginDto.password" type="password" placeholder="密码"></input>
    <button @click="handleLogin">登录</button>
  <!-- </form> -->
</template>

<style scoped>

</style>