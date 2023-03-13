
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { PropType, ref } from 'vue';
import { Item, useMoment } from '../hooks';
import { Bid, initBidApi } from '../hooks/bid';
import { useUserStore } from '../store';
import ItemPreview from './ItemPreview.vue';

const bidApi = initBidApi()
const userStore = useUserStore()
const emit = defineEmits(['bidDeleted'])
const loading = ref(false)
const moment = useMoment()
const route = useRoute()
const router = useRouter()
const canDeleteBid = (bid: Bid) => bid.userId === userStore.currentUser.id
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
})

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

const deleteBid = async (bid: Bid) => {
  try {
    loading.value = true
    await bidApi.deleteBid(bid.id)
    emit('bidDeleted', bid)
  } catch (error) {

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="item?.existingItems?.length" class="bidding">
    <div class="item-details">
      <div class="item-bids">
        <div class="item-bids__header">
          <h2>Current Bids</h2>
        </div>
        <div class="item-bids__list">
          <p v-if="item?.existingItems[0].bids && !item?.existingItems[0].bids.length">Currently no active bids</p>
          <div v-for="(bid, index) in item.existingItems[0].bids" :key="index" class="item-bids__list__item">
            <strong>{{ bid.user.nickname }}</strong>
            <span>{{ moment.fromNow(bid.createdAt) }}</span>
            <span>{{ bid.price }} Gold</span>
            <div class="actions">
              <el-popover v-if="bid.suggestedExistingItemId" placement="top-start" title="Item preview" popper-class="popup-tat-frame" trigger="hover">
                <template #reference>
                  <el-button class="m-2">Item</el-button>
                </template>
                <ItemPreview :item="item" @click="push(`/user/${bid.user.nickname}/items/${bid.suggestedExistingItemId}`)" :wanted-price="bid.suggestedExistingItem?.wantedPrice" :stats="bid.suggestedExistingItem?.stats" />
              </el-popover>
              <el-popconfirm v-if="canDeleteBid(bid)" width="350" @confirm="deleteBid(bid)" confirm-button-text="OK"
                cancel-button-text="No, Thanks" :title="`Are you sure to delete this bid?`">
                <template #reference>
                  <el-button :loading="loading">Delete</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.bidding {
  width: 100%;


  h2 {
    margin-bottom: 0;
  }

  .item-details {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 1rem;
    gap: 1rem;
    width: 100%;

    .item-bids {
      display: flex;
      flex-direction: column;
      width: 100%;

      &__list {
        padding: 1rem 0;
      }

      &__list__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>

<style lang="scss">
.popup-tat-frame {
  width: var(--frame-width) !important;
}
</style>