<script lang="ts" setup>
import { ref, watch } from 'vue'

const prop = defineProps<{
  message: string
  visible: boolean
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

let timer: ReturnType<typeof setTimeout> | null = null

watch(() => prop.visible, (value) => {
  if (value && prop.duration) {
    timer = setTimeout(() => {
      emit('update:visible', false)
    }, prop.duration)
  } else if (timer) {
    clearTimeout(timer)
    timer = null
  }
})
</script>

<template>
  <teleport to="body">
    <Transition name="tip">
      <div v-if="visible" class="top-tip">{{ message }}</div>
    </Transition>
  </teleport>
</template>

<style scoped>
.top-tip {
  position: fixed;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  z-index: 9999;
}

/* 进入/离开动画 */
.tip-enter-active, .tip-leave-active {
  transition: all 0.3s ease;
}
.tip-enter-from, .tip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);  /* 从上方轻微滑入 */
}
</style>