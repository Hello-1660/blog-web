<script setup lang="ts">
import { login, register, getUserInfo } from '@/apis/user'
import { resultPostProcessor } from '@/utils/result'
import type { UserLoginDto, UserRegisterDto, UserInfo } from '@/types/user'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import TopTip from '@/components/TopTip.vue'
import { useRouter } from 'vue-router'

// 用户信息存储
const userStore = useUserStore()

// 用户登录信息
const userLoginDto = ref<UserLoginDto>({
  email: '',
  password: '',
})

// 用户注册信息
const userRegisterDto = ref<UserRegisterDto>({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
}) 

// 登录框
const loginRef = ref<null | HTMLDivElement>(null)
// 注册框
const registerRef = ref<null | HTMLDivElement>(null)

// 当前容器类型
type boxType = 'login' | 'register'
const currentBox = ref<boxType>('login')

// 提示信息
const tipMessage = ref('')
const tipShow = ref(false)

// 路由
const router = useRouter()

/**
 * 用户登录
 */
const loginSubmit = async () => {
  if (!(userLoginDto.value.email && userLoginDto.value.password)) return 
  const result = await login(userLoginDto.value)
  resultPostProcessor(result, {
    success: () => {
      userStore.setUserInfo(result.data)
      userStore.setToken(result.data.token)

      tipMessage.value = result.message
      tipShow.value = true

      router.push({ path: '/' })
    },
    failed: () => {
      console.error(result.message)
    }
  })  
}

/**
 * 用户注册
 */
const registerSubmit = async () => { 
  if (!(userRegisterDto.value.nickname && userRegisterDto.value.email && userRegisterDto.value.password && userRegisterDto.value.confirmPassword)) return
  const result = await register(userRegisterDto.value)

  if (result.code === 200) {
    userLoginDto.value = result.data

    tipMessage.value = result.message
    tipShow.value = true

    switchAnimation()
  } else {
    console.error(result.message)
  }
}



// 切换动画 
const switchAnimation = () => {
  if (loginRef.value === null || registerRef.value === null) return
  
  console.log('switchAnimation')

  if (currentBox.value === 'login') {
    loginRef.value.classList.add('switch-move')

    setTimeout(() => {
      loginRef.value!.style.zIndex = '1'
      registerRef.value!.style.zIndex = '2'
    }, 500)    

    setTimeout(() => {
      loginRef.value!.classList.remove('switch-move')
    }, 1000)

    currentBox.value = 'register'
  } else {
    registerRef.value.classList.add('switch-move')

    setTimeout(() => {
      loginRef.value!.style.zIndex = '2'
      registerRef.value!.style.zIndex = '1'
    }, 500)    

    setTimeout(() => {
      registerRef.value!.classList.remove('switch-move')
    }, 1000)

    currentBox.value = 'login'
  }
}
</script>

<template>
  <TopTip 
  v-model:visible="tipShow"
  :message="tipMessage"
  :duration="2000"
  />

  <div class="login-container">
    <div class="container-box">
      <div class="login-box" ref="loginRef">
        <div class="switch" @click="switchAnimation()">
          <svg t="1778202752502" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8274" width="200" height="200"><path d="M770.838418 638.472192a497.782383 497.782383 0 0 0-139.763691-66.177376 312.501736 312.501736 0 0 0 71.436808-52.274182c58.93994-57.533614 91.468385-134.035484 91.468385-215.396612s-32.562745-157.874432-91.456951-215.385179-137.305479-89.181675-220.667479-89.181675-161.773272 31.625194-220.667478 89.181675-91.399783 134.035484-91.399783 215.408046 32.459843 157.862998 91.399783 215.396612a312.730407 312.730407 0 0 0 71.539711 52.33135q-18.933956 5.602439-37.44487 12.668371a485.502752 485.502752 0 0 0-152.96944 93.229151c-44.430768 40.143187-79.348824 86.975-103.782316 139.169147A401.317538 401.317538 0 0 0 0.251578 988.750371c0 19.437032 16.167037 35.249629 36.107145 35.249629s36.107145-15.778296 36.107145-35.249629c0-202.522437 183.657083-367.302732 409.389622-367.302732 90.32503 0 175.916571 25.862686 247.593484 74.798272a36.678822 36.678822 0 0 0 50.307612-8.689497 34.723686 34.723686 0 0 0-8.918168-49.084222z m-528.847333-333.859604c0-129.107625 107.601121-234.136198 239.864405-234.136198s239.864405 105.028573 239.864406 234.136198-107.601121 234.147631-239.864406 234.147631-239.864405-105.040006-239.864405-234.136197zM989.447858 830.418597h-90.67947v-90.679469a34.300644 34.300644 0 0 0-68.601289 0v90.679469h-90.668036a34.403546 34.403546 0 0 0-34.300644 34.300645 34.403546 34.403546 0 0 0 34.300644 34.300644h90.668036v90.67947a34.300644 34.300644 0 0 0 68.601289 0V899.019886h90.67947a34.403546 34.403546 0 0 0 34.300644-34.300644 34.403546 34.403546 0 0 0-34.300644-34.300645z" p-id="8275" ></path></svg>
          去注册  
        </div>

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
          <button class="login-button" @click="loginSubmit">登录</button>
        </div>
      </div>

      <div class="register-box" ref="registerRef" >
        <div class="switch"@click="switchAnimation()">
          <svg t="1778203678718" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9621" width="200" height="200"><path d="M 925.072 866.338 c -22.55 -58.665 -54.879 -111.396 -96.079 -156.727 c -41.419 -45.572 -89.732 -81.389 -143.598 -106.458 a 428.81 428.81 0 0 0 -31.037 -12.991 c 23.153 -13.107 44.673 -29.438 63.998 -48.763 c 56.076 -56.076 86.959 -130.633 86.959 -209.936 s -30.881 -153.86 -86.959 -209.936 s -130.634 -86.959 -209.937 -86.959 s -153.86 30.883 -209.937 86.959 c -56.076 56.078 -86.959 130.633 -86.959 209.936 s 30.883 153.86 86.959 209.936 c 19.325 19.325 40.846 35.655 63.997 48.763 a 429.898 429.898 0 0 0 -31.037 12.991 c -53.866 25.068 -102.179 60.884 -143.598 106.458 c -41.202 45.332 -75.248 97.431 -96.08 156.727 c -17.385 49.481 -15.568 98.351 -16.45 121.174 h 69.838 C 142.848 824.515 297.84 633.689 508.42 633.689 c 210.579 0 369.644 197.809 370.256 353.823 h 69.837 c -1.243 -44.114 -0.159 -60.62 -23.438 -121.174 Z M 281.379 331.462 c 0 -125.188 101.85 -227.038 227.039 -227.038 c 125.188 0 227.039 101.85 227.039 227.038 S 633.606 558.5 508.418 558.5 c -125.189 0 -227.039 -101.85 -227.039 -227.038 Z" p-id="9622"></path></svg>          
          去登录  
        </div>

        <div class="register-title">注册</div>

        <fieldset class="input-border" :class="{ 'has-value': userRegisterDto.email }">
          <legend>邮箱</legend>
          <input type="text" v-model="userRegisterDto.email">
        </fieldset>

         <fieldset class="input-border" :class="{ 'has-value': userRegisterDto.nickname }">
          <legend>昵称</legend>
          <input type="text" v-model="userRegisterDto.nickname">
        </fieldset>

        <fieldset class="input-border" :class="{ 'has-value': userRegisterDto.password }">
          <legend>密码</legend>
          <input type="password" v-model="userRegisterDto.password">
        </fieldset>

         <fieldset class="input-border" :class="{ 'has-value': userRegisterDto.confirmPassword }">
          <legend>确认密码</legend>
          <input type="password" v-model="userRegisterDto.confirmPassword">
        </fieldset>

        <div class="input-button register-button">
          <button class="login-button" @click="registerSubmit">注册</button>
        </div>
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

.container-box {
  --cbw: 520;
  --cbh: 520;
  position: relative;
  width: calc(var(--cbw) * 1px);
  height: calc(var(--cbh) * 1px);
  overflow: hidden;
}

.login-box,
.register-box {
  position: absolute;
  top: 10px;
  left: 10px;
  width: calc((var(--cbw) - 20) * 1px); 
  height: calc((var(--cbh) - 20) * 1px); 
  padding-top: 80px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.082);
  animation: none;
  backdrop-filter: blur(10px);
}

.login-box {
  z-index: 2;
}

 .register-box {
  z-index: 1;
  padding-top: 30px
}

.switch {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #dbdbdb;
  user-select: none;
}

.switch:hover .icon {
  fill: #333;
}

.switch:hover {
  color: #333;
  cursor: pointer;
}

.icon {
  fill: #dbdbdb;
  width: 20px;
  height: 20px;
}

.login-title,
.register-title {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 80px;
  color: #333;
  user-select: none;
}

.register-title {
  margin-bottom: 30px;
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

.register-button {
  padding-top: 10px;
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

.switch-move { 
  animation: switch-animation 1s ease-in-out forwards;
}

@keyframes switch-animation {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-110%);
  }

  100% {
    transform: translateX(0);
  }
}
</style>