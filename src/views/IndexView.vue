<script setup lang="ts">
import Common from '@/components/Common.vue'
</script>

<template> 
  <div class="index-container">
    <Common />
    <div class="content"> 
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.index-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.content {
  --info: 200px;
  width: calc(100% - var(--info));
  height: 100%;
}
</style>