<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import LeftMenu from './components/LeftMenu.vue'
import RightMenu from './components/RightMenu.vue'
import TopMenu from './components/TopMenu.vue'
import TradeDetails from './components/TradeDetails.vue'
import { initAttributesApi } from './hooks'
import Auth from './pages/Auth.vue'
import { useUserStore } from './store'
import { useAttributesStore } from './store/attributes'

export interface TradeMeta {
  mode: 'sale' | 'buy'
}
const attributeApi = initAttributesApi()
const attributeStore = useAttributesStore()
const userStore = useUserStore()

const tradeMeta = ref<TradeMeta>({
  mode: 'sale'
})

const isAuth = computed(() => userStore.isAuth)

onBeforeMount(async () => {
  const attributes = await attributeApi.findAll()
  attributeStore.saveAll(attributes)
})
</script>

<template>
  <div class="main">
    <TopMenu :tradeMeta="tradeMeta" />
    <div class="trade" v-if="isAuth">
      <LeftMenu :trade-meta="tradeMeta" />
      <TradeDetails :trade-meta="tradeMeta" />
      <RightMenu :trade-meta="tradeMeta" />
    </div>
    <Auth v-else />
  </div>
</template>

<style scoped lang='scss'>
</style>
