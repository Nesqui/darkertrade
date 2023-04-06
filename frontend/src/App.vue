<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useUserStore, useAttributesStore } from './store'
import Home from './pages/Home.vue'
// import Auth from './components/Auth.vue'

const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
</script>

<template>
  <div class="app">
    <Home />
  </div>
</template>

<style scoped lang="scss">
</style>
