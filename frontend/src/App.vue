<script setup lang="ts">
import { ref } from 'vue'
import LeftMenu from './components/LeftMenu.vue'
import RightMenu from './components/RightMenu.vue'
import TopMenu from './components/TopMenu.vue'
import TradeDetails from './components/TradeDetails.vue'

export interface TradeMeta {
  mode: 'sale' | 'buy'
}

const tradeMeta = ref<TradeMeta>({
  mode: 'sale'
})

</script>

<template>
  <div class="main">
    <TopMenu :tradeMeta="tradeMeta"/>
    <div class="trade">
      <LeftMenu :trade-meta="tradeMeta" />
      <TradeDetails :trade-meta="tradeMeta" />
      <RightMenu :trade-meta="tradeMeta" />
    </div>
  </div>
</template>

<style scoped></style>
