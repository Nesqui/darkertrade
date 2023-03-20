
<script setup lang="ts">
import ItemPreview from './ItemPreview.vue';
import { PropType, ref } from 'vue';
import { ExistingItem, Item } from '../hooks';
import { CreateBidDto, initBidApi } from '../hooks/bid';
import { ElNotification } from 'element-plus';
import ChoseExistingItem from './ChoseExistingItem.vue'

const emit = defineEmits(['bidCreated'])
const bidApi = initBidApi()
const suggestedItem = ref<ExistingItem>()

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
})

const form = ref({
  amount: 150,
});

const submitBid = async () => {
  if (props.item.existingItems) {
    const req: CreateBidDto = {
      existingItemId: props.item.existingItems[0].id!,
      price: form.value.amount,
    }

    if (suggestedItem.value?.id) {
      req.suggestedExistingItemId = suggestedItem.value.id
    }

    const bid = await bidApi.create(req)
    emit('bidCreated', bid)
    return
  }
  ElNotification({
    message: 'Existing item Id not found, please contact us in discord channel'
  })
  return
};

const onItemChosen = (chosenExistingItem: ExistingItem) => {
  suggestedItem.value = chosenExistingItem
  form.value.amount = chosenExistingItem.wantedPrice!
}

</script>

<template>
  <div v-if="item?.existingItems?.length" class="bidding">
    <div class="item-details">
      <div class="place-bid wtb" v-if="item.existingItems[0].offerType === 'WTB'">
        <p v-if="!suggestedItem">Make sure item you are creating matches the one you have in game</p>
        <ChoseExistingItem v-if="item.existingItems[0].offerType === 'WTB'" @onItemChosen="onItemChosen" :item="item" />
        <el-form :model="form" class="place-bid__form">
          <div class="confirm">
            <p>After accepting bid you will able to chat with user.</p>
            <el-form-item>
              <el-popconfirm width="350" @confirm="submitBid" confirm-button-text="OK" cancel-button-text="No, Thanks"
                :title="`Are you sure to bid this item?`">
                <template #reference>
                  <el-button :disabled="!suggestedItem" size="large">Create Bid</el-button>
                </template>
              </el-popconfirm>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div v-else class="place-bid wts">
        <p>What price are you offering</p>
        <el-form :model="form" class="place-bid__form">
          <el-form-item prop="amount">
            <el-input-number v-model="form.amount" :min="25" :step="25" :step-strictly="true" :precision="0"
              :max="9999" />
          </el-form-item>
          <div class="confirm">
            <p>After accepting bid you will able to chat with user.</p>
            <el-form-item>
              <el-popconfirm width="350" @confirm="submitBid" confirm-button-text="OK" cancel-button-text="No, Thanks"
                :title="`Are you sure to bid this item?`">
                <template #reference>
                  <el-button size="large">Create Bid</el-button>
                </template>
              </el-popconfirm>
            </el-form-item>
          </div>
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

.confirm {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
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

.place-bid {
  width: 100%;
}
</style>