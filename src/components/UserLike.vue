<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserLikeArticle } from '@/types/article'
import { getUserLikeArticleList, getUserLikeListById } from '@/apis/user'
import { formatDate } from '@/utils/date'
import { useRouter } from 'vue-router'

const porp = defineProps<{ userId?: number }>()

const router = useRouter()
const articleList = ref<UserLikeArticle[]>([])

const handleLookArticle = (id: number) => { router.push(`/article/${id}`) }

onMounted(async () => {
  const data = porp.userId
    ? await getUserLikeListById(porp.userId)
    : await getUserLikeArticleList()
  articleList.value = data.data
})
</script>

<template>
  <div class="like-container">
    <div class="like-item"
    v-for="item in articleList" :key="item.articleId"
    @click="handleLookArticle(item.articleId)">
      <div class="like-icon"><img :src="item.icon" alt=""></div>
      <div class="like-body">
        <div class="like-title">{{ item.title }}</div>
        <div class="like-time">{{ formatDate(item.createTime) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.like-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.like-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--show-bgc);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.like-item:hover { background: var(--hover-bgc) }
.like-icon { width: 40px; height: 40px; border-radius: 8px; flex-shrink: 0 }
.like-icon>img { width: 100%; height: 100%; border-radius: 8px }
.like-body { flex: 1; min-width: 0 }
.like-title { font-size: 15px; font-weight: 500; color: var(--font-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
.like-time { font-size: 12px; color: var(--font-base-color); margin-top: 6px }
</style>
