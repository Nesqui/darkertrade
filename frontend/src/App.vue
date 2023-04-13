<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useUserStore, useAttributesStore } from './store'
import Home from './pages/Home.vue'
import { useRouter } from 'vue-router'
// import Auth from './components/Auth.vue'
const router = useRouter()
const userStore = useUserStore()
const isAuth = computed(() => userStore.isAuth)
onBeforeMount(() => {
  if (window.ym)
    router.afterEach((to, from) => {
      window.ym(to.fullPath, 'hit');
    })
})
</script>

<template>
  <div class="app">
    <Home />
  </div>
</template>

<style scoped lang="scss"></style>
