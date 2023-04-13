<script setup lang="ts">
import { ExistingItem, initExistingItemApi, SimilarCounters } from '@/hooks';
import { useRouter } from 'vue-router';
import { nextTick, onBeforeMount, onMounted, PropType, ref, watch } from 'vue';
import ItemPreview from './ItemPreview.vue';

const loading = ref(false)
const existingItemApi = initExistingItemApi()
const similarItems = ref<ExistingItem[]>([])
const router = useRouter()

const props = defineProps({
  existingItem: {
    type: Object as PropType<ExistingItem>,
    required: true
  },
  offerType: {
    required: true,
    type: String as PropType<'WTS' | 'WTB'>
  },
  counters: {
    type: Object as PropType<SimilarCounters>
  }
})

watch(() => props.existingItem.stats.length, async () => {
  await init()
})

watch(() => props.existingItem.itemId, async () => {
  await init()
})

const init = async () => {
  if (!props.existingItem.itemId || !props.existingItem.stats.length)
    return
  if (props.existingItem.id)
    similarItems.value = await existingItemApi.findSimilarById(props.existingItem.id, props.offerType)
  else
    similarItems.value = await existingItemApi.findSimilar(props.offerType, props.existingItem)

  if (props.counters)
    props.counters[props.offerType] = similarItems.value.length
}

const openBlank = async (url: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

// `/user/${existingItem.user?.nickname}/items/${existingItem.id}`
onMounted(async () => {
  await init()
})
</script>

<template>
  <div class="similar" v-if="similarItems.length">
    <ItemPreview v-for="(existingItem, index) in similarItems"
      @click="openBlank(`/user/${existingItem.user?.nickname}/items/${existingItem.id}`)" :key="index" :loading="loading"
      :creator="existingItem.user" :updated-at="existingItem.updatedAt" :wantedPrice="existingItem.wantedPrice"
      :item="existingItem.item" :offer-type="existingItem.offerType" :stats="existingItem.stats" :rarity="existingItem.rarity" />
  </div>
  <div class="similar-empty" v-else>
    <p>
      Similar {{ offerType }} items not found
    </p>
  </div>
</template>

<style scoped lang="scss">
.similar,
.similar-empty {
  width: 265px;
}

.similar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 265px;
  align-items: center;
  max-height: 700px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
