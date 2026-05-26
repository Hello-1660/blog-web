<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Article } from '@/types/article'
import { getArticleList } from '@/apis/user'
import { formatDateTime } from '@/utils/date'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()
// 用户作品列表
const articleList = ref<Article[]>([])

/**
 * 查看文章
 * @param id 文章编号
 */
const handleLookArticle = (id: number) => {
  router.push(`/article/${id}`)
}

onMounted(async () => {
  const date = await getArticleList()
  articleList.value = date.data
})
</script>

<template>
  <div class="composition-container">
    <div class="article-item" 
    v-for="article in articleList" 
    :key="article.id"
    @click="handleLookArticle(article.id)"
    >
      <div class="article-icon"></div>
      <div class="article-show">
        <div class="article-body">
          <div class="article-detail">
            <div class="article-title"> {{ article.title }} </div>
            <div class="article-status"  v-if="article.status === 0">
              <svg t="1778815413389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6471" width="200" height="200"><path d="M506.047171 560.671465c0-9.184365 7.426863-16.611228 16.582881-16.611228 9.184365 0 16.611228 7.426863 16.611228 16.611228v185.218027c0 9.184365-7.426863 16.611228-16.611228 16.611228-9.156018 0-16.582881-7.426863-16.582881-16.611228v-185.218027z m-252.258222-199.958366v-71.263869c0-73.928469 30.246041-141.167091 78.9742-189.866902 48.699812-48.728159 115.938434-78.9742 189.866903-78.9742 73.956815 0 141.195438 30.246041 189.89525 78.9742 48.728159 48.699812 78.9742 115.938434 78.9742 189.866902v71.263869h-33.194109v-71.263869c0-64.77245-26.504263-123.677112-69.251246-166.424094-42.718636-42.718636-101.623298-69.222899-166.424095-69.222899-64.77245 0-123.677112 26.504263-166.395748 69.222899-42.746983 42.746983-69.251246 101.651644-69.251246 166.424094v71.263869H253.788949z m-32.173624-16.611228h602.057801c25.795593 0 49.238401 10.545012 66.246484 27.524748 16.979736 17.008083 27.524748 40.450891 27.524748 66.246485v463.130107c0 25.795593-10.545012 49.238401-27.524748 66.246484-17.008083 16.979736-40.450891 27.524748-66.246484 27.524749H221.615325c-25.795593 0-49.238401-10.545012-66.246484-27.524749-16.979736-17.008083-27.524748-40.450891-27.524748-66.246484V437.873104c0-25.795593 10.545012-49.238401 27.524748-66.246485 17.008083-16.979736 40.450891-27.524748 66.246484-27.524748z m602.057801 33.19411H221.615325c-16.639575 0-31.776769 6.83158-42.775329 17.801793-10.970214 10.998561-17.801794 26.135755-17.801794 42.77533v463.130107c0 16.639575 6.83158 31.776769 17.801794 42.77533 10.998561 10.970214 26.135755 17.801794 42.775329 17.801793h602.057801c16.639575 0 31.776769-6.83158 42.775329-17.801793 10.970214-10.998561 17.801794-26.135755 17.801794-42.77533V437.873104c0-16.639575-6.83158-31.776769-17.801794-42.77533-10.998561-10.970214-26.135755-17.801794-42.775329-17.801793z" p-id="6472"></path></svg>
            </div>
          </div>
          <div class="article-content"> {{ article.content }} </div>
        </div>
      
        <div class="article-footer">
          <div class="article-time"> {{ formatDateTime(article.createTime) }} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.composition-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px; 
}

.article-item {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 300px;
  border-radius: 4px;
  background-color: var(--box-bgc);
  user-select: none;
}

.article-item:hover {
  background-color: var(--box-hover-bgc);
}

.article-icon {
  width: 100% !important;
  height: 450px;
}

.article-show {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
}

.article-body {
  flex: 1;
}

.article-detail {
  display: flex;
  justify-content: start;
}

.article-title {
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 10px;
}

.article-status {
  font-size: 15px;
  font-weight: 200;
  margin-left: 10px;
  padding-top: 10px;
}

.icon {
  width: 20px;
  height: 20px;
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