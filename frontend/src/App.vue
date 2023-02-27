<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import LeftMenu from './components/LeftMenu.vue'
import RightMenu from './components/RightMenu.vue'
import TopMenu from './components/TopMenu.vue'
import TradeDetails from './components/TradeDetails.vue'
import Auth from './pages/Auth.vue'
import { useUserStore } from './store'

export interface TradeMeta {
  mode: 'sale' | 'buy'
}

const userStore = useUserStore()

const tradeMeta = ref<TradeMeta>({
  mode: 'sale'
})

// onBeforeMount(() => {
//   if (!userStore.currentUser)
// })
</script>

<template>
  <div class="main" >
    <TopMenu :tradeMeta="tradeMeta"/>
    <div class="trade" v-if="userStore.isAuth">
      <LeftMenu :trade-meta="tradeMeta" />
      <TradeDetails :trade-meta="tradeMeta" />
      <RightMenu :trade-meta="tradeMeta" />
    </div>
    <Auth v-else />
  </div>
</template>

<style scoped></style>
