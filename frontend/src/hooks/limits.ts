import { computed, onBeforeMount, ref } from "vue"
import { initExistingItemApi, QuantityExistingItemsLimits } from "."

export const initLimits = () => {
  const existingItemApi = initExistingItemApi()
  const counts = ref<QuantityExistingItemsLimits>()
  const loading = ref(true)

  onBeforeMount(async () => {
    try {
    counts.value = await existingItemApi.count()
    } catch (error) {
    } finally {
      loading.value = false
    }
  })

  const isLoading = () => loading.value

  const canCreateWtb = () => {
    if (counts.value) {
      const wtbQuantity = counts.value.quantity.find(quantity => quantity.offerType === 'WTB')
      if (wtbQuantity && wtbQuantity.offerTypeCount < counts.value.limits.WTB)
        return true
      return false
    }
    return false
  }

  const canCreateWts = () => {
    if (counts.value) {
      const wtbQuantity = counts.value.quantity.find(quantity => quantity.offerType === 'WTS')
      if (wtbQuantity && wtbQuantity.offerTypeCount < counts.value.limits.WTS)
        return true
      return false
    }
    return false
  }

  return {
    counts,
    canCreateWts,
    canCreateWtb,
    isLoading
  }
}
