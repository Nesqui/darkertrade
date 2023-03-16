<script setup lang="ts">
import { Chat, ChatMessagesResponse, ChatsCountsResponse, ChatsResponse, ExistingItem, initUserApi, initWs, Message, UnreadMessagesCount } from "@/hooks";
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

const { sendWS } = initWs()

const props = defineProps({
  connected: {
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
  unreadMessagesCount : {
    type: Object as PropType<UnreadMessagesCount[]>,
    required: true
  }
})

onBeforeMount(() => {
  // if (expand.value.chats) {
  //   sendWS("countMessages")
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
    sendWS("findAllChat")
  }
}

const pagination = ref({
  limit: 10,
  offset: 0
})

// Get chat by id and get Messages 
const initChat = async (chatId: number) => {
  sendWS("getChat", { chatId, ...pagination.value })
}

const unreadMessagesCountByChatId = (chatId: number) => {
  if (props.unreadMessagesCount) {
    const chat = props.unreadMessagesCount.find(chat => chat.chatId === chatId)
    if (chat)
      return +chat.unreadMessages
  }
  return 0
}

</script>

<template>
  <!-- OFFER TYPES - RECEIVED OFFERS -->
  <el-collapse class="chat-items" v-model="expand.offerType" accordion @change="loadChats">
    <el-collapse-item class="" :title="offerType === 'receivedOffers' ? 'Received offers' : 'Sent offers'" :name="offerType">
      <div v-for="(existingItem, index) in offers" :key="index">

        <!-- EXISTING ITEMS  -->
        <el-collapse v-model="expand[offerType]" accordion>
          <el-collapse-item v-for="(bid, kIndex) in existingItem.bids" :key="kIndex" :name="index" class="item">
            <template #title>
              <div class="item-name">
                <span class="darker-title">
                  {{ existingItem.item?.name }} | {{ existingItem.offerType }} | {{ existingItem.wantedPrice }}g
                </span>
                <el-button v-if="offerType === 'receivedOffers'"
                  :class="{ 'icon-active': route.path === `/user/${userStore.currentUser.nickname}/items/${existingItem.id}` }"
                  @click.stop="push(`/user/${userStore.currentUser.nickname}/items/${existingItem.id}`)" circle><el-icon>
                    <View />
                  </el-icon></el-button>
                <el-button v-else
                  :class="{ 'icon-active': route.path === `/user/${existingItem.user?.nickname}/items/${existingItem.id}` }"
                  @click.stop="push(`/user/${existingItem.user?.nickname}/items/${existingItem.id}`)" circle><el-icon>
                    <View />
                  </el-icon></el-button>
              </div>
            </template>

            <!-- CHATS  -->
            <div class="bid" v-if="offerType === 'receivedOffers'" @click="initChat(bid.chatId || 0)">
              <div>
                <strong>{{ bid.user.nickname }} - </strong>
                <span class="gold">{{ bid.price }}g</span>
              </div>
              <UnreadCount :count="unreadMessagesCountByChatId(bid.chatId || 0)"/>
            </div>

            <div v-else class="bid" @click="initChat(bid.chatId || 0)">
              <strong>{{ existingItem.user?.nickname }}</strong> <span>{{ bid.price }}g</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped lang="scss">
.chat-items {
  .item {
    margin-bottom: .1rem;
    background-color: #0000004a;
    // padding: .25rem 1rem;
  }

  .item-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-right: 1rem;

    .darker-title {
      font-size: 14px;
      font-weight: 400;
    }
  }

  .bid {
    padding: 1rem 2rem 1rem 2rem;
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
