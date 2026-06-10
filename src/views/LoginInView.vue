<script setup lang="ts">
import { login, register, getRegisterVerificationCode } from '@/apis/user'
import { resultPostProcessor } from '@/utils/result'
import type { UserLoginDto, UserRegisterDto } from '@/types/user'
import { useUserStore } from '@/stores/user'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import showTopTip from '@/components/showTopTip'

// 用户信息存储
const userStore = useUserStore()

// 用户登录信息
const userLoginDto = ref<UserLoginDto>({
  email: '',
  password: ''
})

// 用户注册信息
const userRegisterDto = ref<UserRegisterDto>({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
}) 

// 路由
const router = useRouter()
// 登录注册切换
const isLogin = ref(true)
// 验证码定时器
const verificationCodeTimer = ref<number | null>(null)
const verificationCodeCountDown = ref<number>(60)
const verificationCodeCountDownShow = computed(() => verificationCodeCountDown)
// 登录数据校验
const loginDataVerify = computed(() => {
  return loginRules.email.test(userLoginDto.value.email) && loginRules.password.test(userLoginDto.value.password)
})
// 注册数据校验
const registerDataVerify = computed(() => {
  return registerRules.email.test(userRegisterDto.value.email) 
    && registerRules.password.test(userRegisterDto.value.password) 
    && registerRules.verificationCode.test(userRegisterDto.value.verificationCode)
    && userRegisterDto.value.password === userRegisterDto.value.confirmPassword
})
// 登录校验规则
const loginRules = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^[a-zA-Z0-9]{6,20}$/
}
// 注册数据校验
const registerRules = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^[a-zA-Z0-9]{6,20}$/,
  verificationCode: /^[0-9]{6}$/
}

/**
 * 切换注册
 */
const handleSwitchRegister = () => {
  userRegisterDto.value = { ...userRegisterDto.value, email: '', password: '', confirmPassword: '', verificationCode: '' }
  isLogin.value = false
}

/**
 * 返回登录
 */
const handleReturnLogin = () => {
  isLogin.value = true
}
/**
 * 用户登录
 */
const loginSubmit = async () => {
  if (!loginDataVerify.value) return 
  const result = await login(userLoginDto.value)
  resultPostProcessor(result, {
    success: () => {
      userStore.setUserInfo(result.data)
      userStore.setToken(result.data.token)
      showTopTip({
        message: '登录成功',
        type: 'success',
        duration: 3000
      })
      router.push({ path: '/' })
    },
    failed: () => {
      showTopTip({
        message: result.message,
        type: 'error',
        duration: 3000
      })
    }
  })  
}

/**
 * 用户注册
 */
const registerSubmit = async () => { 
  if (!registerDataVerify.value) return
  // 生成随机昵称
  userRegisterDto.value.nickname = generateRandomNickName()
  const result = await register(userRegisterDto.value)

  if (result.code === 200) {
    userLoginDto.value = result.data
    showTopTip({
      message: '注册成功',
      type: 'success',
      duration: 3000
    })
    isLogin.value = true
    userLoginDto.value.email = userRegisterDto.value.email
    userLoginDto.value.password = userRegisterDto.value.password


  } else {
    showTopTip({
      message: result.message,
      type: 'error',
      duration: 3000
    })
  }
}

/**
 * 获取验证码
 */
const handleGetVerificationCode = async () => {
  if(!registerRules.email.test(userRegisterDto.value.email)) return

  const result = await getRegisterVerificationCode(userRegisterDto.value.email)
  resultPostProcessor(result, {
    success: () => {
      showTopTip({
        message: '验证码发送成功',
        type: 'success',
        duration: 3000
      })
      handleGetVerificationCodeAnimation()
    },
    failed: () => {
      showTopTip({
        message: result.message,
        type: 'error',
        duration: 3000
      })
    }
  })
}

/**
 * 获取验证码动画
 */
const handleGetVerificationCodeAnimation = () => {
  if (verificationCodeTimer.value !== null) return

  verificationCodeCountDown.value--

  verificationCodeTimer.value = setInterval(() => {
    verificationCodeCountDown.value--

    if (verificationCodeCountDown.value <= 0) {
      verificationCodeTimer.value = null
      verificationCodeCountDown.value = 60
    }
  }, 1000)
}

/**
 * 生成随机昵称
 */
const generateRandomNickName = () => {
  const timestamp = Date.now() +  ''
  return '用户' + timestamp.slice(-8)
}
</script>

<template>
  <div class="login-view-container">
    <div class="login-view-box">
      <div class="login-view-box-logo" @click="handleReturnLogin">
        <img class="login-logo-img" src="/logo.png" />
        <div>
          <div>欢迎{{ isLogin ? '登录' : '注册' }}</div>
          <div>使用您的账号{{ isLogin ? '登录' : '注册' }}</div>
        </div>
      </div>

      <div class="login-input-container" v-if="isLogin">
        <div class="login-input-item">
          <input type="text" placeholder="邮箱" v-model="userLoginDto.email">
        </div>

        <div class="login-input-item">
          <input type="password" placeholder="密码" v-model="userLoginDto.password">
        </div>

        <div class="login-input-item login-jump-btn">
          <button class="reset-password-btn">忘记密码?</button>
        </div>

        <div class="login-input-item">
          <button class="submit-btn login-btn" 
          :class="{ 'disable-sub-btn' : !loginDataVerify }"
          :disabled="!loginDataVerify" 
          @click="loginSubmit">登录</button>
        </div>

        <div class="login-input-item" @click="handleSwitchRegister">
          <button class="submit-btn register-btn" :disabled="registerDataVerify">注册新账号</button>
        </div>
      </div>

      <div class="register-input-container" v-else>
        <div class="register-input-item">
          <input type="text" placeholder="邮箱" v-model="userRegisterDto.email">
        </div>

        <div class="register-input-item">
          <input type="password" placeholder="密码" v-model="userRegisterDto.password">
        </div>

        <div class="register-input-item">
          <input type="password" placeholder="确认密码" v-model="userRegisterDto.confirmPassword">
        </div>

        <div class="register-input-item">
          <input type="text" class="register-input-verify-code" placeholder="验证码" v-model="userRegisterDto.verificationCode">
          <button class="submit-btn get-verify-code-btn"
          @click="handleGetVerificationCode"
          :disabled="!registerRules.email.test(userRegisterDto.email)"
          >{{ verificationCodeTimer === null ? '获取验证码' : '请' + verificationCodeCountDownShow.value + '后重试' }}</button>
        </div>

        <div class="register-input-item">
          <button class="submit-btn login-btn" 
          :class="{ 'disable-sub-btn' : !registerDataVerify }"
          @click="registerSubmit"
          :disabled="!registerDataVerify"
          >注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--login-bgc-img) no-repeat center / cover;
}

.login-view-box {
  width: 500px;
  height: 600px;
  background-color: var(--show-bgc);
  border-radius: 10px;
  padding: 10px 70px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-view-box-logo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.login-logo-img {
  width: 70%;
  height: 100px;
  margin: 20px 0;
  user-select: none;
}

.login-view-box-logo>div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.login-view-box-logo>div>div:nth-child(1) { 
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 10px;
}

.login-view-box-logo>div>div:nth-child(2) { 
  font-size: 16px;
  color: gray;
}

.login-input-container,
.register-input-container {
  width: 100%;
}

.login-input-item,
.register-input-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  margin-bottom: 15px;
}

.login-input-item input,
.register-input-item input {
  width: 100%;
  height: 90%;
  border: 1px solid rgba(128, 128, 128, 0.605);
  border-radius: 8px;
  padding: 0 10px;
  font-size: 17px;
}

.register-input-verify-code {
  flex: 7;
}

.reset-password-btn,
.register-btn {
  height: 90%;
  border: none;
  border-radius: 8px;
  background-color: var(--main-color);
  color: #6b94f3;
  font-size: 16px;
}

.login-jump-btn {
  justify-content: right;
  padding-right: 10px;
}

.submit-btn {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  color: #fff;
  font-size: 16px;
  border: none;
}

.get-verify-code-btn {
  flex: 4;
  color: #368ff4;
  margin-left: 10px;
}

.verify-code-btn-sending {
  color: #8ca8eb !important;
}

.login-btn {
  background: linear-gradient(to right, #5286ff, #368ff4);
}

.register-btn {
  background-color: var(--base-bgc);
  color: #4171e1;
}

.disable-sub-btn {
  background: linear-gradient(to right, #aab8d9, #649fe2);
  cursor: not-allowed;
}
</style>