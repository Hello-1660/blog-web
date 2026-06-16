<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { logout } from '@/apis/token'
import Modal from './Modal.vue'

// 用户信息
const userStore = useUserStore()
// 获取用户信息
const user = ref(userStore.userInfo)
// 路由
const router = useRouter()
// 是否显示用户操作
const showUserOption = ref(false)
// 是否在鼠标划入
let isMouseInside: number | null = null
// 是否打开退出登录弹窗
const showLogoutModal = ref(false)
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
    <div class="logo" @click="handleToIndex">blog</div>
    <div class="user-info">
      <div @click="handleToHome" class="user-icon"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      >
        <img :src="user?.icon" alt="">
        <div class="common-user-option" v-show="showUserOption">
          <div @click.stop="handleLogout">退出登录</div>
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
}

.logo {
  flex: 1;
  background-color: yellow;
}

.user-info {
  flex: 3;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: pink;
}

.user-icon {
  width: 40px;
  height: 40px;
  background-color: lightblue;
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