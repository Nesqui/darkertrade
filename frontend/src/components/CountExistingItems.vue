<script setup lang="ts">
import { initExistingItemApi, QuantityExistingItemsLimits } from "@/hooks";
import { onBeforeMount, ref } from "vue";
const existingItemApi = initExistingItemApi()
const counts = ref<QuantityExistingItemsLimits>()

onBeforeMount(async () => {
  counts.value = await existingItemApi.count()
})
</script>

<template>
  <div v-if="counts" class="count-existing-item">
    <strong class="limit" v-for="(quantity, index) of counts.quantity" :key="index">
      {{ quantity.offerType }} {{ quantity.offerTypeCount }}/{{ counts.limits[quantity.offerType] }}
    </strong>
  </div>
</template>

<style scoped lang="scss">
.count-existing-item {
}
.limit:not(:last-child) {
  margin-right: 1rem;
}
</style>