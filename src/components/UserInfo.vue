<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 用户信息
const userStore = useUserStore()
const userInfo = ref(userStore.userInfo)

const computedUserInfo = computed(() => {
  return {
    nickname: userInfo.value?.nickname || '请先登录',
    email: userInfo.value?.email || '',
    description: userInfo.value?.description || '',
    createTime: userInfo.value?.createTime || '',
    likeShowStatus: userInfo.value?.likeShowStatus || 0
  }
})

/**
 * 用户修改信息
 */
const handleUserUpdate = () => {
  router.push('/user/update')
}
</script>

<template>
  <div class="user-container">
    <div class="user-head-box">
      <div class="user-icon" @click="handleUserUpdate">
        <img :src="userInfo?.icon" alt="">
      </div>

      <div class="user-account">
        <div class="user-name">{{ computedUserInfo.nickname }}</div>
        <div class="user-email">{{ computedUserInfo.email }}</div>
      </div>
    </div>

    <div class="user-select">
      <router-link to="/home/composition">作品</router-link>
      <router-link to="/home/favorite">收藏</router-link>
      <router-link to="/home/like">喜欢</router-link>
    </div>

    <div class="user-select-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.user-container {
  width: 100%;
  height: 100%;
  padding: 20px;
} 

.user-head-box {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 280px;
}

.user-icon { 
  width: 200px;
  height: 200px;
  border-radius: 50%; 
  margin: 20px 100px 20px 20px;
}

.user-icon>img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-account {
  flex: 1;
}

.user-name {
  font-size: 70px;
  font-weight: 400;
  color: #333;
  font-family: 'LocalSerif' !important;
  font-weight: 200; 
  margin-bottom: 10px;
  user-select: none;
}

.user-email {
  font-size: 20px;
  font-weight: 400;
  color: #333;
  font-family: 'LocalSerif' !important;
  font-weight: 200;
  user-select: none;
}

.user-select {
  display: flex;
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
  user-select: none;  
}

.user-select>a {
  flex: 1;
  font-size: 15px;
  text-align: center;
  font-weight: 200;
  color: #aeaeae;
}

.user-select a.router-link-active {
  color: #000;
  font-size: 700;
}
</style>