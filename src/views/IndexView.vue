<script setup lang="ts">
import Common from '@/components/Common.vue'
</script>

<template> 
  <div class="index-container">
    <Common/>
    <div class="content"> 
      <div>
        <router-view />
      </div>
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
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 200px;
  overflow-y: auto;
}

.content>div {
  width: 100%;
}
</style>