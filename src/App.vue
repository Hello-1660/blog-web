<script setup lang="ts">
</script>

<template>
  <div class="container">
    <router-view />
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
  background-color: var(--base-bgc);
}
</style>
