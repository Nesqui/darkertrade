<script setup lang="ts">
import { ExistingItem } from '@/hooks'
import { Bid, initBidApi, QueryBidDto } from '@/hooks/bid'
import { onBeforeMount, ref, watch } from 'vue'
import ItemPreview from '@/components/ItemPreview.vue';
import BidList from '@/components/BidList.vue';

const bidApi = initBidApi()
const existingItems = ref<ExistingItem[]>()
const loading = ref(true)
const tabName = ref<'sentOffers' | 'receivedOffers'>('receivedOffers')
const maxCount = ref(6)
const selectedExistingItem = ref<ExistingItem>()


const filter = ref<QueryBidDto>({
  mine: true,
  sort: [['id', 'DESC']],
  limit: 3,
  offset: 0,
  offerType: 'WTS'
})

const pagination = ref({
  limit: 3,
  offset: 0,
})

const bids = ref<Bid[]>()

const init = async () => {
  loading.value = true
  try {
    existingItems.value = []
    const { rows, count } = await bidApi.filter({
      ...filter.value,
      ...pagination.value
    })
    existingItems.value = rows
    maxCount.value = count
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const loadMoreExistingItems = async () => {
  try {
    if (pagination.value.offset + pagination.value.limit < maxCount.value) {
      pagination.value.offset = pagination.value.limit + pagination.value.offset
      const { rows, count } = await bidApi.filter({
        ...filter.value,
        ...pagination.value
      })
      if (existingItems.value?.length) {
        existingItems.value = [...existingItems.value, ...rows]
        maxCount.value = count
      }
    }
  } catch (error) {
  }
}

watch(filter.value, async () => {
  pagination.value.offset = 0
  bids.value = []
  await init()
})

const changeTab = () => {
  clear()
  filter.value.mine = tabName.value === 'sentOffers' ? false : true
}

const onBidDeleted = async (bid: Bid) => {
  if (!bids.value || !existingItems.value || !selectedExistingItem.value)
    return
  const bidIndex = bids.value.findIndex(b => b.id === bid.id)
  if (bidIndex !== -1) {
    bids.value.splice(bidIndex, 1)
    if (!bids.value.length) {
      const eiIndex = existingItems.value.findIndex(ei => ei.id === selectedExistingItem.value?.id)
      if (eiIndex !== -1) {
        existingItems.value.splice(eiIndex, 1)
        selectedExistingItem.value = undefined
        pagination.value.offset--
        await loadMoreExistingItems()
      }
    }
  }
}

const clear = () => {
  selectedExistingItem.value = undefined
  bids.value = undefined
}

const changeOfferType = (offerType: 'WTB' | 'WTS') => {
  filter.value.offerType = offerType
  clear()
}

const selectExistingItem = (existingItem: ExistingItem) => {
  selectedExistingItem.value = existingItem
  bids.value = existingItem.bids
}

const newBidsCounter = (existingItem: ExistingItem) => {
  if (!existingItem.bids) return ''
  const filteredBids = existingItem.bids.filter(bid => bid.status === 'created')
  return filteredBids.length > 9 ? '9+' : filteredBids.length
}

onBeforeMount(async () => {
  await init()
})
</script>

<template>
  <div class="bids">
    <div class="wrapper">
      <el-tabs v-model="tabName" class="bids-tabs" @tab-change="changeTab">
        <el-tab-pane label="Received offers" name="receivedOffers"></el-tab-pane>
        <el-tab-pane label="Sent offers" name="sentOffers"></el-tab-pane>
      </el-tabs>
      <!-- {{ existingItems?.length }} {{ JSON.stringify(pagination) }} {{ maxCount }} -->
      <div class="bids-table">
        <div v-if="existingItems?.length">
          <div v-if="!selectedExistingItem" class="bids-items-list infinite-scroll" infinite-scroll-distance="200"
            v-infinite-scroll="loadMoreExistingItems" infinite-scroll-delay="300">
            <div class="bids-items-list__li" v-for="(existingItem, index) in existingItems" :key="index">
              <div class="item-preview__head">
                <div v-if="newBidsCounter(existingItem)" @click="() => selectExistingItem(existingItem)"
                  class="counter item-preview__head__counter">{{ newBidsCounter(existingItem) }}
                </div>
              </div>
              <ItemPreview :class="{ 'active': selectedExistingItem?.id === existingItem.id }"
                @click="() => selectExistingItem(existingItem)" :offer-type="existingItem.offerType"
                :wanted-price="existingItem.wantedPrice" :item="existingItem.item" :stats="existingItem.stats" />
            </div>
          </div>
          <div v-else>
            <div class="selected-item__actions">
              <el-button link @click="clear">Show all</el-button>
            </div>
            <ItemPreview :offer-type="selectedExistingItem.offerType" :wanted-price="selectedExistingItem.wantedPrice"
              :item="selectedExistingItem.item" :stats="selectedExistingItem.stats" />
          </div>

        </div>
        <div class="bid-list">
          <el-button-group class="table-actions">
            <el-button :disabled="filter.offerType === 'WTB'" @click="() => changeOfferType('WTB')">WTB only</el-button>
            <el-button :disabled="filter.offerType === 'WTS'" @click="() => changeOfferType('WTS')">WTS only</el-button>
          </el-button-group>
          <div v-if="bids && selectedExistingItem">
            <BidList :existing-item="selectedExistingItem" :bids="bids" @on-bid-deleted="onBidDeleted" @clear="clear"
              :filter="filter" />
          </div>
        </div>
      </div>
      <div v-if="loading">
        <el-skeleton :rows="6"></el-skeleton>
      </div>
      <div class="empty-message" v-else-if="!existingItems?.length">
        <p>Currently no bids here</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// $liHeight: 270px;
$itemsListWidth: 300px;

.bids {

  .bids-tabs {
    margin-bottom: 2rem;
  }

  .selected-item__actions {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }

  .bid-list {
    display: flex;
    flex-direction: column;
    width: 100%;

    .table-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 2rem;
    }
  }

  .wrapper {
    width: var(--wrapper-xxl-width);
  }

  a {
    color: var(--el-color-danger);
    font-weight: 600;
  }

  .item-preview__head {
    position: relative;
    width: 100%;

    &__counter {
      position: absolute;
      background-color: var(--el-color-danger);
      left: calc($itemsListWidth - 2rem - 23px);
      top: -13px;
      height: 36px;
      width: 36px;
      transition: all .5s;
      cursor: pointer;
      color: var(--el-bg-color);
      box-shadow: var(--el-box-shadow);

    }

    &__counter:hover {
      transform: scale(1.1);
    }
  }


  .bids-table {
    display: flex;
  }


  .bids-items-list {
    margin-top: .25rem;
    border-right: 1px solid var(--el-border-color);
    overflow-y: visible;
    overflow-x: hidden;
    width: $itemsListWidth;
    max-height: 650px;
    // border-left: 4px solid var(--el-border-color);

    &__li {
      padding: 1rem 0;
    }

    &__li:not(:last-child) {
      border-bottom: 1px solid var(--el-border-color);
    }
  }

  .empty-message {
    margin-left: 25px;
    text-align: center;
  }
}
</style>

