<script setup lang="ts">
import { useUserStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { ExistingItem, Item, useMoment } from '@/hooks';
import { Bid, initBidApi, QueryBidDto } from '@/hooks/bid';
import NicknameOnline from './NicknameOnline.vue';
import ItemPreview from '@/components/ItemPreview.vue';
import { PropType, ref } from 'vue';

const loading = ref(false)
const bidApi = initBidApi()
const userStore = useUserStore()
const moment = useMoment()

const canDeleteBid = (bid: Bid) => {
  if (bid.status === 'created' && bid.userId === userStore.currentUser.id)
    return true
  if (bid.status === 'closed' && bid.userId === userStore.currentUser.id)
    return true
  return false
}

const canAcceptBid = (bid: Bid) => {
  if (existingItem.userId === userStore.currentUser.id && bid.status === 'created')
    return true
  return false
}

const canCloseBid = (bid: Bid) => {
  // Твой бид и статус принят 
  if (bid.userId === userStore.currentUser.id && bid.status === 'accepted')
    return true
  // Твой итем и статус принят 
  if (existingItem.userId === userStore.currentUser.id && bid.status === 'accepted')
    return true
  return false
}

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['onBidDeleted'])

const { existingItem, bids, filter } = defineProps({
  filter: {
    type: Object as PropType<QueryBidDto>,
    required: true
  },
  existingItem: {
    type: Object as PropType<ExistingItem>,
    required: true
  },
  bids: {
    type: Object as PropType<Bid[]>,
    required: true
  }
})

const deleteBid = async (bid: Bid) => {
  try {
    loading.value = true
    await bidApi.deleteBid(bid.id)
    emit('onBidDeleted', bid)
    ElNotification({
      message: 'Bid successfully deleted'
    })
    return
  } catch (error) {
  } finally {
    loading.value = false
  }
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


const closeBid = async (bid: Bid) => {
  try {
    await bidApi.close(bid.id)
    ElNotification({
      message: 'Bid closed'
    })
    bid.status = 'closed'
  } catch (error) {
  }
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
</script>

<template>
  <div class="bids-list">
    <el-table max-height="500" empty-text="Currently no bids here" :data="bids">
      <el-table-column prop="user.nickname" label="From" width="150">
        <template #default="scope">
          <router-link :to="`/user/${scope.row.user.nickname}/items`">
            <NicknameOnline :user="scope.row.user" />
          </router-link>
        </template>
      </el-table-column>
      <el-table-column v-if="existingItem.user" prop="To" label="To" width="150">
        <template #default="scope">
          <router-link :to="`/user/${existingItem.user.nickname}/items/${existingItem.id}`">
            <NicknameOnline :user="existingItem.user" />
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="Price" width="80" />
      <el-table-column prop="status" label="Status" width="100" />
      <el-table-column v-if="filter.offerType === 'WTB'" prop="suggestedExistingItem" label="Suggest" width="85">
        <!-- HAS SUGGESTED ITEM  -->
        <template #default="scope">
          <div v-if="scope.row.suggestedExistingItem">
            <el-popover placement="right-start" title="Item preview" popper-class="popup-tat-frame" trigger="hover">
              <template #reference>
                <el-button circle class="m-2"><el-icon>
                    <View />
                  </el-icon></el-button>
              </template>
              <ItemPreview v-if="existingItem.item" :item="existingItem.item"
                @click="push(`/user/${scope.row.user.nickname}/items/${scope.row.suggestedExistingItemId}`)"
                :wanted-price="scope.row.suggestedExistingItem.wantedPrice" :creator="scope.row.user"
                :offer-type="existingItem.offerType" :stats="scope.row.suggestedExistingItem?.stats" :rarity="existingItem.rarity" />
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
      <el-table-column prop="actions" label="Actions" align="right">
        <template #default="scope">
          <div class="bid-actions">
            <el-tooltip v-if="canAcceptBid(scope.row)" class="box-item" effect="dark" content="Accept offer"
              placement="top-start">
              <div class="bid-action">
                <el-popconfirm width="350" @confirm="acceptBid(scope.row)" confirm-button-text="OK"
                  cancel-button-text="No, Thanks" :title="`Are you sure to accept this bid?`">
                  <template #reference>
                    <el-button circle :loading="loading"><el-icon><Select /></el-icon></el-button>
                  </template>
                </el-popconfirm>
              </div>
            </el-tooltip>
            <el-tooltip v-if="canCloseBid(scope.row)" class="box-item" effect="dark" content="Close offer"
              placement="top-start">
              <div class="bid-action">
                <el-popconfirm width="350" @confirm="closeBid(scope.row)" confirm-button-text="OK"
                  cancel-button-text="No, Thanks" :title="`Are you sure to close this bid?`">
                  <template #reference>
                    <el-button circle :loading="loading"><el-icon>
                        <Close />
                      </el-icon></el-button>
                  </template>
                </el-popconfirm>
              </div>
            </el-tooltip>
            <el-tooltip v-if="canDeleteBid(scope.row)" class="box-item" effect="dark" content="Delete offer"
              placement="top-start">
              <div class="bid-action">
                <el-popconfirm width="350" @confirm="() => deleteBid(scope.row)" confirm-button-text="OK"
                  cancel-button-text="No, Thanks" :title="`Are you sure to delete this bid?`">
                  <template #reference>
                    <el-button circle :loading="loading"><el-icon>
                        <Delete />
                      </el-icon></el-button>
                  </template>
                </el-popconfirm>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.bids-list {
  width: 100%;

  .bid-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: .75rem;
  }
}
</style>


<style lang="scss">
.popup-tat-frame {
  width: var(--frame-width) !important;
}

.bids {
  .el-table {
    width: 860px;
  }

  .el-table__cell {
    text-align: center;
  }

  .el-table__cell:last-child {
    text-align: end;
  }
}

@media (max-width: 1280px) {
  .bids {
    .el-table {
      width: 700px;
    }
  }
}
</style>