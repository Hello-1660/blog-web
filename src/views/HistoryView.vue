<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Article } from '@/types/article'
import { getBrowseHistory, deleteBrowseHistory } from '@/apis/user'
import { resultPostProcessor } from '@/utils/result'
import { formatDate } from '@/utils/date'
import showTopTip from '@/components/showTopTip.ts'

const router = useRouter()
const articles = ref<Article[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const selectedIds = ref<Set<number>>(new Set())

const hasMore = computed(() => articles.value.length < total.value)

const fetchHistory = async () => {
  if (loading.value) return
  loading.value = true
  const data = await getBrowseHistory(pageNum.value, pageSize.value)
  resultPostProcessor(data, {
    success: () => {
      total.value = data.data.total
      articles.value = [...articles.value, ...(data.data.data || [])]
    },
    failed: () => showTopTip({ type: 'error', message: '获取浏览记录失败' })
  })
  loading.value = false
}

const handleLoadMore = () => {
  pageNum.value++
  fetchHistory()
}

const handleArticleClick = (id: number) => {
  router.push(`/article/${id}`)
}

const toggleSelect = (id: number) => {
  const s = new Set(selectedIds.value)
  if (s.has(id)) {
    s.delete(id)
  } else {
    s.add(id)
  }
  selectedIds.value = s
}

const handleDelete = async () => {
  if (selectedIds.value.size === 0) return
  const ids = Array.from(selectedIds.value)
  const data = await deleteBrowseHistory(ids)
  resultPostProcessor(data, {
    success: () => {
      articles.value = articles.value.filter(a => !selectedIds.value.has(a.id))
      selectedIds.value = new Set()
      showTopTip({ type: 'success', message: '已删除' })
    },
    failed: () => showTopTip({ type: 'error', message: '删除失败' })
  })
}

onMounted(() => { fetchHistory() })
</script>

<template>
  <div class="history-container">
    <div class="history-header">
      <h2>浏览记录</h2>
      <button @click="handleDelete" :disabled="selectedIds.size === 0" class="history-del-btn">
        删除选中
      </button>
    </div>

    <div class="history-list" v-if="articles.length > 0">
      <div
        v-for="article in articles" :key="article.id"
        class="history-item"
      >
        <div class="history-check">
          <input type="checkbox" :checked="selectedIds.has(article.id)" @change="toggleSelect(article.id)" />
        </div>
        <div class="history-body" @click="handleArticleClick(article.id)">
          <div class="history-title">{{ article.title }}</div>
          <div class="history-time">{{ formatDate(article.createTime) }}</div>
        </div>
      </div>

      <div class="load-more" v-if="hasMore" @click="handleLoadMore">
        {{ loading ? '加载中...' : '—加载更多' }}
      </div>
    </div>

    <div class="history-empty" v-else-if="!loading">
      暂无浏览记录
    </div>
  </div>
</template>

<style scoped>
.history-container {
  width: 100%;
  max-width: 700px;
  margin: 30px auto;
  padding: 0 20px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-header h2 {
  color: var(--font-color);
}

.history-del-btn {
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--show-bgc);
  color: var(--font-color);
  cursor: pointer;
  font-size: 13px;
}

.history-del-btn:hover:not(:disabled) {
  background: var(--hover-bgc);
}

.history-del-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--show-bgc);
  border-radius: 8px;
  transition: background 0.2s;
}

.history-item:hover {
  background: var(--hover-bgc);
}

.history-body {
  flex: 1;
  cursor: pointer;
  min-width: 0;
}

.history-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--font-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-time {
  font-size: 12px;
  color: var(--font-base-color);
  margin-top: 6px;
}

.history-empty {
  text-align: center;
  padding: 60px 0;
  color: var(--font-base-color);
  font-size: 15px;
}

.load-more {
  text-align: center;
  font-size: 14px;
  color: var(--font-base-color);
  padding: 16px 0;
  cursor: pointer;
  user-select: none;
}

.load-more:hover {
  color: var(--font-color);
}
</style>
