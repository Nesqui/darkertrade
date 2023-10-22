<script setup lang="ts">
import { OfferPair } from '@/hooks'
import { PropType } from 'vue'

defineProps({
  offerPair: {
    type: Object as PropType<OfferPair>,
    required: true
  },
  checkouts: {
    type: Number
  }
})
</script>

<template>
  <div class="offer-pairs-item">
    <span :class="`selected-color rarity-bg-${offerPair.rarity}`" />
    <span class="offer-pair-amount">{{ offerPair.quantity }}</span>
    <span class="offer-pair-divider">X</span>
    <span class="offer-pair-price darker-title">{{ `${offerPair.wantedPrice} G` }} </span>
    <span class="offer-pair-divider">Checkouts:</span>
    <span v-if="checkouts !== undefined" class="offer-pair-amount">{{ checkouts }} </span>
  </div>
</template>

<style scoped lang="scss">
.selected {
  background-color: var(--el-color-danger);
  color: white;
}
</style>
