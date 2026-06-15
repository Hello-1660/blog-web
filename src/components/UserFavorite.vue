<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Favorite } from '@/types/favorite'
import { getFavoriteList, deleteFavorite, removeArticleFromFavorite, removeAllArticlesFromFavorite } from '@/apis/favorite'
import { formatDate } from '@/utils/date'
import showTopTip from '@/components/showTopTip'
import FunctionList from '@/components/FunctionList.vue'
import EditFavoriteModal from '@/components/EditFavoriteModal.vue'
import FavoriteArticles from '@/components/FavoriteArticles.vue'
import Modal from '@/components/Modal.vue'

const favoriteList = ref<Favorite[]>([])
const showEditModal = ref(false)
const editingFavorite = ref<Favorite | null>(null)
const selectedFavorite = ref<Favorite | null>(null)
const articlesRefreshKey = ref(0)
// 删除确认弹窗
const showDeleteModal = ref(false)
const deleteTarget = ref<Favorite | null>(null)

onMounted(async () => {
  await fetchList()
})

async function fetchList() {
  const data = await getFavoriteList()
  favoriteList.value = data.data || []
}

function handleAdd() {
  editingFavorite.value = null
  showEditModal.value = true
}

function handleEdit(id: number) {
  const fav = favoriteList.value.find(f => f.id === id)
  if (fav) {
    editingFavorite.value = fav
    showEditModal.value = true
  }
}

function handleDelete(id: number) {
  const fav = favoriteList.value.find(f => f.id === id)
  if (!fav) return
  deleteTarget.value = fav
  showDeleteModal.value = true
}

async function handleConfirmDelete() {
  if (!deleteTarget.value) return
  try {
    await deleteFavorite(deleteTarget.value.id)
    showTopTip.success(`收藏夹「${deleteTarget.value.name}」已删除`)
    showDeleteModal.value = false
    deleteTarget.value = null
    await fetchList()
  } catch {
    showTopTip.error('删除失败')
  }
}

function handleViewFavorite(fav: Favorite) {
  selectedFavorite.value = fav
}

function handleBack() {
  selectedFavorite.value = null
  fetchList()
}

async function handleRemoveArticle(articleId: number) {
  if (!selectedFavorite.value) return
  try {
    await removeArticleFromFavorite(selectedFavorite.value.id, articleId)
    showTopTip.success('已移除')
    articlesRefreshKey.value++
  } catch {
    showTopTip.error('移除失败')
  }
}

async function handleRemoveAll() {
  if (!selectedFavorite.value) return
  try {
    await removeAllArticlesFromFavorite(selectedFavorite.value.id)
    showTopTip.success('已清空')
    articlesRefreshKey.value++
  } catch {
    showTopTip.error('操作失败')
  }
}

// hover 控制 FunctionList 显示
const handleMouseEnter = (el: MouseEvent) => {
  const target = el.currentTarget as HTMLElement
  target.classList.add('favorite-item-show-function')
}

const handleMouseLeave = (el: MouseEvent) => {
  const target = el.currentTarget as HTMLElement
  target.classList.remove('favorite-item-show-function')
}
</script>

<template>
  <div v-if="selectedFavorite">
    <FavoriteArticles
      :key="articlesRefreshKey"
      :favoriteId="selectedFavorite.id"
      :favoriteName="selectedFavorite.name"
      @back="handleBack"
      @removeArticle="handleRemoveArticle"
      @removeAll="handleRemoveAll"
    />
  </div>

  <div v-else class="favorite-container">
    <div class="favorite-add" @click="handleAdd">
      <svg t="1779762682734" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <path d="M896 480a32 32 0 0 1 32 32v384a32 32 0 0 1-32 32H512a32 32 0 1 1 0-64h352V512a32 32 0 0 1 32-32z m-128-384a32 32 0 0 1 32 32v640a32 32 0 0 1-32 32H128a32 32 0 0 1-32-32V128a32 32 0 0 1 32-32h640z m-32 64h-576v576h576v-576z m-285.952 128a32 32 0 0 1 32 32v98.048H576a32 32 0 0 1 31.488 26.24l0.512 5.76a32 32 0 0 1-32 32H482.048V576a32 32 0 0 1-26.24 31.488l-5.76 0.512a32 32 0 0 1-32-32V482.048H320a32 32 0 0 1-31.488-26.24l-0.512-5.76a32 32 0 0 1 32-32h98.048V320a32 32 0 0 1 26.24-31.488z" fill="currentColor"></path>
      </svg>
    </div>

    <div
      class="favorite-box"
      v-for="favorite in favoriteList"
      :key="favorite.id"
      @click="handleViewFavorite(favorite)"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <FunctionList
        class="function-list"
        :type="{ del: true, update: true }"
        :id="favorite.id"
        @update-click="handleEdit"
        @del-click="handleDelete"
      />
      <div class="favorite-name">{{ favorite.name }}</div>
      <div class="footer">
        <div class="favorite-status" v-if="favorite.status === 0">
          <svg t="1778815413389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <path d="M506.047171 560.671465c0-9.184365 7.426863-16.611228 16.582881-16.611228 9.184365 0 16.611228 7.426863 16.611228 16.611228v185.218027c0 9.184365-7.426863 16.611228-16.611228 16.611228-9.156018 0-16.582881-7.426863-16.582881-16.611228v-185.218027z m-252.258222-199.958366v-71.263869c0-73.928469 30.246041-141.167091 78.9742-189.866902 48.699812-48.728159 115.938434-78.9742 189.866903-78.9742 73.956815 0 141.195438 30.246041 189.89525 78.9742 48.728159 48.699812 78.9742 115.938434 78.9742 189.866902v71.263869h-33.194109v-71.263869c0-64.77245-26.504263-123.677112-69.251246-166.424094-42.718636-42.718636-101.623298-69.222899-166.424095-69.222899-64.77245 0-123.677112 26.504263-166.395748 69.222899-42.746983 42.746983-69.251246 101.651644-69.251246 166.424094v71.263869H253.788949z m-32.173624-16.611228h602.057801c25.795593 0 49.238401 10.545012 66.246484 27.524748 16.979736 17.008083 27.524748 40.450891 27.524748 66.246485v463.130107c0 25.795593-10.545012 49.238401-27.524748 66.246484-17.008083 16.979736-40.450891 27.524748-66.246484 27.524749H221.615325c-25.795593 0-49.238401-10.545012-66.246484-27.524749-16.979736-17.008083-27.524748-40.450891-27.524748-66.246484V437.873104c0-25.795593 10.545012-49.238401 27.524748-66.246485 17.008083-16.979736 40.450891-27.524748 66.246484-27.524748z m602.057801 33.19411H221.615325c-16.639575 0-31.776769 6.83158-42.775329 17.801793-10.970214 10.998561-17.801794 26.135755-17.801794 42.77533v463.130107c0 16.639575 6.83158 31.776769 17.801794 42.77533 10.998561 10.970214 26.135755 17.801794 42.775329 17.801793h602.057801c16.639575 0 31.776769-6.83158 42.775329-17.801793 10.970214-10.998561 17.801794-26.135755 17.801794-42.77533V437.873104c0-16.639575-6.83158-31.776769-17.801794-42.77533-10.998561-10.970214-26.135755-17.801794-42.775329-17.801793z" fill="currentColor"></path>
          </svg>
        </div>
        <div class="favorite-time">{{ formatDate(favorite.createTime) }}</div>
      </div>
    </div>

    <EditFavoriteModal
      :visible="showEditModal"
      :favorite="editingFavorite"
      @close="showEditModal = false"
      @saved="fetchList"
    />

    <Modal :visible="showDeleteModal" title="删除收藏夹" @close="showDeleteModal = false">
      <div class="delete-confirm">
        <p>确定要删除收藏夹「{{ deleteTarget?.name }}」吗？删除后无法恢复。</p>
        <div class="delete-confirm-footer">
          <button class="btn-cancel" @click="showDeleteModal = false">取消</button>
          <button class="btn-confirm" @click="handleConfirmDelete">确定删除</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.favorite-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.favorite-add {
  --favorite-box-height: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(var(--favorite-box-height) * 1px);
  border-radius: 16px;
  background-color: var(--show-bgc);
  cursor: pointer;
  transition: transform 0.3s;
}

.favorite-add > .icon {
  width: 40px;
  height: 40px;
  fill: var(--font-color);
}

.favorite-add:hover {
  transform: scale(1.05);
}

.favorite-box {
  --favorite-box-height: 200;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(var(--favorite-box-height) * 1px);
  user-select: none;
  padding: 10px;
  border-radius: 16px;
  background-color: var(--show-bgc);
  cursor: pointer;
  transition: transform 0.3s;
  overflow: hidden;
}

.favorite-box:hover {
  transform: scale(1.05);
}

.favorite-item-show-function > .function-list {
  display: flex;
}

.function-list {
  display: none;
}

.favorite-name {
  width: 100%;
  height: calc(var(--favorite-box-height) * 0.8px);
  line-height: calc(var(--favorite-box-height) * 0.8px);
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.footer {
  width: 100%;
  height: calc(var(--favorite-box-height) * 0.2px);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.icon {
  width: 20px;
  height: 20px;
}

.favorite-time {
  margin-left: 10px;
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
