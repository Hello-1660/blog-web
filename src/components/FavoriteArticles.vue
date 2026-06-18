<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Article } from '@/types/article'
import { getFavoriteArticles } from '@/apis/favorite'
import { stripHtml } from '@/utils/editor'
import { formatDate } from '@/utils/date'

const props = defineProps<{
  favoriteId: number
  favoriteName: string
  isOwner?: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'removeArticle', articleId: number): void
  (e: 'removeAll'): void
}>()

const router = useRouter()
const articles = ref<Article[]>([])
const loading = ref(false)

watch(() => props.favoriteId, (id) => {
  if (id) fetchArticles()
}, { immediate: true })

async function fetchArticles() {
  loading.value = true
  try {
    const res = await getFavoriteArticles(props.favoriteId)
    articles.value = res.data || []
  } finally {
    loading.value = false
  }
}

function handleLookArticle(id: number) {
  router.push(`/article/${id}`)
}
</script>

<template>
  <div class="favorite-articles">
    <div class="favorite-articles-header">
      <div class="back-btn" @click="emit('back')">
        <svg t="1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
          <path d="M384 512l256-256 256 256" stroke="currentColor" stroke-width="64" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="rotate(180 512 384)"></path>
        </svg>
        <span>返回收藏夹</span>
      </div>
      <div class="header-info">
        <span class="favorite-title">{{ favoriteName }}</span>
        <span class="article-count">{{ articles.length }} 篇文章</span>
      </div>
      <div class="remove-all-btn" @click="emit('removeAll')" v-if="isOwner && articles.length > 0">
        <svg t="1781249770705" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M781.28 851.36a58.56 58.56 0 0 1-58.56 58.56H301.28a58.72 58.72 0 0 1-58.56-58.56V230.4h538.56z m-421.6-725.92a11.84 11.84 0 0 1 12-12h281.28a11.84 11.84 0 0 1 12 12V160H359.68zM956.8 160H734.72v-34.56a81.76 81.76 0 0 0-81.76-81.76H371.68a82.08 82.08 0 0 0-81.76 81.76V160H67.2a35.36 35.36 0 0 0 0 70.56h105.12v620.8a128.96 128.96 0 0 0 128.96 128.96h421.44a128.96 128.96 0 0 0 128.96-128.96V230.4H956.8a35.2 35.2 0 0 0 35.2-35.2 34.56 34.56 0 0 0-35.2-35.2zM512 804.16a35.2 35.2 0 0 0 35.2-35.36V393.92a35.2 35.2 0 1 0-70.4 0V768.8a35.2 35.2 0 0 0 35.2 35.36m-164.32 0a35.36 35.36 0 0 0 35.36-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a36.32 36.32 0 0 0 35.2 35.36m328.64 0a35.36 35.36 0 0 0 35.2-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a35.36 35.36 0 0 0 35.36 35.36" fill="currentColor"></path>
        </svg>
        <span>清空</span>
      </div>
    </div>

    <div class="favorite-articles-grid" v-if="articles.length > 0">
      <div
        class="favorite-article-item"
        v-for="article in articles"
        :key="article.id"
      >
        <div class="article-main" @click="handleLookArticle(article.id)">
          <div class="article-icon" v-if="article.icon">
            <img :src="article.icon" alt="" />
          </div>
          <div class="article-info">
            <div class="article-title">{{ article.title }}</div>
            <div class="article-preview">{{ stripHtml(article.content).trim() }}</div>
            <div class="article-time">{{ formatDate(article.createTime) }}</div>
          </div>
        </div>
        <div v-if="isOwner" class="article-remove" @click.stop="emit('removeArticle', article.id)">
          <svg t="1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
            <path d="M810.666667 273.066667L750.933333 213.333333 512 452.266667 273.066667 213.333333 213.333333 273.066667 452.266667 512 213.333333 750.933333 273.066667 810.666667 512 571.733333 750.933333 810.666667 810.666667 750.933333 571.733333 512z" fill="currentColor"></path>
          </svg>
        </div>
      </div>
    </div>

    <div class="favorite-empty" v-else>
      收藏夹中暂无文章
    </div>
  </div>
</template>

<style scoped>
.favorite-articles-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--hover-bgc);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--font-base-color);
  font-size: 14px;
}

.back-btn:hover {
  color: var(--font-color);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.favorite-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--font-color);
}

.article-count {
  font-size: 13px;
  color: var(--font-base-color);
}

.remove-all-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: var(--font-base-color);
}

.remove-all-btn:hover {
  background-color: var(--hover-bgc);
  color: #ff4d4f;
}

.favorite-articles-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.favorite-article-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--show-bgc);
}

.article-main {
  display: flex;
  flex: 1;
  cursor: pointer;
  min-width: 0;
}

.article-icon {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 12px;
}

.article-icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-info {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--font-color);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.article-preview {
  font-size: 13px;
  color: var(--font-base-color);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.article-time {
  font-size: 12px;
  color: var(--font-base-color);
}

.article-remove {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--font-base-color);
  flex-shrink: 0;
  margin-left: 8px;
}

.article-remove:hover {
  background-color: var(--hover-bgc);
  color: #ff4d4f;
}

.favorite-empty {
  text-align: center;
  padding: 60px 0;
  color: var(--font-base-color);
  font-size: 14px;
}
</style>
