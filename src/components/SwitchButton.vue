<script setup lang="ts">
import { ref, watch } from 'vue'

// 获取父组件传递的参数
const props = defineProps({
  status: Boolean
}) 

const status = ref(props.status)

// 向父组件传值
const emit = defineEmits(['switchStatus'])

/**
 * 向父组件传递的参数
 */
const putStatus = () => {
  emit('switchStatus', status.value)
}

/**
 * 切换状态
 */
const handleSwitch = () => {
  status.value = !status.value
  putStatus()
}
</script>

<template>
  <div class="button-container" @click="handleSwitch">
    <slot class="button-container-slot" name="open" v-if="status"></slot>
    <slot class="button-container-slot" name="close" v-else></slot>
    <div class="button-content">
      <div class="button-slider" :class="{ 'button-statue-on' : status, 'button-statue-off' : !status }">
        <div class="button-circle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 26px;
  gap: 10px;
}

.button-container-slot {
  width: 50px;
  height: 100%;
}

.button-content {
  position: relative;
  width: 60px;
  height: 100%;
  border-radius: 20px;
  background-color: #dcdfe6;
  overflow: hidden;
}

.button-slider {
  position: absolute;
  top: 0px;
  left: -60px;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: #4ca0fd;
  transition: transform 0.3s ease-in-out;
}

.button-statue-on {
  transform: translateX(60px);
}

.button-statue-off {
  transform: translateX(26px);
}

.button-circle {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 26px;
  height: 26px;
  border: 2px solid rgb(204, 204, 204);
  background-color: #fff;
  border-radius: 50%;
}
</style>