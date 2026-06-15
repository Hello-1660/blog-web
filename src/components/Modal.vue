<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  visible: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function onOverlayClick() {
  emit('close')
}
</script>

<template>
  <teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="onOverlayClick">
        <div class="modal-container">
          <div class="modal-header">
            <span class="modal-title" v-if="title">{{ title }}</span>
            <div class="modal-close" @click="emit('close')">
              <svg t="1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="M810.666667 273.066667L750.933333 213.333333 512 452.266667 273.066667 213.333333 213.333333 273.066667 452.266667 512 213.333333 750.933333 273.066667 810.666667 512 571.733333 750.933333 810.666667 810.666667 750.933333 571.733333 512z" fill="currentColor"></path>
              </svg>
            </div>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 8000;
}

.modal-container {
  background-color: var(--show-bgc);
  border-radius: 8px;
  min-width: 360px;
  max-width: 480px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--hover-bgc);
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--font-color);
}

.modal-close {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--font-base-color);
}

.modal-close:hover {
  background-color: var(--hover-bgc);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  color: var(--font-color);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
