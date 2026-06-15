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
        <div class="user-line">
          <div>关注<span>{{ 2 }}</span></div>
          <div>粉丝<span>{{ 3 }}</span></div>
        </div>
        <div class="user-email">{{ computedUserInfo.email }}</div>
        <div class="user-description">{{ computedUserInfo.description }}</div>
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
  align-items: start;
  width: 100%;
  height: 200px;
  margin-bottom: 80px;
}

.user-icon { 
  width: 200px !important;
  height: 200px !important;
  border-radius: 50%; 
  /* background: pink !important; */
}

.user-icon>img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-account {
  width: calc(100% - 250px);
  margin-left: 50px;
}

.user-name {
  font-size: 40px;
  font-weight: 400;
  color: #333;
  font-family: 'LocalSerif' !important;
  font-weight: 200; 
  margin-bottom: 10px;
  user-select: none;
}

.user-line {
  display: flex;
  justify-content: start;
  margin-bottom: 10px;
}

.user-line>div {
  width: 100px;
  color: var(--font-base-color) !important;
}

.user-line>div>span {
  margin-left: 10px;
  color: var(--font-color)
}

.user-email {
  font-size: 20px;
  font-weight: 400;
  color: var(--font-color);
  font-family: 'LocalSerif' !important;
  font-weight: 200;
  user-select: none;
  margin-bottom: 10px;
}

.user-description {
  font-size: 15px;
  font-weight: 400;
  color: var(--font-color);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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