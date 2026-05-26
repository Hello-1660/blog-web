<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ArticleVo } from '@/types/article'
import { getArticleById } from '@/apis/article'
import { formatDate } from '@/utils/date'

// 路由
const router = useRouter()
// 文章
const article = ref<ArticleVo>()

onMounted(async () => {
  if (router.currentRoute.value.params.id) {
    const id = parseInt(router.currentRoute.value.params.id as string, 10)
    if (isNaN(id)) router.push('/')

    const data = await getArticleById(id)
    article.value = data.data

    if (article.value.userId) {

    }
  }
})
</script>

<template>
  <div class="article-view-container" v-if="article">
    <h1 class="article-view-title">{{ article.title }}</h1>
    <div class="article-view-author">
      <div class="article-view-user-icon"></div>
      <div class="article-view-user">
        <div class="article-view-username">{{ article.userNickname }}</div>
        <div class="article-create-time">{{ formatDate(article.createTime) }}</div>
      </div>
    </div>

    <div class="article-view-body" v-html="article.content"></div>
    <div class="article-view-function">
    </div>
  </div>
</template>

<style scoped>
.article-view-container {
  width: 70%;
  height: 100%;
  padding: 30px 20px;
  background-color: var(--box-bgc);
}

.article-view-title {
  font-size: 40px;
  font-weight: 500;
  text-align: left;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin-bottom: 20px;
}

.article-view-author {
  display: flex;
  justify-content: start;
  align-items: start;
  margin-bottom: 50px;
}

.article-view-user {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-left: 10px;
}

.article-view-user-icon {
  width: 40px;
  height: 40px;
  background-color: yellow;
  border-radius: 50%; 
}

.article-view-username {
  max-width: 200px;
  font-size: 16px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-create-time {
  color: gray;
  font-size: 12px;
}

.article-view-function {
  position: fixed;
  width: 60px;
  height: 60px;
  bottom: 68px;
  right: 120px;
  border-radius: 50%;
  background-color: red;
}
</style>