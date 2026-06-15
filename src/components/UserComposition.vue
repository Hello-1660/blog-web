<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Article } from '@/types/article'
import { getArticleList } from '@/apis/user'
import { deleteArticle } from '@/apis/article'
import { formatDateTime } from '@/utils/date'
import { useRouter } from 'vue-router'
import { stripHtml } from '@/utils/editor'
import FunctionList from '@/components/FunctionList.vue'
import Modal from '@/components/Modal.vue'
import showTopTip from '@/components/showTopTip.ts'

// 路由
const router = useRouter()
// 用户作品列表
const articleList = ref<Article[]>([])
// 删除确认弹窗
const showDeleteModal = ref(false)
const deleteTargetId = ref<number | null>(null)



/**
 * 查看文章
 * @param id 文章编号
 */
const handleLookArticle = (id: number) => {
  router.push(`/article/${id}`)
}

/**
 * 添加文章
 */
const handleAddArticle = () => {
  router.push('/article/edit')
}

/**
 * 更新文章
 * @param id 文章编号
 */
const handleUpdateArticle = (id: number) => {
  router.push({ name: 'articleEdit', params: { id: id } })
}

/**
 * 删除文章
 * @param id 文章编号
 */
const handleDeleteArticle = (id: number) => {
  deleteTargetId.value = id
  showDeleteModal.value = true
}

/**
 * 确认删除文章
 */
const handleConfirmDelete = async () => {
  if (deleteTargetId.value == null) return
  try {
    await deleteArticle(deleteTargetId.value)
    articleList.value = articleList.value.filter(a => a.id !== deleteTargetId.value)
    showTopTip.success('删除成功')
  } catch {
    showTopTip.error('删除失败')
  } finally {
    showDeleteModal.value = false
    deleteTargetId.value = null
  }
}

const handleMouseEnter = (el: MouseEvent) => {
  const target = el.currentTarget as HTMLElement
  target.classList.add('article-item-show-function')
}

const handleMouseLeave = (el: MouseEvent) => {
  const target = el.currentTarget as HTMLElement
  target.classList.remove('article-item-show-function')
}

onMounted(async () => {
  const date = await getArticleList()
  articleList.value = date.data
})
</script>

<template>
  <div class="composition-container">
    <div class="article-add" @click="handleAddArticle">
      <svg t="1779762682734" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6633" width="200" height="200"><path d="M896 480a32 32 0 0 1 32 32v384a32 32 0 0 1-32 32H512a32 32 0 1 1 0-64h352V512a32 32 0 0 1 32-32z m-128-384a32 32 0 0 1 32 32v640a32 32 0 0 1-32 32H128a32 32 0 0 1-32-32V128a32 32 0 0 1 32-32h640z m-32 64h-576v576h576v-576z m-285.952 128a32 32 0 0 1 32 32v98.048H576a32 32 0 0 1 31.488 26.24l0.512 5.76a32 32 0 0 1-32 32H482.048V576a32 32 0 0 1-26.24 31.488l-5.76 0.512a32 32 0 0 1-32-32V482.048H320a32 32 0 0 1-31.488-26.24l-0.512-5.76a32 32 0 0 1 32-32h98.048V320a32 32 0 0 1 26.24-31.488z" p-id="6634"></path></svg>
    </div>

    <div class="article-item" 
    v-for="article in articleList" 
    :key="article.id"
    @click="handleLookArticle(article.id)"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    >
    <FunctionList 
    class="function-list"
    :type="{ del: true, update: true }"
    :id="article.id"
    @update-click="handleUpdateArticle"
    @del-click="handleDeleteArticle"
    />
      <div class="article-icon">
        <img :src="article.icon" alt="">
      </div>
      <div class="article-show">
        <div class="article-body">
          <div class="article-detail">
            <div class="article-title"> {{ article.title }} </div>
            <div class="article-status"  v-if="article.status === 0">
              <svg t="1778815413389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6471" width="200" height="200"><path d="M506.047171 560.671465c0-9.184365 7.426863-16.611228 16.582881-16.611228 9.184365 0 16.611228 7.426863 16.611228 16.611228v185.218027c0 9.184365-7.426863 16.611228-16.611228 16.611228-9.156018 0-16.582881-7.426863-16.582881-16.611228v-185.218027z m-252.258222-199.958366v-71.263869c0-73.928469 30.246041-141.167091 78.9742-189.866902 48.699812-48.728159 115.938434-78.9742 189.866903-78.9742 73.956815 0 141.195438 30.246041 189.89525 78.9742 48.728159 48.699812 78.9742 115.938434 78.9742 189.866902v71.263869h-33.194109v-71.263869c0-64.77245-26.504263-123.677112-69.251246-166.424094-42.718636-42.718636-101.623298-69.222899-166.424095-69.222899-64.77245 0-123.677112 26.504263-166.395748 69.222899-42.746983 42.746983-69.251246 101.651644-69.251246 166.424094v71.263869H253.788949z m-32.173624-16.611228h602.057801c25.795593 0 49.238401 10.545012 66.246484 27.524748 16.979736 17.008083 27.524748 40.450891 27.524748 66.246485v463.130107c0 25.795593-10.545012 49.238401-27.524748 66.246484-17.008083 16.979736-40.450891 27.524748-66.246484 27.524749H221.615325c-25.795593 0-49.238401-10.545012-66.246484-27.524749-16.979736-17.008083-27.524748-40.450891-27.524748-66.246484V437.873104c0-25.795593 10.545012-49.238401 27.524748-66.246485 17.008083-16.979736 40.450891-27.524748 66.246484-27.524748z m602.057801 33.19411H221.615325c-16.639575 0-31.776769 6.83158-42.775329 17.801793-10.970214 10.998561-17.801794 26.135755-17.801794 42.77533v463.130107c0 16.639575 6.83158 31.776769 17.801794 42.77533 10.998561 10.970214 26.135755 17.801794 42.775329 17.801793h602.057801c16.639575 0 31.776769-6.83158 42.775329-17.801793 10.970214-10.998561 17.801794-26.135755 17.801794-42.77533V437.873104c0-16.639575-6.83158-31.776769-17.801794-42.77533-10.998561-10.970214-26.135755-17.801794-42.775329-17.801793z" p-id="6472"></path></svg>
            </div>
          </div>
          <div class="article-content"> {{ stripHtml(article.content).trim() }} </div>
        </div>
      
        <div class="article-footer">
          <div class="article-time"> {{ formatDateTime(article.createTime) }} </div>
        </div>
      </div>
    </div>
  </div>

  <Modal :visible="showDeleteModal" title="删除作品" @close="showDeleteModal = false">
    <div class="delete-confirm">
      <p>确定要删除该作品吗？删除后无法恢复。</p>
      <div class="delete-confirm-footer">
        <button class="btn-cancel" @click="showDeleteModal = false">取消</button>
        <button class="btn-confirm" @click="handleConfirmDelete">确定删除</button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.composition-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px; 
}

.article-add {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 300px;
  background-color: var(--show-bgc);
  transition: transform 0.3s;
}

.article-add>.icon {
  width: 40px;
  height: 40px;
  fill: var(--font-color)
}

.article-add:hover {
  transform: scale(1.05);
}

.article-item {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 300px;
  border-radius: 4px;
  background-color: var(--show-bgc);
  user-select: none;
  transition: transform 0.3s;
}

.article-item:hover {
  transform: scale(1.05);
}

.article-item-show-function>.function-list {
  display: flex;
}

.function-list {
  display: none;
}

.article-icon {
  width: 100% !important;
  height: 170px;
  padding: 5px;
}

.article-icon > img {
  width: 100%;
  height: 100%;
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
  white-space: nowrap;
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

.delete-confirm {
  min-width: 280px;
}

.delete-confirm p {
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.6;
}

.delete-confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-cancel {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background-color: var(--hover-bgc);
  color: var(--font-color);
  font-size: 13px;
  cursor: pointer;
}

.btn-confirm {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background-color: #e74c3c;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.btn-confirm:hover {
  background-color: #c0392b;
}
</style>