<script setup lang="ts">
import { ExistingItem } from '@/hooks'
import { Bid, initBidApi, QueryBidDto } from '@/hooks/bid'
import { computed, onBeforeMount, ref, watch } from 'vue'
import ItemPreview from '@/components/ItemPreview.vue';
import BidList from '@/components/BidList.vue';
import { useRouter } from 'vue-router';

const bidApi = initBidApi()
const existingItems = ref<ExistingItem[]>()
const loading = ref(true)
const tabName = ref<'sentOffers' | 'receivedOffers'>('receivedOffers')
const maxCount = ref(6)
const selectedExistingItem = ref<ExistingItem>()
const router = useRouter()

const filter = ref<QueryBidDto>({
  mine: true,
  sort: [['id', 'DESC']],
  limit: 8,
  offset: 0,
  offerType: 'WTS'
})

const pagination = ref({
  limit: 8,
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
  let count = 0
  if (tabName.value === 'sentOffers')
    count = existingItem.bids.filter(bid => bid.status === 'accepted').length
  else
    count = existingItem.bids.filter(bid => bid.status === 'created').length

  return count > 9 ? '9+' : count
}

const headerName = computed(() => {
  if (!selectedExistingItem.value) {
    if (tabName.value === 'receivedOffers')
      return 'Recieved Bids:'
    else
      return 'Sent Bids:'
  }
  return `Bids for ${selectedExistingItem.value.item?.name}`
})

onBeforeMount(async () => {
  await init()
})
</script>

<template>
  <img src="@/assets/images/ruins.png" alt="" class="bg">

  <div class="bids">
    <div class="wrapper">
      <el-tabs v-model="tabName" class="bids-tabs" @tab-change="changeTab">
        <el-tab-pane label="My items" name="receivedOffers"></el-tab-pane>
        <el-tab-pane label="Others items" name="sentOffers"></el-tab-pane>
      </el-tabs>
      <!-- {{ existingItems?.length }} {{ JSON.stringify(pagination) }} {{ maxCount }} -->

      <div class="bids-header">
        <h2>{{ headerName }}</h2>
        <el-button-group class="table-actions">
          <el-button :disabled="filter.offerType === 'WTB'" @click="() => changeOfferType('WTB')">WTB only</el-button>
          <el-button :disabled="filter.offerType === 'WTS'" @click="() => changeOfferType('WTS')">WTS only</el-button>
        </el-button-group>
      </div>
      <div class="bids-table">
        <el-skeleton v-if="loading" :rows="4"></el-skeleton>
        <div class="empty-message" v-else-if="!existingItems?.length">
          <p>Currently no bids here</p>
        </div>
        <div v-if="!selectedExistingItem && existingItems?.length" class="bids-items-list infinite-scroll"
          infinite-scroll-distance="200" v-infinite-scroll="loadMoreExistingItems" infinite-scroll-delay="300">
          <div class="bids-items-list__li" v-for="(existingItem, index) in existingItems" :key="index">
            <div class="item-preview__head">
              <div v-if="newBidsCounter(existingItem)" @click="() => selectExistingItem(existingItem)"
                class="counter item-preview__head__counter">{{ newBidsCounter(existingItem) }}
              </div>
            </div>
            <ItemPreview @click="() => selectExistingItem(existingItem)" :offer-type="existingItem.offerType"
              :wanted-price="existingItem.wantedPrice" :item="existingItem.item" :stats="existingItem.stats" />
          </div>
        </div>
        <div v-if="selectedExistingItem">
          <div class="selected-item__actions">
            <el-button
              @click="router.push(`/user/${selectedExistingItem?.user?.nickname}/items/${selectedExistingItem?.id}`)">Show
              item</el-button>
            <el-button @click="clear">Back</el-button>
          </div>
          <ItemPreview :offer-type="selectedExistingItem.offerType" :wanted-price="selectedExistingItem.wantedPrice"
            :item="selectedExistingItem.item" :stats="selectedExistingItem.stats" />
        </div>
        <div v-if="selectedExistingItem" class="bid-list">
          <div v-if="bids">
            <BidList :existing-item="selectedExistingItem" :bids="bids" @on-bid-deleted="onBidDeleted" @clear="clear"
              :filter="filter" />
          </div>
          <p v-else-if="existingItems?.length">Please select any item</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  position: absolute;
  left: 200px;
  top: 90px;
  height: 100%;
  width: 100%;
  opacity: 0.15;
  background-repeat: no-repeat;
  background-size: cover;
}

// $liHeight: 270px;
$itemsListWidth: 300px;

.bids {
  position: relative;

  bid .bids-tabs {
    margin-bottom: 2rem;
  }

  .bids-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
  }

  .selected-item__actions {
    display: flex;
    margin-bottom: 1rem;

    .el-button {
      width: 100%;
    }
  }

  .table-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }

  .bid-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-left: 1rem;

    p {
      text-align: center;
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
    height: 600px;
  }


  .bids-items-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-top: .25rem;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;

    &__li {
      margin-top: 1rem;
    }
  }

  .empty-message {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
}



@media (max-width:420px) {

  .bids {

    .bids-header {
      flex-direction: column;
    }

    .bids-items-list {
      grid-template-columns: auto;
      justify-content: center;
    }

    .bids-table {
      flex-direction: column;

      .item-preview {
        display: none;
      }

      .bids-items-list {
        .item-preview {
          display: block;
        }
      }
    }
  }
}
</style>

