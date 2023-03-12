<script setup lang="ts">
import { ExistingItem, useMoment } from '@/hooks'
import { initBidApi, QueryBidDto } from '@/hooks/bid'
import { onBeforeMount, ref, watch } from 'vue'
import ItemPreview from '@/components/ItemPreview.vue';

const bidApi = initBidApi()
const existingItems = ref<ExistingItem[]>()

const moment = useMoment()
const loading = ref(true)
const tabName = ref<'sentOffers' | 'receivedOffers'>('sentOffers')

const filter = ref<QueryBidDto>({
  mine: true,
  sort: [['id', 'DESC']],
  limit: 15,
  offset: 0,
  offerType: 'WTS'
})

const init = async () => {
  loading.value = true
  try {
    existingItems.value = await bidApi.filter(filter.value)
  } catch (error) {
  } finally {
    loading.value = false
  }
}

watch(filter.value, async () => {
  await init()
})

const changeTab = () => {
  filter.value.mine = !filter.value.mine
}

onBeforeMount(async () => {
  await init()
})
</script>

<template>
  <div class="bids">
    <div class="wrapper">
      <el-tabs v-model="tabName" class="demo-tabs" @tab-click="changeTab">
        <el-tab-pane label="Sent offers" name="sentOffers"></el-tab-pane>
        <el-tab-pane label="Received offers" name="receivedOffers"></el-tab-pane>
      </el-tabs>
      <!-- {{ existingItems }} -->

      <div class="bids-table">
        <div class="bids-items-list">
          <div class="bids-items-list__li" v-for="(existingItem, index) in existingItems" :key="index">
            <ItemPreview :item="existingItem.item" :stats="existingItem.stats"/>
            <div>
              Created At: {{ moment.fromNow(existingItem.createdAt) }}
            </div>
          </div>
        </div>
        <div class="bids-list"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$liHeight: 250px;
.bids {
  .wrapper {
    width: var(--wrapper-xxl-width);
  }

  .bids-items-list {
    border-right: 1px solid var(--el-border-color);
    &__li {
      height: $liHeight;
      display: flex;
      gap: .25rem;
    }
  }
}
</style>
