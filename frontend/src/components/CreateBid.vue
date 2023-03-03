
<script setup lang="ts">
import ItemPreview from './ItemPreview.vue';
import { PropType, ref } from 'vue';
import { ExistingItem, Item } from '../hooks';
import { initBidApi } from '../hooks/bid';
import { ElNotification } from 'element-plus';
import ChoseExistingItem from './ChoseExistingItem.vue'

const step = ref(1)
const bidApi = initBidApi()
const suggestItem = ref<ExistingItem>()

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
})

const form = ref({
  amount: 150,
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US');
};

const submitBid = async () => {
  if (props.item.existingItems) {
    await bidApi.create({
      existingItemId: props.item.existingItems[0].id!,
      price: form.value.amount
    })

    return
  }
  ElNotification({
    message: 'Existing item Id not found, please contact us in discord channel'
  })
  return
};

const onItemChosen = (chosenExistingItem: ExistingItem) => {
  suggestItem.value = chosenExistingItem
}

</script>

<template>
  <div v-if="item?.existingItems?.length" class="bidding">
    <div class="item-details">
      <div class="place-bid wtb" v-if="item.existingItems[0].offerType === 'WTB'">
        <p v-if="!suggestItem">Make sure you have this item in game stash and chose or create him</p>
        <ChoseExistingItem v-if="item.existingItems[0].offerType === 'WTB'" @onItemChosen="onItemChosen" :item="item" />
        <p>Input a wanted cost for this item what you want to receive. Its fine if item Wanted price is different</p>
        <el-form :model="form" class="place-bid__form">
          <el-form-item prop="amount">
            <el-input-number v-model="form.amount" :min="0" :step="25" />
          </el-form-item>
          <el-form-item>
            <p>After creating bid You will able to chat with user. Feel free to ask about comfort time for trade</p>
            <el-popconfirm width="350" @confirm="submitBid" confirm-button-text="OK" cancel-button-text="No, Thanks"
              :title="`Are you sure to bid this item?`">
              <template #reference>
                <el-button size="large">Create Bid</el-button>
              </template>
            </el-popconfirm>
          </el-form-item>
        </el-form>
      </div>
      <ItemPreview v-if="item?.existingItems" :item="item" :wantedPrice="item.existingItems[0].wantedPrice"
        :offerType="item.existingItems[0].offerType" :stats="item?.existingItems[0].stats" />
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

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

// .place-bid {
//   &__form {
//     display: flex;
//     gap: 1rem;
//   }
// }
</style>