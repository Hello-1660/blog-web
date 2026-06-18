<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserById, getUserMsg, subscribeUser, getSubscribeList } from '@/apis/user'
import type { UserVo, UserMsgVo } from '@/types/user'
import { resultPostProcessor } from '@/utils/result'
import { formatDate } from '@/utils/date'
import showTopTip from '@/components/showTopTip.ts'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userId = computed(() => Number(route.params.id))
const userInfo = ref<UserVo | null>(null)
const userMsg = ref<UserMsgVo | null>(null)
const isFollowing = ref(false)
const followLoading = ref(false)

const isSelf = computed(() => {
  const token = userStore.token
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!))
    return parseInt(payload.sub) === userId.value
  } catch { return false }
})

const computedUserInfo = computed(() => ({
  nickname: userInfo.value?.nickname || '',
  email: userInfo.value?.email || '',
  description: userInfo.value?.description || '',
  createTime: userInfo.value?.createTime || '',
  icon: userInfo.value?.icon || '',
}))

const fetchUser = async () => {
  const [infoData, msgData] = await Promise.all([
    getUserById(userId.value),
    getUserMsg(userId.value)
  ])
  resultPostProcessor(infoData, {
    success: () => { userInfo.value = infoData.data }
  })
  resultPostProcessor(msgData, {
    success: () => { userMsg.value = msgData.data }
  })
}

const checkFollowStatus = async () => {
  if (isSelf.value || !userStore.isLogin) return
  const data = await getSubscribeList()
  resultPostProcessor(data, {
    success: () => {
      isFollowing.value = data.data.some(s => s.subUserId === userId.value)
    }
  })
}

const handleFollow = async () => {
  if (!userStore.isLogin) { router.push('/login'); return }
  if (followLoading.value) return
  followLoading.value = true
  const data = await subscribeUser(userId.value)
  resultPostProcessor(data, {
    success: () => {
      isFollowing.value = !isFollowing.value
      showTopTip({ type: 'success', message: isFollowing.value ? '已关注' : '已取消关注' })
    },
    failed: () => showTopTip({ type: 'error', message: '操作失败' })
  })
  followLoading.value = false
}

onMounted(async () => {
  await fetchUser()
  await checkFollowStatus()
})
</script>

<template>
  <div class="user-container" v-if="userInfo">
    <div class="user-head-box">
      <div class="user-icon">
        <img :src="computedUserInfo.icon" alt="">
      </div>

      <div class="user-account">
        <div class="user-name">{{ computedUserInfo.nickname }}</div>
        <div class="user-identify" v-if="userMsg?.userIdentifyVo" v-alt="userMsg.userIdentifyVo.description">
          <svg v-if="userMsg.userIdentifyVo.typeValue === '蓝标'" t="1781680214396" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15616" width="200" height="200"><path d="M228.817 256.652h563.945v563.944H228.817z" fill="#FFFFFF" p-id="15617"></path><path d="M955.392 630.69v137.124l-119.156 68.329L768 955.206H631.343l-119.064 68.329-118.504-68.33H256.652l-68.608-119.062-119.157-68.33V630.692L0.372 512l68.33-118.69V256.185l119.155-68.7 68.33-118.599h137.122L512.186 0l118.97 68.887H768l68.329 118.598 119.063 68.701V393.31L1023.721 512l-68.329 118.69z m-189.44-315.577h-170.17v36.864c0 10.891 5.213 17.5 15.64 19.735l3.164 0.652 6.703 1.675 10.24 2.607-90.392 235.147c-7.26 18.619-13.125 39.843-17.966 64.047a696.785 696.785 0 0 0-9.31-34.257 400.756 400.756 0 0 0-10.24-29.79l-90.67-235.333c3.724-0.745 7.075-1.77 10.054-2.42l6.516-1.583 3.166-0.652c10.333-2.234 15.639-8.75 15.639-19.642v-36.957H278.342v36.957c0 10.892 5.213 17.408 15.64 19.642l4.002 0.652 9.123 1.582 18.06 3.258 158.906 392.844h76.52l158.72-392.844 17.874-3.258c4.468-0.744 7.54-1.21 9.123-1.582l3.817-0.652c10.612-2.234 15.825-8.75 15.732-19.642l0.186-37.143z" fill="#08A5FA" p-id="15618"></path></svg>
          <svg v-if="userMsg.userIdentifyVo.typeValue === '黄标'" t="1781680273033" class="icon" style="transform:scale(1.09);" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16835" width="200" height="200"><path d="M252.416 277.930667h516.949333v516.949333H252.416z" fill="#FFFFFF" p-id="16836"></path><path d="M918.442667 620.8v125.696l-109.226667 62.634667-62.549333 109.141333H621.397333l-109.141333 62.634667-108.629333-62.634667H277.930667L215.04 809.130667 105.813333 746.496V620.8L43.008 512l62.634667-108.8V277.504l109.226666-62.976 62.805334-108.8h125.696L512.170667 42.666667l109.056 63.146666h125.44l62.634666 108.714667 109.141334 62.976v125.696L981.077333 512l-62.634666 108.8z m-173.653334-289.28H588.8v33.792c0 9.984 4.778667 16.042667 14.336 18.090667l2.816 0.597333 6.144 1.536 9.386667 2.389333-82.858667 215.552c-6.656 17.066667-12.032 36.522667-16.469333 58.709334a638.72 638.72 0 0 0-8.533334-31.402667 367.36 367.36 0 0 0-9.386666-27.306667l-83.114667-215.722666c3.413333-0.682667 6.485333-1.621333 9.216-2.218667l5.973333-1.450667 2.901334-0.597333c9.472-2.048 14.336-8.021333 14.336-18.005333v-33.877334H297.813333v33.877334c0 9.984 4.778667 15.957333 14.336 18.005333l3.669334 0.597333 8.362666 1.450667 16.554667 2.986667L486.4 748.629333h70.144l145.493333-360.106666 16.384-2.986667c4.096-0.682667 6.912-1.109333 8.362667-1.450667l3.498667-0.597333c9.728-2.048 14.506667-8.021333 14.421333-18.005333l0.170667-34.048z" fill="#FACA08" p-id="16837"></path></svg>
          <span>{{ userMsg.userIdentifyVo.name }}</span>
        </div>
        <div>
          <div class="user-line">
            <div>关注<span>{{ userMsg?.subscribeNum || 0 }}</span></div>
            <div>粉丝<span>{{ userMsg?.fansNum || 0 }}</span></div>
          </div>
          <div class="user-follow" v-if="!isSelf && userStore.isLogin">
            <button
              class="follow-btn"
              :class="{ 'follow-btn--active': isFollowing }"
              @click="handleFollow"
              :disabled="followLoading"
            >
              {{ isFollowing ? '已关注' : '+ 关注' }}
            </button>
          </div>
        </div>
        <div class="user-description">{{ computedUserInfo.description }}</div>
      </div>
    </div>

    <div class="user-select">
      <router-link :to="`/user/${userId}/composition`">作品</router-link>
      <router-link :to="`/user/${userId}/favorite`">收藏</router-link>
      <router-link :to="`/user/${userId}/like`">喜欢</router-link>
    </div>

    <div class="user-select-view">
      <router-view v-slot="{ Component }">
        <component :is="Component" :user-id="userId" />
      </router-view>
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
.user-account > div {
  margin-bottom: 15px;
}
.user-name {
  font-size: 40px;
  font-weight: 400;
  color: var(--font-color);
  font-family: 'LocalSerif' !important;
  font-weight: 200;
  user-select: none;
}
.user-identify {
  display: flex;
  justify-self: start;
  align-items: center;
  height: 20px;
  user-select: none;
}
.user-identify > span {
  height: 100%;
  line-height: 18px;
  margin-left: 5px;
}
.user-line {
  display: flex;
  justify-content: start;
}
.user-line>div {
  width: 100px;
  color: var(--font-base-color) !important;
}
.user-line>div>span {
  margin-left: 10px;
  color: var(--font-color)
}
.user-follow {
  margin-top: 10px;
}
.follow-btn {
  padding: 6px 24px;
  border: 1px solid #1890ff;
  border-radius: 20px;
  background: transparent;
  color: #1890ff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.follow-btn:hover:not(:disabled) {
  background: #1890ff;
  color: #fff;
}
.follow-btn--active {
  background: #1890ff;
  color: #fff;
}
.follow-btn--active:hover:not(:disabled) {
  background: #ff4d4f;
  border-color: #ff4d4f;
}
.follow-btn:disabled {
  opacity: 0.6;
  cursor: default;
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
