<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ArticleSearchVo, ArticleSearchDto } from '@/types/article'
import { searchArticle } from '@/apis/article'
import showTopTip from '@/components/showTopTip'

// 路由
const route = useRoute()
const router = useRouter()

// 搜索关键词
const keyword = ref((route.query.keyword as string) || '')

// 搜索结果
const searchList = ref<ArticleSearchVo[]>([])
// 搜索结果总数
const total = ref(0)

// 加载状态
const loading = ref(false)

// 分页
const pageNum = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)

/**
 * 执行搜索
 */
const doSearch = async (reset: boolean = false) => {
  if (reset) {
    pageNum.value = 1
    hasMore.value = true
  }

  const kw = keyword.value.trim()
  if (!kw) {
    searchList.value = []
    total.value = 0
    return
  }

  loading.value = true
  try {
    const params: ArticleSearchDto = {
      userNickname: '',
      title: kw,
      categoryId: 0,
      createTime: '',
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      status: 1,
    }
    const result = await searchArticle(params)
    if (result.code === 200) {
      const page = result.data
      const records = page.data ?? []
      if (reset) {
        searchList.value = records
      } else {
        searchList.value.push(...records)
      }
      total.value = page.total ?? 0
      hasMore.value = searchList.value.length < (page.total ?? 0)
    }
  } catch {
    showTopTip.error('搜索失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 查看文章详情
 */
const handleLookArticle = (id: number) => {
  router.push(`/article/${id}`)
}

/**
 * 加载更多
 */
const handleLoadMore = () => {
  pageNum.value++
  doSearch(false)
}

// 监听路由 keyword 变化，重新搜索
watch(
  () => route.query.keyword,
  (val) => {
    keyword.value = (val as string) || ''
    doSearch(true)
  }
)

onMounted(() => {
  doSearch(true)
})
</script>

<template>
  <div class="article-search-container">
    <!-- 搜索关键词标题 -->
    <div class="search-header" v-if="keyword">
      <h2>搜索：<span class="search-keyword">{{ keyword }}</span></h2>
      <span class="search-count" v-if="total">共 {{ total }} 个结果</span>
    </div>

    <!-- 空搜索提示 -->
    <div class="search-empty" v-if="!keyword">
      <svg t="1781595256263" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4846" width="200" height="200"><path d="M131.41481 765.723624a448.753665 448.753665 0 0 0 492.189377 96.099976 442.97044 442.97044 0 0 0 110.74261-67.429945L951.279266 1011.449171a41.959144 41.959144 0 0 0 30.146599 12.304734 42.451334 42.451334 0 0 0 42.574381-42.574381 42.328286 42.328286 0 0 0-12.304734-30.146599L794.393901 734.223504A448.876712 448.876712 0 0 0 861.331657 273.903389 448.876712 448.876712 0 0 0 273.903635 35.314588 448.261476 448.261476 0 0 0 0.000246 448.630618a447.277097 447.277097 0 0 0 131.414564 317.093006zM85.272056 448.630618A363.358808 363.358808 0 1 1 448.630864 812.112473 363.604903 363.604903 0 0 1 85.272056 448.630618z" p-id="4847"></path></svg>
      <p>输入关键词搜索文章或作者</p>
    </div>

    <!-- 无结果 -->
    <div class="search-empty" v-else-if="!loading && searchList && searchList.length === 0">
      <p>未找到与 "<span class="search-keyword">{{ keyword }}</span>" 相关的文章</p>
    </div>

    <!-- 文章列表 -->
    <div class="search-list" v-else>
      <div
        class="search-item"
        v-for="item in searchList"
        :key="item.id"
        @click="handleLookArticle(item.id)"
      >
        <div class="search-item-icon">
          <img :src="item.icon" alt="文章封面" />
        </div>
        <div class="search-item-body">
          <div class="search-item-title">{{ item.title }}</div>
          <div class="search-item-meta">
            <span class="search-item-author">{{ item.userNickName }}</span>
            <span class="search-item-time">{{ item.createTime }}</span>
          </div>
        </div>
      </div>

      <!-- 加载更多 / 没有更多 -->
      <div class="search-more">
        <button
          v-if="hasMore"
          class="search-more-btn"
          :disabled="loading"
          @click="handleLoadMore"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
        <span v-else class="search-more-end">— 没有更多了 —</span>
      </div>
    </div>

    <!-- 加载中（首次） -->
    <div class="search-loading" v-if="loading && searchList && searchList.length === 0">
      <p>搜索中...</p>
    </div>
  </div>
</template>

<style scoped>
.article-search-container {
  width: 100%;
  padding: 30px 0;
  min-height: 200px;
}

.search-header {
  margin-bottom: 24px;
}

.search-header h2 {
  font-size: 22px;
  font-weight: 500;
  color: var(--font-color);
  margin: 0;
}

.search-keyword {
  color: #d81e06;
}

.search-count {
  font-size: 14px;
  color: var(--font-base-color);
  margin-top: 6px;
  display: inline-block;
}

/* 空状态 */
.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: var(--font-base-color);
  font-size: 16px;
}

.search-empty .icon {
  width: 48px;
  height: 48px;
  fill: var(--font-base-color);
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 文章列表 */
.search-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--show-bgc);
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.search-item:hover {
  transform: translateX(6px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-item-icon {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 20px;
}

.search-item-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-item-body {
  flex: 1;
  min-width: 0;
}

.search-item-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--font-color);
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-item-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: var(--font-base-color);
}

.search-item-author {
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-item-time {
  white-space: nowrap;
}

/* 加载中（首次） */
.search-loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
  color: var(--font-base-color);
  font-size: 14px;
}

/* 加载更多 */
.search-more {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.search-more-btn {
  padding: 8px 32px;
  border: 1px solid var(--font-base-color);
  border-radius: 20px;
  background-color: transparent;
  color: var(--font-color);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.search-more-btn:hover:not(:disabled) {
  background-color: var(--hover-bgc);
  border-color: var(--font-color);
}

.search-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-more-end {
  font-size: 14px;
  color: var(--font-base-color);
}
</style>
