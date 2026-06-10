<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'closed'): void
}>()

const visible = ref(false)

onMounted(() => {
  visible.value = true
  if (props.duration && props.duration > 0) {
    setTimeout(() => close(), props.duration)
  }
})

function close() {
  visible.value = false
}

function onLeave() {
  emit('closed')
}
</script>

<template>
  <teleport to="body">
    <Transition name="tip" @after-leave="onLeave">
      <div v-if="visible" class="top-tip" :class="`top-tip--${type || 'info'}`">
        {{ message }}
      </div>
    </Transition>
  </teleport>
</template>

<style scoped>
.top-tip {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 24px;
  border-radius: 4px;
  z-index: 9999;
  font-size: 16px;
  white-space: nowrap;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.top-tip--info {
  background-color: #f4f4f5;
  color: #909399;
}
.top-tip--success {
  background-color: #f0f9eb;
  color: #67c23a;
}
.top-tip--warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}
.top-tip--error {
  background-color: #fef0f0;
  color: #f56c6c;
}

.tip-enter-active,
.tip-leave-active {
  transition: all 0.3s ease;
}
.tip-enter-from,
.tip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
</style>
