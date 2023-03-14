<script setup lang="ts">
import { ExistingItem, useMoment } from '@/hooks'
import { Bid, initBidApi, QueryBidDto } from '@/hooks/bid'
import { nextTick, onBeforeMount, ref, watch } from 'vue'
import ItemPreview from '@/components/ItemPreview.vue';
import { useUserStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';

const bidApi = initBidApi()
const existingItems = ref<ExistingItem[]>()
const userStore = useUserStore()
const moment = useMoment()
const loading = ref(true)
const tabName = ref<'sentOffers' | 'receivedOffers'>('receivedOffers')
const canDeleteBid = (bid: Bid) => bid.userId === userStore.currentUser.id
const canAcceptBid = (bid: Bid) => bid.status === 'created' && bid.userId !== userStore.currentUser.id
const canDeclineBid = (bid: Bid) => bid.status === 'created' && bid.userId !== userStore.currentUser.id
const maxCount = ref(6)
const route = useRoute()
const router = useRouter()
const selectedExistingItem = ref<ExistingItem>()

const filter = ref<QueryBidDto>({
  mine: true,
  sort: [['id', 'DESC']],
  limit: 6,
  offset: 0,
  offerType: 'WTS'
})

const pagination = ref({
  limit: 6,
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
      const { rows } = await bidApi.filter({
        ...filter.value,
        ...pagination.value
      })
      if (existingItems.value?.length)
        existingItems.value = [...existingItems.value, ...rows]
    }
  } catch (error) {
  }
}

const deleteBid = async (bid: Bid) => {
  try {
    if (!bids.value || !existingItems.value || !selectedExistingItem.value)
      return
    loading.value = true
    let success = false
    const bidIndex = bids.value.findIndex(b => b.id === bid.id)
    if (bidIndex !== -1) {
      bids.value?.splice(bidIndex, 1)
      if (!bids.value?.length) {
        const eiIndex = existingItems.value.findIndex(ei => ei.id === selectedExistingItem.value?.id)
        if (eiIndex !== -1) {
          existingItems.value.splice(eiIndex, 1)
          selectedExistingItem.value = undefined
          await bidApi.deleteBid(bid.id)
          success = true
        }

        // if ()
      }
    }
    if (success) {
      ElNotification({
        message: 'Bid successfully deleted'
      })
      return
    }
    ElNotification({
      message: 'Bid not found'
    })
  } catch (error) {
  } finally {
    loading.value = false
  }
}

watch(filter.value, async () => {
  pagination.value.offset = 0
  bids.value = []
  await init()
})

const changeTab = () => {
  filter.value.mine = tabName.value === 'sentOffers' ? false : true
}

const push = async (url: string) => {
  let redirect = false
  if (route.path === url) {
    redirect = true
  }
  await router.push({
    path: url,
  })
  if (redirect)
    router.go(0)
}

const selectExistingItem = (existingItem: ExistingItem) => {
  selectedExistingItem.value = existingItem
  bids.value = existingItem.bids
}

const clear = () => {
  selectedExistingItem.value = undefined
  bids.value = undefined
}

const changeOfferType = (offerType: 'WTB' | 'WTS') => {
  filter.value.offerType = offerType
  clear()
}

const acceptBid = async (bid: Bid) => {
  try {
    await bidApi.accept(bid.id)
    ElNotification({
      message: 'Bid accepted'
    })
    bid.status = 'accepted'
  } catch (error) {
  }
}
const declineBid = async (bid: Bid) => { }
onBeforeMount(async () => {
  await init()
})
</script>

<template>
  <div class="bids">
    {{ existingItems?.length }} {{ pagination.limit }} {{ pagination.offset }} {{ maxCount }}
    <div class="wrapper">
      <el-tabs v-model="tabName" class="bids-tabs" @tab-change="changeTab">
        <el-tab-pane label="Received offers" name="receivedOffers"></el-tab-pane>
        <el-tab-pane label="Sent offers" name="sentOffers"></el-tab-pane>
      </el-tabs>
      <!-- {{ existingItems }} -->
      <div class="bids-table">
        <div v-if="existingItems?.length">
          <div class="bids-items-list infinite-scroll" infinite-scroll-distance="200"
            v-infinite-scroll="loadMoreExistingItems" infinite-scroll-delay="300">
            <div class="bids-items-list__li" v-for="(existingItem, index) in existingItems" :key="index">
              <div class="item-preview__head">
                <div v-if="existingItem.bids?.length" @click="() => selectExistingItem(existingItem)"
                  class="item-preview__head__counter">{{ existingItem.bids.length > 9 ? '9+' : existingItem.bids.length }}
                </div>
              </div>
              <ItemPreview @click="() => selectExistingItem(existingItem)" :offer-type="existingItem.offerType"
                :wanted-price="existingItem.wantedPrice" :item="existingItem.item" :stats="existingItem.stats" />
            </div>
          </div>
        </div>
        <div class="bids-list">
          <el-button-group class="table-actions">
            <el-button :disabled="filter.offerType === 'WTB'" @click="() => changeOfferType('WTB')">WTB only</el-button>
            <el-button :disabled="filter.offerType === 'WTS'" @click="() => changeOfferType('WTS')">WTS only</el-button>
          </el-button-group>
          <el-table empty-text="Please choose any item" v-if="existingItems?.length && !loading" :data="bids"
            style="width: 100%">
            <el-table-column prop="user.nickname" label="Nickname" width="140">
              <template #default="scope">
                <router-link :to="`/user/${scope.row.user.nickname}/items`">{{ scope.row.user.nickname }}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="Price" width="80" />
            <el-table-column prop="status" label="Status" width="100" />
            <el-table-column v-if="filter.offerType === 'WTB'" prop="suggestedExistingItem" label="Suggest" width="125">
              <!-- HAS SUGGESTED ITEM  -->
              <template #default="scope">
                <div v-if="scope.row.suggestedExistingItem">
                  <el-popover placement="right-start" title="Item preview" popper-class="popup-tat-frame" trigger="hover">
                    <template #reference>
                      <el-button class="m-2"><el-icon>
                          <View />
                        </el-icon></el-button>
                    </template>
                    <ItemPreview v-if="selectedExistingItem && selectedExistingItem.item"
                      :item="selectedExistingItem.item"
                      @click="push(`/user/${scope.row.user.nickname}/items/${scope.row.suggestedExistingItemId}`)"
                      :wanted-price="scope.row.suggestedExistingItem.wantedPrice"
                      :stats="scope.row.suggestedExistingItem?.stats" />
                  </el-popover>
                </div>
                <div v-else>
                  err
                </div>
              </template>

            </el-table-column>
            <el-table-column prop="createdAt" label="Created at" width="180">
              <template #default="scope">
                {{ moment.fromNow(scope.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="actions" label="Actions">
              <template #default="scope">
                <div class="bid-actions">
                  <el-tooltip class="box-item" effect="dark" content="Accept offer" placement="top-start">
                    <div v-if="canAcceptBid(scope.row)" class="bid-action">
                      <el-popconfirm width="350" @confirm="acceptBid(scope.row)" confirm-button-text="OK"
                        cancel-button-text="No, Thanks" :title="`Are you sure to accept this bid?`">
                        <template #reference>
                          <el-button :loading="loading"><el-icon><Select /></el-icon></el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </el-tooltip>
                  <el-tooltip class="box-item" effect="dark" content="Decline offer" placement="top-start">
                    <div class="bid-action">
                      <el-popconfirm v-if="canDeclineBid(scope.row)" width="350" @confirm="declineBid(scope.row)"
                        confirm-button-text="OK" cancel-button-text="No, Thanks"
                        :title="`Are you sure to decline this bid?`">
                        <template #reference>
                          <el-button :loading="loading"><el-icon>
                              <Close />
                            </el-icon></el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </el-tooltip>
                  <el-popconfirm v-if="canDeleteBid(scope.row)" width="350" @confirm="() => deleteBid(scope.row)"
                    confirm-button-text="OK" cancel-button-text="No, Thanks" :title="`Are you sure to delete this bid?`">
                    <template #reference>
                      <el-button :loading="loading"><el-icon>
                          <Delete />
                        </el-icon></el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="loading">
        <el-skeleton :rows="6"></el-skeleton>
      </div>
      <div v-else-if="!existingItems?.length">
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

  .wrapper {
    width: var(--wrapper-xxl-width);
  }

  a {
    color: var(--el-color-danger);
    font-weight: 600;
  }

  .bid-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: .25rem;
  }

  .item-preview__head {
    position: relative;
    width: 100%;

    &__counter {
      position: absolute;
      left: calc($itemsListWidth - 2rem - 23px);
      top: -13px;
      background-color: var(--el-color-danger);
      box-shadow: var(--wrapper-box-shadow);
      color: var(--el-bg-color);
      border-radius: 50%;
      height: 36px;
      width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      transition: all .5s;
      cursor: pointer;
    }

    &__counter:hover {
      transform: scale(1.1);
    }
  }

  .table-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
  }

  .bids-table {
    display: flex;
  }

  .bids-items-list-title {
    width: $itemsListWidth;
    padding-bottom: 1rem;
    text-align: center;
  }

  .bids-list {
    width: 100%;
    padding: 0 1rem;
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
}
</style>


<style lang="scss">
.popup-tat-frame {
  width: var(--frame-width) !important;
}

.bids {
  .el-table__cell {
    text-align: center;
  }

  .el-table__cell:last-child {
    text-align: end;
  }
}
</style>