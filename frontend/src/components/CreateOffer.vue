<script setup lang="ts">
import { CreateOfferDto, CreateOfferPairDto, OfferPair, initOfferApi } from '@/hooks'
import { useUserStore } from '@/store'
import { computed, ref } from 'vue'
import { colors } from '@/hooks'

const emit = defineEmits(['onOfferCreated'])
const props = defineProps(['itemId', 'offerType'])
const MAX_ITEMS = 5
const offerApi = initOfferApi()

const offer = ref({
  offerType: props.offerType,
  offerPairs: [
    {
      rarity: colors[0],
      quantity: 5,
      wantedPrice: 100
    },
    {
      rarity: colors[1],
      quantity: 5,
      wantedPrice: 150
    },
    {
      rarity: colors[2],
      quantity: 5,
      wantedPrice: 200
    }
  ],
  itemId: props.itemId
})

const form = ref({
  rarity: 'rgba(98, 190, 11, 1)',
  wantedPrice: 1,
  quantity: 1
})

const selectedColor = ref('rgba(222, 222, 222, 1)')

const clear = () => {
  selectedColor.value = 'rgb(222,222,222)'
  offer.value.offerPairs = []
}

const onOfferPairAdd = () => {
  if (offer.value.offerPairs.length <= MAX_ITEMS) offer.value.offerPairs.push({ ...form.value })
}

const onOfferCreated = async () => {
  const offerPairs = offer.value.offerPairs.map((pair) => ({
    ...pair,
    rarity: colors.findIndex((color) => color === `${pair.rarity}`)
  }))

  offerPairs.sort((a, b) =>
    a.rarity === b.rarity ? a.wantedPrice - b.wantedPrice : a.rarity - b.rarity
  )

  const payload = {
    ...offer.value,
    offerPairs
  }

  await offerApi.create(payload)
  emit('onOfferCreated')
}

const isValid = computed(() => {
  if (!offer.value.offerPairs.length) return false
  if (offer.value.offerPairs.find((pair) => !pair.quantity || !pair.wantedPrice || !pair.rarity))
    return false

  return true
})

const spliceItem = (index: number) => {
  offer.value.offerPairs.splice(index, 1)
}
</script>

<template>
  <div class="create-offer">
    <div class="offer-pairs">
      <div class="mb-1">
        <div
          class="offer-pairs-item__editable"
          v-for="(pair, index) of offer.offerPairs"
          :key="index"
        >
          <div>
            <label for="">Rarity</label>
            <div class="color-picker">
              <el-color-picker v-model="pair.rarity" show-alpha :predefine="colors" />
            </div>
          </div>
          <div>
            <label for="">Quantity</label>
            <el-input-number :min="1" :max="999" v-model="pair.quantity" />
          </div>
          <div>
            <label for="">Wanted price</label>
            <el-input-number :min="1" :max="999" v-model="pair.wantedPrice" />
          </div>

          <div>
            <label for=""> Remove </label>
            <el-button @click="spliceItem(index)" size="large"
              ><el-icon><Delete /></el-icon
            ></el-button>
          </div>
        </div>
      </div>
      <p v-if="!offer.offerPairs.length">Please add some items</p>
      <el-button
        :disabled="offer.offerPairs.length >= MAX_ITEMS"
        @click="onOfferPairAdd"
        class="w-100"
        >Add more</el-button
      >
    </div>
    <div class="d-flex">
      <el-button @click="clear">Clear</el-button>
      <el-button @click="onOfferCreated" :disabled="!isValid">Create</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.create-offer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.offer-pairs-item__editable {
  display: flex;
  gap: 1rem;
}

.offer-pairs-item__editable:not(:last-child) {
  margin-bottom: 1.5rem;
}
.offer-pairs {
  margin-bottom: 15px;
}
</style>

<style lang="scss">
.create-offer {
  .el-color-picker__trigger {
    height: var(--el-component-size);
    width: var(--el-component-size);
  }
}
</style>
