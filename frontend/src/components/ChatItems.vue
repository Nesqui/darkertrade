<script setup lang="ts">
import { Chat, ChatMessagesResponse, ChatsCountsResponse, ChatsResponse, ExistingItem, initUserApi, Message } from "@/hooks";
import useSocket, { UnreadMessagesCount } from "@/hooks/ws";
import { useChatStore, useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, PropType, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from 'vue-router';
import UnreadCount from './UnreadCount.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()
const expand = computed(() => chatStore.expand)

const loadingMessages = ref(false)
const push = async (url: string) => {
  await router.push({
    path: '/redirect'
  })
  let redirect = false
  if (route.path === url) {
    redirect = true
  }
  await router.push({
    path: url
  })
  if (redirect)
    router.go(0)
}

const { emit } = useSocket()

const props = defineProps({
  isConnected: {
    type: Boolean,
    required: true,
  },
  offers: {
    type: Object as PropType<ExistingItem[]>,
    required: true
  },
  offerType: {
    type: String as PropType<'sentOffers' | 'receivedOffers'>,
    required: true
  },
  unreadMessagesCount: {
    type: Object as PropType<UnreadMessagesCount[]>,
    required: true
  }
})

onBeforeMount(() => {
  // if (expand.value.chats) {
  //   emit("countMessages")
  // }
  // socket.value.on('chatsCountsReceived', onChatsCountsReceived)
  // socket.value.on('chatsReceived', onChatsReceived)
  // socket.value.on('receiveChatMessages', onChatMessagesReceive)
  // socket.value.on('receiveMessage', onMessagesReceive)
  // socket.value.on('countMessages', onCountMessages)
})

// onBeforeUnmount(() => {
//   console.log('UNMOUNT');
//   socket.value.off('chatsCountsReceived', onChatsCountsReceived)
//   socket.value.off('chatsReceived', onChatsReceived)
//   socket.value.off('receiveChatMessages', onChatMessagesReceive)
//   socket.value.off('receiveMessage', onMessagesReceive)
//   socket.value.off('countMessages', onCountMessages)
// })

// FIND OPENED CHATS WITHOUT MESSAGES 
const loadChats = (opened: number) => {
  if (opened) {
    loadingMessages.value = true
    emit("findAllChat")
  }
}

const pagination = ref({
  limit: 10,
  offset: 0
})

// Get chat by id and get Messages 
const initChat = async (chatId: number) => {
  chatStore.currentChatOfferType = props.offerType
  emit("getChat", { chatId, ...pagination.value })
}

const unreadMessagesCountByChatId = (chatId: number) => {
  if (props.unreadMessagesCount) {
    const chat = props.unreadMessagesCount.find(chat => chat.chatId === chatId)
    if (chat)
      return +chat.unreadMessages
  }
  return 0
}

const unreadMessagesCountByExistingItem = (existingItem: ExistingItem) => {
  if (!existingItem.bids?.length) return 0
  return existingItem.bids.reduce((pv, cv) => pv + unreadMessagesCountByChatId(cv.chatId!), 0)
}

const unreadMessagesCountByOffer = () => {
  if (!props.offers.length) return 0
  return props.offers.reduce((pv, cv) => pv + unreadMessagesCountByExistingItem(cv), 0)
}

</script>

<template>
  <!-- OFFER TYPES - RECEIVED OFFERS -->
  <el-collapse class="chat-items" v-model="expand.offerType" accordion @change="loadChats">
    <el-collapse-item class="" :name="offerType">
      <template #title>
        <div class="chat-items__title">
          <span>
            {{ offerType === 'receivedOffers' ? 'Received offers' : 'Sent offers' }}</span>
          <UnreadCount :count="unreadMessagesCountByOffer()" />
        </div>
      </template>
      <div v-for="(existingItem, index) in offers" :key="index">
        <!-- EXISTING ITEMS  -->
        <el-collapse v-model="expand.existingItem" accordion>
          <el-collapse-item class="item">
            <template #title>
              <div class="item-name">
                <div class="item-name__li">
                  <el-button v-if="offerType === 'receivedOffers'"
                    :class="{ 'icon-active': route.path === `/user/${userStore.currentUser.nickname}/items/${existingItem.id}` }"
                    @click.stop="push(`/user/${userStore.currentUser.nickname}/items/${existingItem.id}`)"
                    circle><el-icon>
                      <View />
                    </el-icon></el-button>
                  <el-button v-else
                    :class="{ 'icon-active': route.path === `/user/${existingItem.user?.nickname}/items/${existingItem.id}` }"
                    @click.stop="push(`/user/${existingItem.user?.nickname}/items/${existingItem.id}`)" circle><el-icon>
                      <View />
                    </el-icon></el-button>
                </div>
                <div class="item-name__li">
                  <span class="darker-title">
                    {{ existingItem.item?.name }}
                  </span>
                </div>
                <div class="item-name__li">
                  <strong>
                    {{ existingItem.offerType }}
                  </strong>
                </div>
                <div class="item-name__li">
                  <strong>{{ existingItem.wantedPrice }}g</strong>
                </div>
                <div class="item-name__li">
                  <UnreadCount :count="unreadMessagesCountByExistingItem(existingItem)" />
                </div>
              </div>
            </template>

            <!-- CHATS  -->
            <div v-for="(bid, kIndex) in existingItem.bids" :key="kIndex" :name="index">
              <div class="bid" v-if="offerType === 'receivedOffers'" @click="initChat(bid.chatId || 0)">
                <div>
                  <strong>{{ bid.user.nickname }} - </strong>
                  <span class="gold">{{ bid.price }}g</span>
                </div>
                <UnreadCount :count="unreadMessagesCountByChatId(bid.chatId || 0)" />
              </div>

              <div v-else class="bid" @click="initChat(bid.chatId || 0)">
                <strong>{{ existingItem.user?.nickname }}</strong> <span>{{ bid.price }}g</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped lang="scss">
.chat-items {

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .item {
    margin-bottom: .1rem;
    background-color: #0000004a;
    // padding: .25rem 1rem;
  }

  .item-name {
    display: grid;
    grid-template-columns: 40px 3fr 1fr 1fr 27px;
    align-items: center;
    // justify-content: space-between;
    // gap: .5rem;
    width: 100%;

    &__li {
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: flex-start;

      .darker-title {
        white-space: nowrap;
        overflow: hidden;
        white-space: nowrap;
        width: 144px;
        text-align: left;
      }
    }

    .darker-title {
      font-size: 14px;
      font-weight: 400;
    }
  }

  .bid {
    padding: 1rem;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .bid:hover {
    background-color: #0000006f;
  }

  .icon-active {
    background-color: var(--el-color-danger);
    color: var(--el-bg-color);
  }
}
</style>

<style lang="scss"></style>
