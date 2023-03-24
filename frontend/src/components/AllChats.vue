<script setup lang="ts">
import { Chat, ChatCreatedDto, ChatMessagesResponse, ChatOfferType, ChatsCountsResponse, ChatsResponse, ExistingItemUnpublishedChats, Message, OnBidClosed, useMoment } from "@/hooks";
import useSocket, { UnreadMessagesCount } from "@/hooks/ws";
import { useChatStore, useUserStore } from "@/store";
import { ElNotification } from "element-plus";
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import ChatItems from "./ChatItems.vue";
const moment = useMoment()

const { on, off, emit, isConnected } = useSocket()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()
const expand = computed(() => chatStore.expand)
const selectedChat = computed(() => chatStore.selectedChat)

const loading = ref(true)
const unreadMessagesCount = ref<UnreadMessagesCount[]>([])

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

const messagesRef = ref()

const loadingMessageInput = ref(false)
const counts = ref<ChatsCountsResponse>()
const groups = ref<ChatsResponse>({
  sentOffers: [],
  receivedOffers: []
})
const message = ref('')

const scroll = () => {
  if (!selectedChat.value.chatId)
    return

  messagesRef.value.scroll({
    top: messagesRef.value.scrollHeight,
    left: 0,
    behavior: "smooth",
  })
}

const onChatsCountsReceived = async (data: ChatsCountsResponse) => {
  counts.value = data
}

const onChatsReceived = async (data: ChatsResponse) => {
  groups.value = data
  loading.value = false
}

// OPENS CHAT WITH USER!
const onChatMessagesReceive = async (data: ChatMessagesResponse) => {
  chatStore.changeSelectedChat(data)
  loadingMessages.value = false
}

const onCountMessages = async (data: UnreadMessagesCount[]) => {
  unreadMessagesCount.value = data
}

const spliceExistingItem = (existingItemId: number, closeSelectedChatMessage: string) => {
  const keys: ChatOfferType[] = []

  if (selectedChat.value.chat?.bid.existingItemId === existingItemId) {
    chatStore.changeSelectedChat(undefined)
    ElNotification({
      message: closeSelectedChatMessage
    })
  }

  if (groups.value.receivedOffers.length)
    keys.push('receivedOffers')
  if (groups.value.sentOffers.length)
    keys.push('sentOffers')

  if (keys.length) {
    keys.forEach(key => {
      const currentIndex = groups.value[key].findIndex(existingItem => existingItem.id === existingItemId)
      if (currentIndex !== -1) {
        groups.value[key].splice(currentIndex, 1)
      }
    })
  }
}

const onExistingItemUnpublish = (data: ExistingItemUnpublishedChats) => {
  spliceExistingItem(data.existingItemId, 'Chat closed because item was unpublished')
}

const onBidClosed = (data: OnBidClosed) => {
  spliceExistingItem(data.bid.existingItemId, 'Chat closed because bid was closed')
}

const onMessagesReceive = async (data: Message) => {
  loadingMessageInput.value = false
  if (selectedChat.value.chatId === data.chatId) {
    selectedChat.value.messages.push(data)
    emit('readMessagesOnChat', {
      chatId: data.chatId
    })
    nextTick(() => {
      scroll()
    })
  }
}

const onChatCreated = async (data: ChatCreatedDto) => {
  const existingItem = groups.value[data.offerType].find(ei => ei.id === data.existingItem.id)
  if (!existingItem) {
    groups.value[data.offerType].push(data.existingItem)
    return
  }
  if (!existingItem.bids)
    existingItem.bids = []
  if (data.existingItem.bids && data.existingItem.bids[0])
    existingItem.bids.push(data.existingItem.bids[0])
}

const sendMessage = () => {
  if (!message.value) {
    ElNotification({
      message: 'You cant text empty messages'
    })
    return
  }
  if (message.value.length > 150) {
    ElNotification({
      message: 'Message to long. Max is 150 letters'
    })
    return
  }
  loadingMessageInput.value = true
  emit("sendMessage", {
    text: message.value,
    chatId: selectedChat.value.chatId
  })
  message.value = ''
}

const onNotifyError = (message: string) => {
  if (message)
    ElNotification({
      message
    })
}

watch(() => expand.value.chats, () => {
  if (expand.value.chats)
    emit("findAllChat")
})

onBeforeMount(async () => {
  on('notifyError', onNotifyError)

  emit("countAllChat")
  if (expand.value.chats) {
    emit("findAllChat")
    emit("countMessages")
  }
  on('chatsCountsReceived', onChatsCountsReceived)
  on('chatsReceived', onChatsReceived)
  on('receiveChatMessages', onChatMessagesReceive)
  on('receiveMessage', onMessagesReceive)
  on('countMessages', onCountMessages)
  on('existingItemUnpublish', onExistingItemUnpublish)
  on('chatCreated', onChatCreated)
  on('bidClosed', onBidClosed)
})

onMounted(() => {
  nextTick(() => {
    scroll()
  })
})

onBeforeUnmount(() => {
  off('notifyError', onNotifyError)
  off('chatsCountsReceived', onChatsCountsReceived)
  off('chatsReceived', onChatsReceived)
  off('receiveChatMessages', onChatMessagesReceive)
  off('receiveMessage', onMessagesReceive)
  off('countMessages', onCountMessages)
  off('existingItemUnpublish', onExistingItemUnpublish)
  off('chatCreated', onChatCreated)
  off('bidClosed', onBidClosed)
  // chatStore.changeSelectedChat(undefined)
})



// FIND OPENED CHATS WITHOUT MESSAGES 
const loadChats = (opened: number) => {
  emit("countAllChat")
  if (opened) {
    loadingMessages.value = true
    emit("findAllChat")
  }
}

const loadMoreMessages = () => {
  if (chatStore.messagePagination.offset + chatStore.messagePagination.limit > selectedChat.value.count)
    return
  chatStore.messagePagination.offset += chatStore.messagePagination.limit
  emit("getChat", { chatId: selectedChat.value.chatId, ...chatStore.messagePagination })
}

const conversationContact = computed(() => {
  if (!selectedChat.value.users) return undefined
  return selectedChat.value.users.find(user => user.id !== userStore.currentUser.id)
})

const clearActiveChat = async () => {
  chatStore.changeSelectedChat(undefined)
  emit("countAllChat")
  emit("findAllChat")
}

const unreadMessagesTotal = () => {
  if (!unreadMessagesCount.value.length) return 0
  return unreadMessagesCount.value.reduce((pv, cv) => pv + Number(cv.unreadMessages), 0)
}
</script>

<template>
  <div class="chat">
    <!-- ALL CHAT BUTTON  -->
    <el-collapse accordion v-model="expand.chats" @change="loadChats">
      <el-collapse-item class="el-collapse-item__header__first" :class="{ 'warning': unreadMessagesTotal() }" name="1">
        <template #title>
          <div class="chat__title">
            {{ `Chats | Sent - ${counts?.sentOffers || 0} | Received - ${counts?.receivedOffers || 0}` }}
          </div>
        </template>
        <p v-if="!groups.receivedOffers.length && !groups.sentOffers.length && !selectedChat.chatId">
          No active chats</p>
        <div v-if="selectedChat.chatId === 0">
          <!-- OFFER TYPES - RECEIVED OFFERS -->
          <ChatItems v-if="groups.receivedOffers.length" :isConnected="isConnected" :offer-type="'receivedOffers'"
            :offers="groups.receivedOffers" :unread-messages-count="unreadMessagesCount" />
          <ChatItems v-if="groups.sentOffers.length" :isConnected="isConnected" :offers="groups.sentOffers"
            :offer-type="'sentOffers'" :unread-messages-count="unreadMessagesCount" />
        </div>

        <div class="selected-chat" v-else-if="selectedChat.chatId">

          <!-- SELECTED CHAT HEADER  -->
          <div class="selected-chat__actions">
            <span>Chat with: <router-link v-if="conversationContact" :to="'/'">{{
              conversationContact.nickname
            }}</router-link></span>
            <el-button @click="clearActiveChat">Back</el-button>
          </div>

          <el-divider />

          <div class="selected-chat__info">
            <div class="selected-chat__info__li">
              <span>
                Bid item: <strong>{{ selectedChat.chat?.bid.existingItem.item?.name }}</strong>
              </span>
              <el-button v-if="chatStore.currentChatOfferType === 'receivedOffers'"
                :class="{ 'icon-active': route.path === `/user/${userStore.currentUser.nickname}/items/${selectedChat.chat?.bid.existingItem.id}` }"
                @click.stop="push(`/user/${userStore.currentUser.nickname}/items/${selectedChat.chat?.bid.existingItem.id}`)"
                circle><el-icon>
                  <View />
                </el-icon></el-button>
              <el-button v-else
                :class="{ 'icon-active': route.path === `/user/${conversationContact?.nickname}/items/${selectedChat.chat?.bid.existingItem.id}` }"
                @click.stop="push(`/user/${conversationContact?.nickname}/items/${selectedChat.chat?.bid.existingItem.id}`)"
                circle><el-icon>
                  <View />
                </el-icon></el-button>
            </div>

            <div v-if="selectedChat.chat?.bid.suggestedExistingItemId" class="selected-chat__info__li">
              <span>
                Suggested item
              </span>
              <el-button v-if="chatStore.currentChatOfferType !== 'receivedOffers'"
                :class="{ 'icon-active': route.path === `/user/${userStore.currentUser.nickname}/items/${selectedChat.chat?.bid.suggestedExistingItemId}` }"
                @click.stop="push(`/user/${userStore.currentUser.nickname}/items/${selectedChat.chat?.bid.suggestedExistingItemId}`)"
                circle><el-icon>
                  <View />
                </el-icon></el-button>
              <el-button v-else
                :class="{ 'icon-active': route.path === `/user/${conversationContact?.nickname}/items/${selectedChat.chat?.bid.suggestedExistingItemId}` }"
                @click.stop="push(`/user/${conversationContact?.nickname}/items/${selectedChat.chat?.bid.suggestedExistingItemId}`)"
                circle><el-icon>
                  <View />
                </el-icon></el-button>
            </div>
          </div>

          <div ref="messagesRef" class="selected-chat__messages">
            <el-button link v-if="selectedChat.messages.length < selectedChat.count" @click="loadMoreMessages"> READ MORE
            </el-button>
            <p v-if="!selectedChat.messages.length">Chat started</p>

            <!-- MESSAGES  -->
            <span v-for="(message, index) of selectedChat.messages" :class="{
              'system-message': selectedChat.messages.length >= selectedChat.count && index < 2,
              'left-message': index >= 2 && userStore.currentUser.id !== message.userId,
              'right-message': index >= 2 && userStore.currentUser.id === message.userId
            }" :key="index" class="message">
              <p>{{ message.text }}</p>
              <p v-if="!(selectedChat.messages.length >= selectedChat.count && index < 2)" class="date">{{ new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }} {{ new Date(message.createdAt).toLocaleDateString() }}</p>
            </span>
          </div>
          <div class="message-input">
            <el-input @keyup.enter="sendMessage" :disabled="loadingMessageInput" v-model="message"
              placeholder="input text">
            </el-input>
          </div>
        </div>
        <!-- {{ groups }} -->

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
.chat {
  z-index: 2;
  background-color: var(--el-bg-color);
  color: var(--el-color-primary);
  border-radius: 5px 0 0 0;
  outline: none;
  width: 340px;
  position: fixed;
  bottom: 0;
  right: 0;
  border-top: 2px solid rgba(20, 22, 1, 0.1);
  border-left: 2px solid rgba(20, 22, 1, 0.1);
  background-image: url(data:image/png;base64,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);
  box-shadow: 2px 3px 20px #000000, 0 0 125px #000000 inset;

  p {
    padding: 0 1rem;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .chat-header {
    font-weight: 600;
    padding: 0.3rem 1rem;
    cursor: pointer;
  }

  .message {
    // border-radius: 5px;
    display: flex;
    flex-direction: column;
    padding: 3px 0;
    background-color: var(--el-color-danger);
    color: var(--el-bg-color);
    border-radius: 5px;
    font-weight: 600;
    max-width: 70%;
    margin-bottom: .75rem;
    position: relative;
    word-wrap: break-word;

    .date {
      font-size: 10px;
      text-align: right;
    }
    p {
      margin: 0;
    }
  }

  .left-message {
    align-self: self-start;
  }

  .left-message:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 10px solid var(--el-color-danger);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-radius: 10px;
    top: 0;
    left: -10px;
  }

  .right-message {
    align-self: flex-end;
  }

  .right-message:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 10px solid var(--el-color-danger);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-radius: 10px;
    bottom: 0;
    right: -10px;
  }


  .system-message {
    text-align: center;
    background-color: unset;
    color: var(--el-color-danger);
    padding-bottom: .5rem;
    margin: 0 auto .5rem auto;
    width: 100%;
    border-radius: 0;
  }

  .selected-chat {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    padding: 0rem 1rem;
    height: 100%;

    &__actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: .8rem;
      gap: .25rem;
      margin-bottom: .5rem;
    }

    &__info {
      &__li {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &__li:not(:last-child) {
        margin-bottom: .45rem;
      }
    }

    &__messages {
      padding: .55rem 1rem;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 15px;
      margin: 1rem 0;
      background-color: #0000005e;
      scrollbar-width: none;
    }
  }


  .el-divider {
    margin: 0rem 0 .35rem 0;
  }

  .chat-bids {
    padding: 0.3rem 1rem;

    .chat-bid {
      padding: .25rem 0;
      font-weight: 500;
    }

    .chat-bid:not(:last-child) {
      // border-bottom: 1px solid var(--el-border-color);
    }
  }
}

@media (max-width:420px) {
  .chat {
    border-radius: 0;
    width: 100%;
    border-top: 1px solid rgba(20, 22, 1, 0.1);
    border-bottom: unset;
    border-left: unset;
    background-image: url(data:image/png;base64,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);
    box-shadow: unset;
  }
}
</style>

<style lang="scss">
.chat {
  .el-collapse-item__header {
    border: 0;
    padding: 0rem 1rem;
  }

  .message-input {
    margin-bottom: 1rem;

    .el-input {
      height: 37px;

      .el-input__wrapper {
        border-radius: 10px;
        padding: 1px 15px;
        background-color: #00000024;
      }
    }
  }

  .el-collapse {
    --el-transition-duration: .25s;

    .el-collapse {

      .el-collapse-item__arrow {
        display: none;
      }

      .el-collapse-item__header {
        opacity: 0.7;
        background: unset;
        background-size: unset;
        animation: unset;
      }

      .el-collapse-item__header:hover {
        opacity: 1;
      }

      .el-collapse-item__header.is-active {
        opacity: 1;
      }

      .el-collapse-item__content {
        padding: 0;
      }
    }
  }

  .el-collapse-item__header__first {
    overflow: hidden;

    >.el-collapse-item__wrap {
      overflow: hidden;
      // height: 700px;

      >.el-collapse-item__content {
        height: 700px;
        overflow-y: auto;
        overflow-x: hidden;
      }
    }

    .el-collapse-item__header {
      border-radius: 5px 0 0 0;
      outline: none;
    }

    .el-collapse-item__content {
      padding: 0;

      .el-collapse-item__header {
        background-color: transparent;
      }
    }
  }
}

@media (max-width:420px) {
  .chat {
    .el-collapse-item__header__first>.el-collapse-item__wrap>.el-collapse-item__content {
      height: 500px;
    }
  }
}
</style>
