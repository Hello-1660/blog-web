<script setup lang="ts">
import IndexView from './views/IndexView.vue'
import Common from './components/Common.vue'
</script>

<template>
  <div class="container">
    <Common />
    <div class="content"> 
      <router-view>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.content {
  --info: 200px;
  width: calc(100% - var(--info));
  height: 100%;
  background-color: yellow;
}
</style>
