<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore, useAttributesStore } from './store'
import Home from './pages/Home.vue'
import Auth from './pages/Auth.vue'

const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)

</script>

<template>
  <div class="app">
    <Home v-if="isAuth" />
    <Auth v-else />
  </div>
</template>

<style scoped lang="scss">
</style>
