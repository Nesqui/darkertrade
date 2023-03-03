
<script setup lang="ts">
import { PropType, ref } from 'vue';
import { Item } from '../hooks';
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
})

const form = ref({
  amount: 150,
});
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
    flex: 1;
  }
}

</style>