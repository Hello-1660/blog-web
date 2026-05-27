<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleById } from '@/apis/article'
import type { Article, ArticleDto } from '@/types/article'
import EditorBox from './EditorBox.vue'

// 文章对象
class ArticleObj { 
    id: number
    userId: number
    icon: string
    title: string
    content: string
    createTime: string
    updateTime: string
    sort: number
    status: number
    categoryId: number

    constructor() {
        this.id = -1
        this.userId = -1
        this.icon = ''
        this.title = ''
        this.content = ''
        this.createTime = ''
        this.updateTime = ''
        this.sort = 0
        this.status = 0
        this.categoryId = -1
    }
}

// 路由
const route = useRoute()
// 是否为新增文章
const isNew = ref(true)
// 文章
const article = ref<Article>(new ArticleObj())

onMounted(async () => {
  const id =  route.params.id
  if (id) {
    const data = await getArticleById(parseInt(id as string, 10))
    article.value = data.data
    isNew.value = false
  }
})
</script>

<template>
  <div class="article-edit-container"> 
    <div class="article-edit-title">
      <input class="article-edit-title-input" type="text" placeholder="请输入文章标题" v-model="article.title">
    </div>

    <div class="article-edit-content">
      <EditorBox></EditorBox>
    </div>
  </div>
</template>

<style scoped>
.article-edit-container {
  width: 70%;
  background-color: var(--box-bgc);
  padding: 50px;
}

.article-edit-title {
  --edit-title-font-size: 50px;
  width: 100%;
  height: 120px;
}

.article-edit-title-input {
  width: 100%;
  height: 100%;
  font-size: var(--edit-title-font-size);
}

.article-edit-title-show {
  font-size: 45px;
  letter-spacing: -1px;
}
</style>