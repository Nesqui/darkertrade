
<script setup lang="ts">
import { PropType, ref } from 'vue';
import { Item } from '../hooks';
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
})
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
            <span>{{ bid.user.nickname }}</span>
            <span>{{ new Date(bid.createdAt).toLocaleDateString() }}</span>
            <span>{{ bid.price }} Gold</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.bidding {
  width: 100%;
}

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
      justify-content: space-between;
    }
  }
}
</style>