<script setup lang="ts">
import { Offer, QueryOfferDto, initOfferApi } from '@/hooks'
import { useUserStore } from '@/store'
import { computed, onBeforeMount, ref } from 'vue'
import OfferItem from '../components/OfferItem.vue'
import CreateOffer from '../components/CreateOffer.vue'

const userStore = useUserStore()
const offerApi = initOfferApi()

const offers = ref<Offer[] & { averagePrice: number }[]>([])
const isAuth = computed(() => userStore.isAuth)
const props = defineProps(['offerType', 'itemId'])

const filter = ref<QueryOfferDto>({
  hideMine: true,
  limit: 15,
  offset: 0,
  offerType: props.offerType,
  itemId: props.itemId
})

const showForm = ref(false)
const loadings = ref({
  market: false
})

const onOfferDeleted = async (id: number) => {
  const index = offers.value.findIndex((offer) => offer.id == id)
  if (index != -1) offers.value.splice(index, 1)
}

const onOfferCreated = async () => {
  showForm.value = false
  await getMarket()
}

const getMarket = async () => {
  loadings.value.market = true
  const { rows, count } = await offerApi.getMarket(filter.value)
  offers.value = rows
  loadings.value.market = false
}

onBeforeMount(async () => {
  await getMarket()
})
</script>

<template>
  <div class="offers-wrapper">
    <div class="d-flex justify-end">
      <el-switch
        v-if="isAuth"
        v-model="filter.hideMine"
        size="large"
        active-text="Hide mine"
        inactive-text="Show all"
        @change="getMarket"
      />
      <el-button @click="showForm = !showForm">{{ showForm ? 'Back' : 'Create offer' }}</el-button>
    </div>
    <teamplate v-if="showForm">
      <div class="text-divider">Offer creator</div>
      <CreateOffer :itemId="itemId" @onOfferCreated="onOfferCreated" :offerType="offerType" />
    </teamplate>
    <template v-else>
      <div class="text-divider">{{ offerType === 'WTS' ? 'Sellers' : 'Buyers' }}</div>
      <div v-if="!loadings.market" class="offer-market">
        <OfferItem
          @onOfferDeleted="onOfferDeleted"
          v-for="(offer, index) in offers"
          :offer="offer"
          :key="index"
        />
        <p v-if="!offers.length">Currently no offers here</p>
      </div>
      <div v-else class="offer-market">
        <el-skeleton
          :rows="2"
          v-for="(v, index) of new Array(5)"
          :key="index"
          animated
          class="mb-3"
        ></el-skeleton>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.offers-wrapper {
  width: 100%;
}

.offer-market {
  height: 100%;
  max-height: 900px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.text-divider {
  margin-top: unset;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 2rem;
}
</style>
