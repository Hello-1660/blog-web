<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { SelectItem } from '@/types/common'

const prop = defineProps<{
  selectList: Array<SelectItem>
}>()

// 条目列表
const list = ref(prop.selectList)
// 选择条目
const current = ref(list.value[0]?.name)
// 是否下拉
const isDropdown = ref(false)
// 传递给父组件的信息
const emit = defineEmits(['selectId'])
// 根容器
const selectContainer = ref<HTMLDivElement | null>(null)

/**
 * 点击展开下拉列表
 */
const handleSelectListActive = (e: MouseEvent) => {
  isDropdown.value = true
}

/**
 * 选择条目
 * @param id 条目编号
 */
const handleClick = (id: number, e: Event) => {
  e.stopPropagation()
  isDropdown.value = false
  current.value = list.value.filter(item => item.id === id)[0]?.name
  emit('selectId', id)
}

/**
 * 监听点击外部事件
 */
const handleOutSide = (e: MouseEvent) => {
  if (!selectContainer.value?.contains(e.target as Node)) {
    isDropdown.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleOutSide)
})

onUnmounted(() => {
  window.removeEventListener('click', handleOutSide)
})
</script>

<template>
  <div class="select-container" ref="selectContainer">
    <div class="select-container-show select-container-item"
    @click="handleSelectListActive"
    >{{ current }}</div>

    <div class="select-container-list"
    :class="{ 'select-container-list-active' : isDropdown }"
    >
      <div>
        <div class="select-container-item" 
        v-for="item in list" :key="item.id"
        @click="handleClick(item.id, $event)"
        >
        {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-container {
  color: var(--font-color);
  user-select: none;
  position: relative;
  width: 100px;
}

.select-container-show {
  background-color: transparent !important;
  border-bottom: 1px solid #000;
  margin-bottom: 5px;
}

.select-container-list {
  position: absolute; 
  z-index: 10;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
  width: 100%;
  overflow: hidden;
}

.select-container-list>div {
  overflow: hidden;
}

.select-container-list-active {
  grid-template-rows: 1fr;
}

.select-container-item {
  padding: 0 15px;
  width: 100%;
  font-size: 14px;
  line-height: 28px;
  text-align: center;
  background-color: var(--show-bgc);
  white-space: nowrap; 
  text-overflow: ellipsis; 
  overflow: hidden;
}

.select-container-list>div>.select-container-item:hover {
  background-color: var(--hover-bgc);
}
</style>