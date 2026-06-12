<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { SelectItem } from '@/types/common'

const prop = defineProps<{
  selectList: Array<SelectItem>
}>()

// 条目列表 — computed 保持和 prop 同步，不会拍到空数组快照
const list = computed(() => prop.selectList)
// 选择条目
const current = ref(prop.selectList[0]?.label)
// 是否下拉
const isDropdown = ref(false)
// 传递给父组件的信息
const emit = defineEmits(['selectId'])
// 根容器
const selectContainer = ref<HTMLDivElement | null>(null)

// 异步数据到达后，current 自动跟上
watch(list, (newList) => {
  if (!newList.find(item => item.label === current.value)) {
    current.value = newList[0]?.label
  }
})

// 最长条目，用于撑开父容器宽度
const longestItem = computed(() =>
  list.value.reduce((a, b) => a.label.length >= b.label.length ? a : b, { label: '' })
)

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
  current.value = list.value.filter(item => item.id === id)[0]?.label
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
    :class="{ 'select-container-show-click-border' : isDropdown }"
    @click="handleSelectListActive"
    >{{ current }}</div>

    <div class="select-container-sizer select-container-item" aria-hidden="true">{{ longestItem.label }}</div>

    <div class="select-container-list"
    :class="{ 'select-container-list-active' : isDropdown }"
    >
      <div>
        <div class="select-container-item" 
        v-for="item in list" :key="item.id"
        @click="handleClick(item.id, $event)"
        >
        {{ item.label }}
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
  display: inline-block;
}

.select-container-show {
  background-color: var(--show-bgc);
  border-radius: 4px;
  margin-bottom: 5px;
  border: 1px solid rgba(79, 79, 79, 0.505);
}

.select-container-show-click-border {
  border-color: transparent;
}

.select-container-show-click-border::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  z-index: 10;
  width: calc(100% + 4px);
  height: calc(100%);
  border: 2px solid rgba(79, 79, 79, 0.505);
  border-radius: 4px;
}

.select-container-sizer {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
  visibility: hidden;
  overflow: hidden;
}

.select-container-list {
  position: absolute;
  width: 100%;
  z-index: 10;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
  overflow: hidden;
}

.select-container-list>div {
  overflow: hidden;
}

.select-container-list>div>div {
  padding: 5px 0;
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