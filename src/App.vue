<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { restoreTokens } from '@/utils/http'

const userStore = useUserStore()
restoreTokens(userStore.token, userStore.refreshToken)
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
  width: 100%;
  height: 100vh;
  overflow-y: auto;
}
</style>
