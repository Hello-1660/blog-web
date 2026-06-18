<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Favorite } from '@/types/favorite'
import { getFavoriteList, createFavorite, addArticleToFavorite, removeArticleFromFavorite } from '@/apis/favorite'
import showTopTip from '@/components/showTopTip'
import Modal from './Modal.vue'

const props = defineProps<{
  visible: boolean
  articleId: number
  favoriteIdList: number[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const favorites = ref<Favorite[]>([])

const addedFavorites = computed(() =>
  favorites.value.filter(f => props.favoriteIdList.includes(f.id))
)

const otherFavorites = computed(() =>
  favorites.value.filter(f => !props.favoriteIdList.includes(f.id))
)
const loading = ref(false)
const isCreating = ref(false)
const newFolderName = ref('')
const createInput = ref<HTMLInputElement>()

watch(() => props.visible, (val) => {
  if (val) {
    fetchFavorites()
    isCreating.value = false
    newFolderName.value = ''
  }
})

async function fetchFavorites() {
  loading.value = true
  try {
    const res = await getFavoriteList()
    favorites.value = res.data || []
  } finally {
    loading.value = false
  }
}

async function handleSelect(favorite: Favorite) {
  try {
    await addArticleToFavorite(favorite.id, props.articleId)
    showTopTip.success(`已收藏到「${favorite.name}」`)
    emit('close')
  } catch {
    showTopTip.error('收藏失败')
  }
}

async function handleRemove(favorite: Favorite) {
  try {
    await removeArticleFromFavorite(favorite.id, props.articleId)
    showTopTip.success(`已从「${favorite.name}」移除`)
    emit('close')
  } catch {
    showTopTip.error('移除失败')
  }
}

function startCreate() {
  isCreating.value = true
  nextTick(() => {
    createInput.value?.focus()
  })
}

async function handleCreate() {
  const name = newFolderName.value.trim()
  if (!name) return

  try {
    await createFavorite(name)
    showTopTip.success(`收藏夹「${name}」已创建`)
    newFolderName.value = ''
    isCreating.value = false
    await fetchFavorites()
  } catch {
    showTopTip.error('创建失败')
  }
}

function onClose() {
  emit('close')
}
</script>

<template>
  <Modal :visible="visible" title="收藏到" @close="onClose">
    <div class="favorite-selector">
      <div class="favorite-list" v-if="favorites.length > 0">
        <!-- 已收藏 -->
        <template v-if="addedFavorites.length > 0">
          <div class="favorite-section-title">已收藏</div>
          <div
            v-for="item in addedFavorites"
            :key="item.id"
            class="favorite-item favorite-item--added"
            @click="handleRemove(item)"
          >
            <div class="favorite-item-icon favorite-item-icon--added">
              <svg t="1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m193.5 150.9l-262 262L341 374.5c-12.4-12.4-32.4-12.4-44.8 0-12.4 12.4-12.4 32.4 0 44.8l124.8 124.8c12.4 12.4 32.4 12.4 44.8 0l284.4-284.4c12.4-12.4 12.4-32.4 0-44.8-12.4-12.4-32.4-12.4-44.8 0z" fill="#67c23a"/>
              </svg>
            </div>
            <span class="favorite-item-name">{{ item.name }}</span>
            <span class="favorite-item-status">{{ item.status === 1 ? '公开' : '私有' }}</span>
          </div>
        </template>

        <!-- 其他收藏夹 -->
        <template v-if="otherFavorites.length > 0">
          <div class="favorite-section-title">{{ addedFavorites.length > 0 ? '其他收藏夹' : '收藏夹' }}</div>
          <div
            v-for="item in otherFavorites"
            :key="item.id"
            class="favorite-item"
            @click="handleSelect(item)"
          >
            <div class="favorite-item-icon">
              <svg t="1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M256 128h512a85.333333 85.333333 0 0 1 85.333333 85.333333v682.666667a42.666667 42.666667 0 0 1-64.426666 37.973333L512 765.184l-276.906667 168.789333A42.666667 42.666667 0 0 1 170.666667 896V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333z" fill="currentColor"></path>
              </svg>
            </div>
            <span class="favorite-item-name">{{ item.name }}</span>
            <span class="favorite-item-status">{{ item.status === 1 ? '公开' : '私有' }}</span>
          </div>
        </template>
      </div>

      <div v-if="!isCreating" class="create-trigger" @click="startCreate">
        <svg t="1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M512 213.333333v597.333334M213.333333 512h597.333334" stroke="currentColor" stroke-width="64" fill="none"></path>
        </svg>
        <span>新建收藏夹</span>
      </div>

      <div v-else class="create-input-area">
        <input
          ref="createInput"
          v-model="newFolderName"
          type="text"
          placeholder="收藏夹名称"
          class="create-input"
          @keyup.enter="handleCreate"
        />
        <button class="create-btn" @click="handleCreate" :disabled="!newFolderName.trim()">创建</button>
        <button class="cancel-btn" @click="isCreating = false">取消</button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.favorite-selector {
  min-height: 100px;
}

.favorite-list {
  max-height: 240px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 4px;
}

.favorite-item:hover {
  background-color: var(--hover-bgc);
}

.favorite-item-icon {
  display: flex;
  align-items: center;
  margin-right: 10px;
  color: var(--font-base-color);
}

.favorite-section-title {
  font-size: 12px;
  color: var(--font-base-color);
  padding: 6px 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--hover-bgc);
}

.favorite-item-icon--added {
  color: #67c23a;
}

.favorite-item-name {
  flex: 1;
  font-size: 14px;
}

.favorite-item-status {
  font-size: 12px;
  color: var(--font-base-color);
}

.create-trigger {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--font-base-color);
  font-size: 14px;
  gap: 8px;
}

.create-trigger:hover {
  background-color: var(--hover-bgc);
}

.create-input-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.create-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--show-bgc);
  color: var(--font-color);
}

.create-input:focus {
  border-color: #409eff;
}

.create-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  background-color: var(--hover-bgc);
  color: var(--font-color);
  font-size: 13px;
  cursor: pointer;
}
</style>
