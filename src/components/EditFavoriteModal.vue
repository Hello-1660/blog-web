<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Favorite } from '@/types/favorite'
import { createFavorite, updateFavorite } from '@/apis/favorite'
import showTopTip from '@/components/showTopTip'
import Modal from './Modal.vue'

const props = defineProps<{
  visible: boolean
  favorite?: Favorite | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const name = ref('')
const status = ref(0)

watch(() => props.visible, (val) => {
  if (val) {
    if (props.favorite) {
      name.value = props.favorite.name
      status.value = props.favorite.status
    } else {
      name.value = ''
      status.value = 0
    }
  }
})

function getTitle() {
  return props.favorite ? '编辑收藏夹' : '新建收藏夹'
}

async function handleSubmit() {
  if (!name.value.trim()) {
    showTopTip.warning('请输入收藏夹名称')
    return
  }

  try {
    if (props.favorite) {
      await updateFavorite(props.favorite.id, name.value.trim(), status.value)
      showTopTip.success('收藏夹已更新')
    } else {
      await createFavorite(name.value.trim(), status.value)
      showTopTip.success('收藏夹已创建')
    }
    emit('saved')
    emit('close')
  } catch {
    showTopTip.error('操作失败')
  }
}
</script>

<template>
  <Modal :visible="visible" :title="getTitle()" @close="emit('close')">
    <div class="edit-favorite">
      <div class="form-item">
        <label class="form-label">名称</label>
        <input
          v-model="name"
          type="text"
          class="form-input"
          placeholder="收藏夹名称"
          @keyup.enter="handleSubmit"
        />
      </div>
      <div class="form-item">
        <label class="form-label">状态</label>
        <div class="status-toggle">
          <span
            class="status-option"
            :class="{ 'status-option--active': status === 0 }"
            @click="status = 0"
          >
            <svg t="1778815413389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M506.047171 560.671465c0-9.184365 7.426863-16.611228 16.582881-16.611228 9.184365 0 16.611228 7.426863 16.611228 16.611228v185.218027c0 9.184365-7.426863 16.611228-16.611228 16.611228-9.156018 0-16.582881-7.426863-16.582881-16.611228v-185.218027z m-252.258222-199.958366v-71.263869c0-73.928469 30.246041-141.167091 78.9742-189.866902 48.699812-48.728159 115.938434-78.9742 189.866903-78.9742 73.956815 0 141.195438 30.246041 189.89525 78.9742 48.728159 48.699812 78.9742 115.938434 78.9742 189.866902v71.263869h-33.194109v-71.263869c0-64.77245-26.504263-123.677112-69.251246-166.424094-42.718636-42.718636-101.623298-69.222899-166.424095-69.222899-64.77245 0-123.677112 26.504263-166.395748 69.222899-42.746983 42.746983-69.251246 101.651644-69.251246 166.424094v71.263869H253.788949z m-32.173624-16.611228h602.057801c25.795593 0 49.238401 10.545012 66.246484 27.524748 16.979736 17.008083 27.524748 40.450891 27.524748 66.246485v463.130107c0 25.795593-10.545012 49.238401-27.524748 66.246484-17.008083 16.979736-40.450891 27.524748-66.246484 27.524749H221.615325c-25.795593 0-49.238401-10.545012-66.246484-27.524749-16.979736-17.008083-27.524748-40.450891-27.524748-66.246484V437.873104c0-25.795593 10.545012-49.238401 27.524748-66.246485 17.008083-16.979736 40.450891-27.524748 66.246484-27.524748z m602.057801 33.19411H221.615325c-16.639575 0-31.776769 6.83158-42.775329 17.801793-10.970214 10.998561-17.801794 26.135755-17.801794 42.77533v463.130107c0 16.639575 6.83158 31.776769 17.801794 42.77533 10.998561 10.970214 26.135755 17.801794 42.775329 17.801793h602.057801c16.639575 0 31.776769-6.83158 42.775329-17.801793 10.970214-10.998561 17.801794-26.135755 17.801794-42.77533V437.873104c0-16.639575-6.83158-31.776769-17.801794-42.77533-10.998561-10.970214-26.135755-17.801794-42.775329-17.801793z" fill="currentColor"></path>
            </svg>
            <span>私有</span>
          </span>
          <span
            class="status-option"
            :class="{ 'status-option--active': status === 1 }"
            @click="status = 1"
          >
            <svg t="1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="currentColor"></path>
            </svg>
            <span>公开</span>
          </span>
        </div>
      </div>
      <div class="form-footer">
        <button class="btn-cancel" @click="emit('close')">取消</button>
        <button class="btn-submit" @click="handleSubmit" :disabled="!name.trim()">确定</button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.edit-favorite {
  min-width: 300px;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: var(--font-base-color);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--show-bgc);
  color: var(--font-color);
}

.form-input:focus {
  border-color: #409eff;
}

.status-toggle {
  display: flex;
  gap: 12px;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: var(--font-base-color);
}

.status-option--active {
  border-color: #409eff;
  color: #409eff;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
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

.btn-submit {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
