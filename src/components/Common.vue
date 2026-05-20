<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

// 用户信息
const userStore = useUserStore()
// 获取用户信息
const user = ref(userStore.userInfo)
// 路由
const router = useRouter()

// 跳转到首页
const handleToHome = () => {
  router.push('/home')
}

// 跳转到首页
const handleToIndex = () => {
  router.push('/')
}
</script>

<template>
  <div class="common-container">
    <div class="logo" @click="handleToIndex">blog</div>
    <div class="user-info">
      <div @click="handleToHome" class="user-icon">
        {{ user?.icon }}
      </div>
    </div>
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
  margin-right: 20px;
}
</style>