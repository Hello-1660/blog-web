<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { restoreTokens } from '@/utils/http'
import { watch, onMounted } from 'vue'

const userStore = useUserStore()
restoreTokens(userStore.token, userStore.refreshToken)

const applyTheme = (themeId: number | undefined) => {
  if (themeId === 2) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

onMounted(() => {
  applyTheme(userStore.userInfo?.themeId)
})

watch(() => userStore.userInfo?.themeId, (id) => {
  applyTheme(id)
})
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
