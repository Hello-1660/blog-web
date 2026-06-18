<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { likeArticle } from '@/apis/user'
import { getArticleMsg } from '@/apis/article'
import showTopTip from '@/components/showTopTip'
import FavoriteSelector from './FavoriteSelector.vue'
import type { ArticleMsgVo } from '@/types/article.js';

const props = defineProps<{
  articleId: number
}>()

const articleMsg = ref<ArticleMsgVo>()
const isLiked = ref(false)
const isBookmarked = computed(() => (articleMsg.value?.favoriteIdList?.length ?? 0) > 0)
const showFavorite = ref(false)
const showComment = ref(false)
const emit = defineEmits(['open-comment'])

async function fetchArticleMsg() {
  const result = await getArticleMsg(props.articleId)
  if (result.code === 200 && result.data) {
    articleMsg.value = result.data
    isLiked.value = result.data.liked || false
  }
}

onMounted(() => fetchArticleMsg())

async function handleLike() {
  try {
    await likeArticle(props.articleId)

    if (articleMsg.value?.likedNum) {
      if (isLiked.value) {
        articleMsg.value.likedNum = articleMsg.value.likedNum - 1
      } else {
        articleMsg.value.likedNum = articleMsg.value.likedNum + 1
      }
    }

    isLiked.value = !isLiked.value
    showTopTip.success(isLiked.value ? '已点赞' : '已取消点赞')
  } catch {
    showTopTip.error('操作失败')
  }
}

function handleComment() {
  // 预留评论功能
  showComment.value = !showComment.value
  emit('open-comment', showComment.value)
}

function handleBookmark() {
  showFavorite.value = true
}
</script>

<template>
  <div class="action-bar">
    <div class="action-item" :class="{ 'action-item--active': isLiked }" @click="handleLike">
      <svg t="1" class="action-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <path d="M512 896c-9.6 0-19.2-3.2-25.6-9.6-12.8-9.6-275.2-230.4-384-377.6C64 460.8 32 409.6 32 348.8 32 217.6 134.4 128 268.8 128c67.2 0 131.2 28.8 179.2 80 9.6 9.6 19.2 22.4 28.8 35.2 12.8-12.8 22.4-25.6 35.2-38.4C556.8 156.8 620.8 128 684.8 128 822.4 128 928 217.6 928 348.8c0 60.8-35.2 112-73.6 163.2-105.6 147.2-368 364.8-380.8 374.4-6.4 6.4-16 9.6-25.6 9.6" :fill="isLiked ? '#ff4d4f' : 'currentColor'" p-id="4104"></path>
      </svg>
      <span class="action-label">点赞{{ articleMsg?.likedNum }}</span>
    </div>

    <div class="action-item" @click="handleComment">
      <svg t="1" class="action-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <path d="M896 128H128c-35.2 0-64 28.8-64 64v512c0 35.2 28.8 64 64 64h224l128 160c6.4 9.6 19.2 9.6 25.6 0l128-160h224c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64z m0 576H672c-6.4 0-12.8 3.2-16 6.4L544 857.6c-3.2 6.4-9.6 6.4-12.8 0L419.2 710.4c-3.2-6.4-9.6-6.4-16-6.4H128V192h768v512z" fill="currentColor" p-id="5215"></path>
      </svg>
      <span class="action-label">评论{{ articleMsg?.commentNum }}</span>
    </div>

    <div class="action-item" :class="{ 'action-item-favority-active': isBookmarked }" @click="handleBookmark">
      <svg t="1" class="action-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <path d="M256 128h512a85.333333 85.333333 0 0 1 85.333333 85.333333v682.666667a42.666667 42.666667 0 0 1-64.426666 37.973333L512 765.184l-276.906667 168.789333A42.666667 42.666667 0 0 1 170.666667 896V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333z" fill="currentColor"></path>
      </svg>
      <span class="action-label">收藏</span>
    </div>

    <FavoriteSelector 
    :visible="showFavorite" 
    :articleId="articleId" 
    :favoriteIdList="articleMsg?.favoriteIdList || []" 
    @close="showFavorite = false; fetchArticleMsg()" />
  </div>
</template>

<style scoped>
.action-bar {
  position: fixed;
  top: 50%;
  right: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  z-index: 100;
  border: 2px solid #000;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--font-base-color);
  transition: color 0.2s;
}

.action-item:hover {
  background-color: var(--hover-bgc);
  color: var(--font-color);
}

.action-item--active {
  color: #ff4d4f;
}

.action-item--active:hover {
  color: #ff4d4f;
}

.action-item-favority-active {
  color: #fcb720;
}

.action-item-favority-active:hover {
  color: #fcb720;
}

.action-icon {
  display: block;
}

.action-label {
  font-size: 12px;
  user-select: none;
}
</style>
