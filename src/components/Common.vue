<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { logout } from '@/apis/token'
import Modal from './Modal.vue'
import SwitchButton from './SwitchButton.vue'

// 用户信息
const userStore = useUserStore()
const user = ref(userStore.userInfo)

// 主题
const isDark = ref(document.documentElement.hasAttribute('data-theme'))
const handleThemeSwitch = (dark: boolean) => {
  isDark.value = dark
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  if (userStore.userInfo) {
    userStore.userInfo.themeId = dark ? 2 : 0
  }
}

// 路由
const router = useRouter()
// 是否显示用户操作
const showUserOption = ref(false)
// 是否在鼠标划入
let isMouseInside: number | null = null
// 是否打开退出登录弹窗
const showLogoutModal = ref(false)
// 搜索关键词
const searchKeyword = ref('')
// 监听鼠标移入
const handleMouseEnter = () => {
  showUserOption.value = true
  if (isMouseInside !== null) clearTimeout(isMouseInside)
}

// 监听鼠标移出
const handleMouseLeave = () => {
  isMouseInside = window.setTimeout(() => {
    showUserOption.value = false
  }, 100)
}

// 跳转到首页
const handleToHome = () => {
  router.push('/home')
}

// 跳转到首页
const handleToIndex = () => {
  router.push('/')
}

// 搜索
const handleSearch = () => {
  const keyword = searchKeyword.value.trim()
  if (!keyword) return
  router.push({ path: '/search', query: { keyword } })
}

/**
 * 查看邮箱
 */
const handleShowEmail = () => {
  router.push('/email')
}

/**
 * 浏览记录
 */
const handleShowHistory = () => {
  router.push('/history')
}

/**
 * 用户登出
 */
const handleLogout = () => {
  showLogoutModal.value = true
}

/**
 * 删除用户数据并退出登录
 */
const deleteUserData = async () => {
  try {
    await logout()
  } catch {
    // 无论如何都清除用户数据
  } finally {
    userStore.clearUserInfo()
    router.push('/login')
  }
}
</script>

<template>
  <div class="common-container">
    <div class="logo" @click="handleToIndex">
      <img src="/logo.png" alt="logo">
    </div>

    <div class="search-bar">
      <form @submit.prevent="handleSearch">
        <input v-model="searchKeyword" type="text" placeholder="搜索作者或文章..." class="search-input">
        <button type="submit" class="search-button">
          <svg t="1781595256263" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4846" width="200" height="200"><path d="M131.41481 765.723624a448.753665 448.753665 0 0 0 492.189377 96.099976 442.97044 442.97044 0 0 0 110.74261-67.429945L951.279266 1011.449171a41.959144 41.959144 0 0 0 30.146599 12.304734 42.451334 42.451334 0 0 0 42.574381-42.574381 42.328286 42.328286 0 0 0-12.304734-30.146599L794.393901 734.223504A448.876712 448.876712 0 0 0 861.331657 273.903389 448.876712 448.876712 0 0 0 273.903635 35.314588 448.261476 448.261476 0 0 0 0.000246 448.630618a447.277097 447.277097 0 0 0 131.414564 317.093006zM85.272056 448.630618A363.358808 363.358808 0 1 1 448.630864 812.112473 363.604903 363.604903 0 0 1 85.272056 448.630618z"  p-id="4847"></path></svg>
        </button>
      </form>
    </div>   

    <div class="theme-switch">
      <SwitchButton :status="isDark" @switch-status="handleThemeSwitch">
        <template #open>
          <svg t="1780000000000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M512 960c-247 0-448-201-448-448s201-448 448-448 448 201 448 448-201 448-448 448z m0-64c212.1 0 384-171.9 384-384s-171.9-384-384-384-384 171.9-384 384 171.9 384 384 384z m-64-512c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v320c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32v-320z m0-128c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32v-64z" fill="currentColor"/></svg>
        </template>
        <template #close>
          <svg t="1780000000000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M512 768c-141.4 0-256-114.6-256-256s114.6-256 256-256 256 114.6 256 256-114.6 256-256 256z m0-64c106 0 192-86 192-192s-86-192-192-192-192 86-192 192 86 192 192 192z m0-640c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-64c0-17.7-14.3-32-32-32z m0 768c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-64c0-17.7-14.3-32-32-32zM256 512c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32z m640 0c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32zM256 256c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32z m640 0c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32zM256 768c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32z m640 0c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32z" fill="currentColor"/></svg>
        </template>
      </SwitchButton>
    </div>

    <div class="user-info">
      <div @click="handleToHome" class="user-icon"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      >
        <img :src="user?.icon" alt="">
        <div class="common-user-option" v-show="showUserOption">
          <div @click.stop="handleLogout">退出登录</div>
          <div @click.stop="handleShowEmail">邮箱</div>
          <div @click.stop="handleShowHistory">浏览记录</div>
        </div>
      </div>
    </div>

    <Modal :visible="showLogoutModal" title="退出登录" @close="showLogoutModal = false">
      <div>
        <p>退出登录后，您将需要重新登录</p>
        <div class="modal-logout-button"> 
          <button class="logout-sure-button" @click="deleteUserData">确定</button>
          <button class="logout-cancel-button" @click="showLogoutModal = false">取消</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.common-container {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  width: 100%;
  height: 70px;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--show-bgc);
}

.logo {
  width: 80px;
  height: 40px;
  margin-left: 20px;
}

.logo > img {
  width: 100%;
  height: 100%;
}

.search-bar {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.search-bar form {
  display: flex;
  align-items: center;
  width: 400px;
  height: 36px;
  padding: 0 10px;
  border-radius: 16px;
  box-shadow:  0 1px 6px 0 #20212447;
  padding-left: 20px;
  background-color: #fff;
}

.search-bar input {
  width: calc(100% - 45px);
  height: 100%;
  font-size: 16px;
}

.search-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.search-bar .icon {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  fill: var(--font-color);
}

.theme-switch {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.theme-switch .icon {
  fill: var(--font-base-color);
}

.user-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 30px;
}

.user-icon>img {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.common-user-option {
  position: absolute;
  top: 65px;
  right: 10px;
  z-index: 200;
  width: 80px;
  padding: 5px;
  background-color:var(--show-bgc);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.common-user-option::after {
  content: '';
  position: absolute;
  top: -10px;
  right: calc(50% - 10px);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid var(--show-bgc);
}

.common-user-option > div {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  user-select: none;
  border-bottom: 1px solid var(--font-color);
}

.common-user-option > div:hover {
  background-color: var(--hover-bgc); 
}

.common-user-option > div:last-child {
  border-bottom: none;
}

.modal-logout-button {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.logout-sure-button,
.logout-cancel-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
}

.logout-sure-button {
  background-color: #ff4d4f;
  color: #fff;
}

.logout-cancel-button {
  background-color: #ccc;
  color: #333;
}
</style>