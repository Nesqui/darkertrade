<script setup lang="ts">
import { Checkout, initItemApi, initOfferApi, Offer, OfferPair } from '@/hooks'
import { useItemStore, useUserStore } from '@/store'
import { ref, onBeforeMount } from 'vue'
import NicknameOnline from '@/components/NicknameOnline.vue'
import OfferPairComponent from '@/components/ui/OfferPair.vue'

const itemApi = initItemApi()
const offerApi = initOfferApi()

const loadings = ref({
  market: false
})

const selectedOfferPair = ref<OfferPair>()

const offers = ref<Offer[]>([])

const getMine = async () => {
  loadings.value.market = true
  offers.value = await offerApi.getMine()
  loadings.value.market = false
}

const goToDiscord = (checkout: Checkout) => {
  const link = `https://discord.com/channels/${import.meta.env.VITE_DISCORD_GUILD_ID}/${
    checkout.discordChannelId
  }`
  window.open(link, '_blank')
}

const onOfferDeleted = async (id: number) => {
  const offerIndex = offers.value.findIndex((offer) => offer.id === id)
  if (offerIndex === -1) return
  await offerApi.remove(id)
  offers.value.splice(offerIndex, 1)
  selectedOfferPair.value = undefined
}

onBeforeMount(async () => {
  await getMine()
})
</script>

<template>
  <img src="@/assets/images/library1.png" alt="" class="bg" />
  <div class="market-wrapper">
    <div class="overflow-wrapper" v-if="!loadings.market">
      <div class="offer-wrapper">
        <div v-for="(offer, index) of offers" :key="index" class="wrapper">
          <div class="offer">
            <div class="item-img">
              <img :src="itemApi.getImg(offer.item)" alt="" />
            </div>
            <div class="avatar-wrapper">
              <label for="">Stats:</label>
              <div><strong>Price AVG:</strong> {{ Number(offer.averagePrice).toFixed() }}</div>
            </div>
            <div>
              <OfferPairComponent
                v-for="(offerPair, kindex) of offer.offerPairs"
                :key="kindex"
                class="pair"
                :checkouts="offerPair.checkouts.length"
                :class="{ selected: selectedOfferPair?.id === offerPair.id }"
                @click="selectedOfferPair = offerPair"
                :offer-pair="offerPair"
              />
            </div>
            <el-popconfirm
              width="350"
              @confirm="onOfferDeleted(offer.id)"
              confirm-button-text="OK"
              cancel-button-text="No, Thanks"
              :title="`Are you sure to delete this offer?`"
            >
              <template #reference>
                <el-button
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
        <div v-if="!offers.length" class="wrapper">
          <h3>Misc items:</h3>
          <p>You are not holding any offers</p>
        </div>
      </div>
    </div>
    <div class="offer-wrapper" v-else>
      <div class="wrapper" v-for="(v, index) of new Array(3)" :key="index">
        <el-skeleton :rows="1" animated class="mb-3" />
      </div>
    </div>
    <div class="wrapper">
      <h3>Checkouts:</h3>
      <p>{{ selectedOfferPair ? 'Last 50 checkouts: ' : 'Select any offer pair' }}</p>
      <div class="checkouts-wrapper">
        <div
          class="checkout"
          v-for="(checkout, index) of selectedOfferPair?.checkouts"
          :key="index"
        >
          <div>
            <label for="">Seller:</label>
            <NicknameOnline link :user="checkout.seller" />
          </div>
          <div>
            <label for="">Purchaser:</label>
            <NicknameOnline link :user="checkout.purchaser" />
          </div>
          <div>
            <label for="">Quantity:</label>
            <strong>{{ checkout.quantity }}</strong>
          </div>
          <div>
            <label for="">Price:</label>
            <strong>{{ checkout.price }}</strong>
          </div>
          <div>
            <label for="">Created At:</label>
            <strong>{{ new Date((checkout as any).createdAt!).toLocaleDateString() }}</strong>
          </div>
          <div class="text-right">
            <label for="">Chat:</label
            ><img
              @click="goToDiscord(checkout)"
              size="small"
              src="@/assets/svg/discord-icon.svg"
              class="icon"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.market-wrapper {
  gap: 26px;
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: center;
  width: 70%;
  align-items: start;

  .overflow-wrapper {
    max-height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 15px;
  }

  .offer-wrapper {
    display: flex;
    flex-direction: column;
    gap: 26px;
    min-width: 450px;
  }

  .offer {
    display: flex;
    gap: 35px;
    align-items: center;
  }
}

.checkout {
  display: flex;
  justify-content: space-between;
  align-items: start;
}
.checkout:not(:last-child) {
  margin-bottom: 5px;
  padding-bottom: 5px;
}
.icon {
  width: 23px;
  padding-right: 3px;
  cursor: pointer;
}

.item-img {
  display: flex;
  padding: 16px 0;
  align-items: center;
  justify-content: center;
  width: 75px;

  img {
    height: 80px;
  }
}

.bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  opacity: 0.1;
  background-repeat: no-repeat;
  background-size: cover;
}

@media (max-width: 1255px) {
  .bg {
    left: 50%;
    width: unset;
    height: 100%;
    transform: translateX(-48%);
  }
}
</style>
