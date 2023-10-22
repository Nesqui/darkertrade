<script setup lang="ts">
// import {
//   Chat,
//   ChatMessagesResponse,
//   ChatsCountsResponse,
//   ChatsResponse,
//   ExistingItem,
//   initUserApi,
//   Message,
//   Offer
// } from '@/hooks'
// import useSocket, { UnreadMessagesCount } from '@/hooks/ws'
// import { useChatStore, useUserStore } from '@/store'
// import { storeToRefs } from 'pinia'
// import {
//   computed,
//   nextTick,
//   onBeforeMount,
//   onBeforeUnmount,
//   onMounted,
//   PropType,
//   ref,
//   watch,
//   watchEffect
// } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
// import UnreadCount from './UnreadCount.vue'
// import NicknameOnline from './NicknameOnline.vue'

// const route = useRoute()
// const router = useRouter()
// const userStore = useUserStore()
// const chatStore = useChatStore()
// const expand = computed(() => chatStore.expand)

// const loadingMessages = ref(false)
// const push = async (url: string) => {
//   await router.push({
//     path: '/redirect'
//   })
//   let redirect = false
//   if (route.path === url) {
//     redirect = true
//   }
//   await router.push({
//     path: url
//   })
//   if (redirect) router.go(0)
// }

// const { emit } = useSocket()

// const props = defineProps({
//   isConnected: {
//     type: Boolean,
//     required: true
//   },
//   offers: {
//     type: Object as PropType<Offer[]>,
//     required: true
//   },
//   offerType: {
//     type: String as PropType<'miscSales' | 'miscPurchases'>,
//     required: true
//   },
//   unreadMessagesCount: {
//     type: Object as PropType<UnreadMessagesCount[]>,
//     required: true
//   }
// })

// onBeforeMount(() => {
// if (expand.value.chats) {
//   emit("countMessages")
// }
// socket.value.on('chatsCountsReceived', onChatsCountsReceived)
// socket.value.on('chatsReceived', onChatsReceived)
// socket.value.on('receiveChatMessages', onChatMessagesReceive)
// socket.value.on('receiveMessage', onMessagesReceive)
// socket.value.on('countMessages', onCountMessages)
// })

// onBeforeUnmount(() => {
//   socket.value.off('chatsCountsReceived', onChatsCountsReceived)
//   socket.value.off('chatsReceived', onChatsReceived)
//   socket.value.off('receiveChatMessages', onChatMessagesReceive)
//   socket.value.off('receiveMessage', onMessagesReceive)
//   socket.value.off('countMessages', onCountMessages)
// })

// FIND OPENED CHATS WITHOUT MESSAGES
// const loadChats = (opened: number) => {
//   if (opened) {
//     loadingMessages.value = true
//     emit('findAllChat')
//   }
// }

// const pagination = ref({
//   limit: 10,
//   offset: 0
// })

// // Get chat by id and get Messages
// const initChat = async (chatId: number) => {
//   chatStore.currentChatOfferType = props.offerType
//   emit('getChat', { chatId, ...pagination.value })
// }

// const unreadMessagesCountByChatId = (chatId: number) => {
//   if (props.unreadMessagesCount) {
//     const chat = props.unreadMessagesCount.find((chat) => chat.chatId === chatId)
//     if (chat) return +chat.unreadMessages
//   }
//   return 0
// }

// const unreadMessagesCountByExistingItem = (existingItem: ExistingItem) => {
//   if (!existingItem.bids?.length) return 0
//   return existingItem.bids.reduce((pv, cv) => pv + unreadMessagesCountByChatId(cv.chatId!), 0)
// }

// const unreadMessagesCountByOffer = (offer: Offer) => {
//   if (!offer.offerPairs?.length) return 0
//   return offer.offerPairs.reduce((pv, cv) => pv + unreadMessagesCountByChatId(cv.chatId!), 0)
// }

// const unreadMessagesCountByOffer = () => {
//   if (!props.offers.length) return 0
//   return props.offers.reduce((pv, cv) => pv + unreadMessagesCountByExistingItem(cv), 0)
// }
</script>

<template>
  <div></div>
  <!-- <el-collapse class="chat-items" v-model="expand.offerType" accordion @change="loadChats">
    <el-collapse-item class="" :name="offerType">
      <template #title>
        <div class="chat-items__title">
          <span> Misc {{ offerType === 'miscPurchases' ? ' purchases' : 'sales' }}</span>
        </div>
      </template>
      <div v-for="(offer, index) in offers" :key="index">
        <el-collapse v-model="expand.offer" accordion>
          <el-collapse-item class="item">
            <template #title>
              <div class="item-name">
                <div class="item-name__li">
                  <span class="darker-title">
                    {{ offer.item.name }}
                  </span>
                </div>
                <div class="item-name__li">
                  <strong>
                    {{ offer.offerType }}
                  </strong>
                </div>
                <div class="item-name__li">
                </div>
              </div>
            </template>

            <div
              v-for="(offerPair, kIndex) in offer.offerPairs"
              :key="kIndex"
              class="offer-pair-info"
              @click="initChat(offerPair.checkout.chatId || 0)"
            >
              <NicknameOnline
                :user="
                  offerType === 'miscPurchases'
                    ? offerPair.checkout.seller
                    : offerPair.checkout.purchaser
                "
              />

              <strong>{{ offerPair.checkout.price }}</strong>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-collapse-item>
  </el-collapse> -->
</template>

<style scoped lang="scss">
// .chat-items {
//   &__title {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     width: 100%;
//   }

//   .item {
//     margin-bottom: 0.1rem;
//     background-color: #0000004a;
//     // padding: .25rem 1rem;
//   }

//   .item-name {
//     display: flex;
//     // grid-template-columns: auto auto;
//     align-items: center;
//     justify-content: space-between;
//     gap: 0.5rem;
//     width: 100%;

//     &__li {
//       display: flex;
//       align-items: center;
//       height: 100%;
//       justify-content: flex-start;

//       .darker-title {
//         white-space: nowrap;
//         overflow: hidden;
//         white-space: nowrap;
//         width: 144px;
//         text-align: left;
//       }
//     }

//     .darker-title {
//       font-size: 14px;
//       font-weight: 400;
//     }
//   }

//   .offer-pair-info {
//     padding: 1rem;
//     cursor: pointer;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }

//   .offer-pair:hover {
//     background-color: #0000006f;
//   }
// }
</style>

<style lang="scss"></style>
