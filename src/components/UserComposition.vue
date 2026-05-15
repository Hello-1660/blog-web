<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Article } from '@/types/article'
import { getArticleList } from '@/apis/user'
import { formatDate } from '@/utils/date'

// 用户作品列表
const articleList = ref<Article[]>([])

onMounted(async () => {
  const date = await getArticleList()
  articleList.value = date.data
})
</script>

<template>
  <div class="article-item" v-for="article in articleList" :key="article.id">
    <div class="article-icon"></div>
    <div class="article-show">
      <div class="article-body">
        <div class="article-title"> {{ article.title }} </div>
        <div class="article-content"> {{ article.content }} </div>
      </div>
    
      <div class="article-footer">
        <div class="article-time"> {{ formatDate(article.createTime) }} </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-item {
  display: flex;
  width: 100%;
  height: 150px;
  margin-bottom: 5px;
  user-select: none;
}

.article-item:hover {
  background-color: #f5f5f5;
}

.article-icon {
  width: 250px;
  height: 100%;
}

.article-show {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: 20px;
}

.article-body {
  flex: 1;
}

.article-title {
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 10px;
}

.article-content {
  font-size: 15px;
  font-weight: 200;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-footer {
  width: 250px;
  height: 20px;
  margin-top: 10px;
}

.article-time {
  --time-font-height: 20px;
  width: 80%;
  height: var(--time-font-height);
  line-height: var(--time-font-height);
  text-align: left;
  color: #8e8e8e;
}
</style>