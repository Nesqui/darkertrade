<script setup lang="ts">
import { Offer, OfferPair, initOfferApi } from '@/hooks'
import { useUserStore } from '@/store'
import { PropType, computed, ref } from 'vue'
import NicknameOnline from './NicknameOnline.vue'
import { ElPopconfirm } from 'element-plus'
import Pair from './ui/OfferPair.vue'

const userStore = useUserStore()
const currentUser = userStore.currentUser
const offerApi = initOfferApi()
const emit = defineEmits(['onOfferDeleted'])
const selectedPair = ref<OfferPair>()
const quantity = ref(1)

const props = defineProps({
  offer: {
    type: Object as PropType<Offer & { averagePrice: number }>,
    required: true
  }
})

const loading = ref(false)

const acceptOfferPair = async () => {
  if (!selectedPair.value) return
  try {
    loading.value = true
    const checkout = await offerApi.acceptOfferPair(selectedPair.value.id, quantity.value)
    selectedPair.value.checkouts.push(checkout)
  } catch (error) {}
  loading.value = false
}
const isCurrentUser = computed(() => props.offer.userId === currentUser.id)

const goToDiscord = () => {
  const link = `https://discord.com/channels/${import.meta.env.VITE_DISCORD_GUILD_ID}/${
    selectedPair.value?.checkouts[0].discordChannelId
  }`
  window.open(link, '_blank')
}

const onOfferDeleted = async (id: number) => {
  await offerApi.remove(id)
  emit('onOfferDeleted', id)
}
</script>

<template>
  <div class="offer wrapper">
    <div class="avatar-wrapper">
      <div class="mb-1">
        <strong> <NicknameOnline link :user="offer.user" /> </strong>
      </div>
      <label for="">Stats:</label>
      <div><strong>Price AVG:</strong> {{ Number(offer.averagePrice).toFixed() }}</div>
      <div><strong>Active offers:</strong> (Soon)</div>
      <div><strong>User rank:</strong> (Soon)</div>
      <div><strong>Complete offers:</strong> (Soon)</div>
    </div>
    <div class="offer-pairs">
      <label for="">Pairs:</label>
      <Pair
        :offerPair="offerPair"
        v-for="(offerPair, index) of offer.offerPairs"
        :key="index"
        @click="selectedPair = offerPair"
        :class="{ selected: selectedPair?.id === offerPair.id }"
      />
    </div>
    <div class="offer-actions-wrapper">
      <div class="offer-actions">
        <div class="d-flex justify-space-between">
          <div>
            <label for="">Quantity:</label>
            <el-input-number :disabled="isCurrentUser" v-model="quantity" />
          </div>
          <div v-if="!selectedPair?.checkouts.length">
            <label for="">Checkout:</label>
            <el-button
              :disabled="!quantity || !selectedPair || isCurrentUser || loading"
              @click="acceptOfferPair"
              size="large"
              >{{ offer.offerType === 'WTS' ? 'Buy' : 'Sell' }}</el-button
            >
          </div>
          <div v-else>
            <label for="">Chat:</label>
            <el-button @click="goToDiscord" size="large"
              ><img src="@/assets/svg/discord-icon.svg" class="icon" alt=""
            /></el-button>
          </div>
        </div>
      </div>
      <div class="user-actions">
        <el-popconfirm
          width="350"
          @confirm="onOfferDeleted(offer.id)"
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          :title="`Are you sure to delete this offer?`"
          v-if="currentUser.id === offer.userId || currentUser.isAdmin"
        >
          <template #reference>
            <el-button
              ><el-icon><Delete /></el-icon
            ></el-button>
          </template>
        </el-popconfirm>

        <ElTooltip content="Downvote user (Soon)">
          <el-button disabled
            ><el-icon><ArrowDown /></el-icon
          ></el-button>
        </ElTooltip>

        <ElTooltip content="Upvote user (Soon)">
          <el-button disabled
            ><el-icon><ArrowUp /></el-icon
          ></el-button>
        </ElTooltip>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.offer {
  display: flex;
  justify-content: space-between;
  height: 170px;
  min-height: 150px;
  overflow: hidden;
}

.icon {
  width: 23px;
}

.offer-actions-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.offer:not(:last-child) {
  margin-bottom: 8px;
}

.user-actions {
  display: flex;
  justify-content: end;
  gap: 1px;
}
</style>
