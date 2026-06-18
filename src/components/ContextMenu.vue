<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import type { ContextMenuItem } from '@/types/contextMenu'

const porp = defineProps<{
  items: ContextMenuItem[]
  position: { x: number; y: number }
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const menuRef = ref<HTMLElement | null>(null)
const adjX = ref(porp.position.x)
const adjY = ref(porp.position.y)

const close = () => emit('close')

/**
 * 点击菜单项
 */
const handleItemClick = (item: ContextMenuItem) => {
  if (item.disabled || item.divider) return
  item.onClick()
  close()
}

/**
 * 计算自适应位置，避免溢出视口
 */
const adjustPosition = () => {
  const el = menuRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  let x = porp.position.x
  let y = porp.position.y

  if (x + rect.width > vw) x = vw - rect.width - 8
  if (y + rect.height > vh) y = vh - rect.height - 8
  if (x < 0) x = 8
  if (y < 0) y = 8

  adjX.value = x
  adjY.value = y
}

watch(() => porp.show, async (val) => {
  if (val) {
    await nextTick()
    adjustPosition()
    document.addEventListener('click', close, { once: true })
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      ref="menuRef"
      class="context-menu"
      :style="{ left: adjX + 'px', top: adjY + 'px' }"
    >
      <template v-for="(item, index) in items" :key="index">
        <div
          v-if="item.divider"
          class="context-menu-divider"
        />
        <div
          v-else
          class="context-menu-item"
          :class="{ 'context-menu-item--disabled': item.disabled }"
          @click="handleItemClick(item)"
        >
          <span v-if="item.icon" class="context-menu-item-icon" v-html="item.icon" />
          <span class="context-menu-item-label">{{ item.label }}</span>
        </div>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 140px;
  padding: 6px 0;
  background-color: var(--show-bgc, #fff);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  user-select: none;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--font-color, #333);
  cursor: pointer;
  transition: background-color 0.15s;
}

.context-menu-item:hover {
  background-color: var(--hover-bgc, rgba(0, 0, 0, 0.05));
}

.context-menu-item--disabled {
  color: #bbb;
  pointer-events: none;
}

.context-menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.context-menu-item-icon :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.context-menu-item-label {
  white-space: nowrap;
}

.context-menu-divider {
  height: 1px;
  margin: 4px 10px;
  background-color: var(--divider-color);
}
</style>
