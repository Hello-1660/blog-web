<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserLikeArticle } from '@/types/article'
import { getUserLikeArticleList } from '@/apis/user'
import { formatDate } from '@/utils/date'

// 用户喜欢列表
const articleList = ref<UserLikeArticle[]>([])


onMounted(async () => {
  const date = await getUserLikeArticleList()
  articleList.value = date.data
})
</script>

<template>
  <div class="like-container">
    <div class="like-item" v-for="item in articleList" :key="item.articleId">
      <div class="like-icon"></div>
      <div class="like-title">{{ item.title }}</div>
      <div class="like-option">
        <div class="like-time">{{ formatDate(item.likeTime) }}</div>
        <div class="like-start">
          <svg t="1779264402062" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8164" width="200" height="200"><path d="M959.165 127.999c-103.551-107.387-276.137-103.551-383.523-3.835-107.387-99.715-279.972-103.551-383.523 3.835-241.619 245.454 118.892 613.637 352.84 755.54 11.506 3.835 19.176 7.671 30.682 7.671 11.506 0 19.176-3.835 26.847-7.671 237.785-141.903 598.296-510.085 356.676-755.54zM729.050 197.033c0-19.176 15.34-26.847 30.682-30.682 80.54-7.671 145.738 61.363 157.244 130.398v0c3.835 19.176-7.671 30.682-23.012 34.517-11.506 0-26.847-7.671-30.682-23.012-19.176-49.858-49.858-84.375-107.387-84.375-15.34 0-26.847-15.34-26.847-26.847z" p-id="8165"></path></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.like-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px; 
}

.like-item {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 300px;
  border-radius: 4px;
  user-select: none;
  padding: 10px 0;
  background-color: var(--box-bgc);
}

.like-item:hover {
  background-color: var(--box-hover-bgc);
}

.like-icon {
  width: 100%;
  height: 200px;
}

.like-title {
  font-size: 24px;
  font-weight: 400;
  margin: 10px;
}

.like-option {
  flex: 1;
  display: flex;
  justify-content: right;
  align-items: center;
  padding-right: 10px;
}

.like-time {
  font-size: 14px;
  font-weight: 400;
  color: rgb(117, 117, 117);
}

.like-start {
  margin-left: 10px;
  cursor: pointer;
}

.icon {
  width: 20px;
  height: 20px;
  fill: #d81e06
}
</style>