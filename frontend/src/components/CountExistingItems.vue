<script setup lang="ts">
import { initExistingItemApi, QuantityExistingItemsLimits } from "@/hooks";
import { computed, onBeforeMount, PropType, ref } from "vue";

const props = defineProps({
  showOnly: {
    default: null,
    type: String as PropType<"WTS" | "WTB">
  }
})

const existingItemApi = initExistingItemApi()
const counts = ref<QuantityExistingItemsLimits>()

const quantityByProp = computed(() => {
  return counts.value?.quantity.find(item => item.offerType === props.showOnly)
})

onBeforeMount(async () => {
  counts.value = await existingItemApi.count()
})
</script>

<template>
  <div v-if="counts && !showOnly" class="count-existing-item">
    <span class="limit" :class="{'warning': +quantity.offerTypeCount >= +counts.limits[quantity.offerType]}" v-for="(quantity, index) of counts.quantity" :key="index">
      {{ quantity.offerType }} {{ quantity.offerTypeCount }}/{{ counts.limits[quantity.offerType] }}
    </span>
  </div>
  <div v-else-if="counts && showOnly && quantityByProp" class="count-existing-item">
    <span class="limit" :class="{'warning': +quantityByProp.offerTypeCount >= +counts.limits[quantityByProp.offerType]}">
      {{ quantityByProp.offerType }} {{ quantityByProp.offerTypeCount }}/{{ counts.limits[quantityByProp.offerType] }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.warning {
  font-weight: 600;
  color: darkred;
}
.limit:not(:last-child) {
  margin-right: 1rem;
}
</style>