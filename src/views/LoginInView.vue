<script setup lang="ts">
import { login, getUserInfo } from '@/apis/user'
import type { userLoginDto, userInfo } from '@/types/user'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

// 用户信息存储
const userStore = useUserStore()

// 用户登录信息
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
    <div class="login-container">
      <div class="login-box"> 
        <div class="login-title">登录</div>
        
        <fieldset class="input-border" :class="{ 'has-value': userLoginDto.email }">
          <legend>邮箱</legend>
          <input type="text" v-model="userLoginDto.email">
        </fieldset>

        <fieldset class="input-border" :class="{ 'has-value': userLoginDto.password }">
          <legend>密码</legend>
          <input type="password" v-model="userLoginDto.password">
        </fieldset>

        <div class="input-button">
          <button class="login-button" @click="handleLogin">登录</button>
        </div>
      </div>
    </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-image: url('/login.png');
}

.login-box {
  width: 500px;
  height: 500px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
 
.login-title {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin: 80px 0;
  color: #333;
  user-select: none;
}

.input-border { 
  position: relative;
  margin: 20px;
  padding: 10px;
  border: 1.5px solid #40404095;
  border-radius: 4px;
  padding: 0 10px;
  transition: border-color 0.3s;
}

.input-border > legend {
  position: absolute;
  top: -17px; 
  left: 7px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  margin-left: 10px;
  transform: translateY(30px);
  transition: all 0.3s ease;
  user-select: none;
}

.input-border:focus-within > legend,
.input-border.has-value > legend {
  position: static;
  transform: translate(0);
  font-size: 12px;
  width: auto;
  padding: 0 8px;
  margin-left: -2px;
  color: #333;
}

.input-border > input {
  height: 45px;
  width: 100%;
  padding: 0 10px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
}

.input-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 60px 20px 0 20px;
}

.input-button > button { 
  width: 80%;
  height: 50px;
  background: transparent;
  border: none;
  border-radius: 25px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  color: #3333339c;
  font-size: 16px;
}

.input-button > button:hover { 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  color: #333;
  cursor: pointer;
}
</style>