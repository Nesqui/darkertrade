<script setup lang="ts">
import { Chat, ChatMessagesResponse, ChatsCountsResponse, ChatsResponse, initUserApi, initWs, Message, UnreadMessagesCount } from "@/hooks";
import { useChatStore, useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from 'vue-router';
import ChatItems from "./ChatItems.vue";

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
const groups = ref<ChatsResponse>()
const message = ref('')
const { sendWS, socket } = initWs()

const props = defineProps({
  connected: {
    type: Boolean,
    required: true,
  }
})

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
  console.log('onChatsCountsReceived', data);

  counts.value = data
}

const onChatsReceived = async (data: ChatsResponse) => {
  groups.value = data
  loading.value = false
}

const onChatMessagesReceive = async (data: ChatMessagesResponse) => {
  chatStore.changeSelectedChat(data)
  loadingMessages.value = false
}

const onCountMessages = async (data: UnreadMessagesCount[]) => {
  unreadMessagesCount.value = data
}

const onMessagesReceive = async (data: Message) => {
  console.log('onMessagesReceive', data);

  loadingMessageInput.value = false
  if (selectedChat.value.chatId === data.chatId) {
    selectedChat.value.messages.push(data)

    nextTick(() => {
      scroll()
    })
  }
}

const sendMessage = () => {
  loadingMessageInput.value = true
  sendWS("sendMessage", {
    text: message.value,
    chatId: selectedChat.value.chatId
  })
  message.value = ''
}

// watchEffect(() => {
//   if (props.connected) {
//     console.log('WATCH PROPS');
//     sendWS("countAllChat")
//   }
// })

// watch(() => props.connected, () => {
//   if (props.connected) {
//     console.log('WATCH PROPS');
//     sendWS("countAllChat")
//   }
// })

watch(() => expand.value.chats, () => {
  if (expand.value.chats)
    sendWS("findAllChat")
})

onBeforeMount(() => {
  sendWS("countAllChat")
  if (expand.value.chats) {
    sendWS("findAllChat")
    sendWS("countMessages")
  }
  socket.value.on('chatsCountsReceived', onChatsCountsReceived)
  socket.value.on('chatsReceived', onChatsReceived)
  socket.value.on('receiveChatMessages', onChatMessagesReceive)
  socket.value.on('receiveMessage', onMessagesReceive)
  socket.value.on('countMessages', onCountMessages)
})

onMounted(() => {
  nextTick(() => {
    scroll()
  })
})

onUnmounted(() => {
  socket.value.off('chatsCountsReceived', onChatsCountsReceived)
  socket.value.off('chatsReceived', onChatsReceived)
  socket.value.off('receiveChatMessages', onChatMessagesReceive)
  socket.value.off('receiveMessage', onMessagesReceive)
  socket.value.off('countMessages', onCountMessages)
})

// FIND OPENED CHATS WITHOUT MESSAGES 
const loadChats = (opened: number) => {
  console.log('loadChats');
  sendWS("countAllChat")
  if (opened) {
    loadingMessages.value = true
    sendWS("findAllChat")
  }
}

const loadMoreMessages = () => {
  if (chatStore.messagePagination.offset + chatStore.messagePagination.limit > selectedChat.value.count)
    return
  chatStore.messagePagination.offset += chatStore.messagePagination.limit
  sendWS("getChat", { chatId: selectedChat.value.chatId, ...chatStore.messagePagination })
}

const conversationContact = computed(() => {
  if (!selectedChat.value.users) return undefined
  return selectedChat.value.users.find(user => user.id !== userStore.currentUser.id)
})

const clearActiveChat = async () => {
  chatStore.changeSelectedChat(undefined)
  sendWS("countAllChat")
  sendWS("findAllChat")
}
</script>

<template>
  <div class="chat">
    <!-- ALL CHAT BUTTON  -->
    <el-collapse accordion v-model="expand.chats" @change="loadChats">
      <el-collapse-item class="el-collapse-item__header__first"
        :title="counts? `Chats | Sent - ${counts?.sentOffers} | Received - ${counts?.receivedOffers}` : 'Chats'" name="1">
        <div v-if="selectedChat.chatId === 0">
          <!-- OFFER TYPES - RECEIVED OFFERS -->
          <ChatItems v-if="groups?.receivedOffers.length" :connected="connected" :offer-type="'receivedOffers'"
            :offers="groups.receivedOffers" :unread-messages-count="unreadMessagesCount" />
          <ChatItems v-if="groups?.sentOffers.length" :connected="connected" :offers="groups.sentOffers"
            :offer-type="'sentOffers'" :unread-messages-count="unreadMessagesCount" />
        </div>
        <div class="selected-chat" v-else-if="selectedChat.chatId">
          <div class="selected-chat__actions">
            <span>Chat with: <router-link v-if="conversationContact" :to="'/'">{{ conversationContact.nickname
            }}</router-link></span>
            <el-button @click="clearActiveChat">Back</el-button>
          </div>
          <div ref="messagesRef" class="selected-chat__messages">
            length-{{ selectedChat.messages.length }} | maxCount-{{ selectedChat.count }} | offset-{{
              chatStore.messagePagination.offset }} | limit-{{
    chatStore.messagePagination.limit
  }}
            <el-button v-if="selectedChat.messages.length < selectedChat.count" @click="loadMoreMessages">MORE
              BLYAT</el-button>
            <p v-if="!selectedChat.messages.length">Chat started</p>

            <!-- MESSAGES  -->
            <p v-for="(message, index) of selectedChat.messages" class="message" :class="{
              'left-message': userStore.currentUser.id === message.userId,
              'right-message': userStore.currentUser.id !== message.userId
            }" :key="index">{{ message.text }}</p>

          </div>
          <div class="message-input">
            <el-input @keyup.enter="sendMessage" :disabled="loadingMessageInput" v-model="message"
              placeholder="input text">
            </el-input>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
.chat {
  background-color: var(--el-bg-color);
  color: var(--el-color-primary);
  border-radius: 5pt 0 0 0;
  outline: none;
  width: 340px;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1;
  border-top: 2px outset rgba(20, 22, 1, 0.05);
  border-left: 2px outset rgba(20, 22, 1, 0.05);
  background-image: url(data:image/png;base64,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);
  box-shadow: 2px 3px 20px black,
    0 0 125px #000000 inset;

  .chat-header {
    font-weight: 600;
    padding: 0.3rem 1rem;
    cursor: pointer;
  }

  .message {
    // border-radius: 5px;
    background-color: var(--el-color-danger);
    color: var(--el-bg-color);
    padding: 2px 10px;
    border-radius: 5px;
    font-weight: 600;
    max-width: 70%;
    margin-bottom: .45rem;
    position: relative;
    word-wrap: break-word;
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

      .el-collapse-item__header {
        opacity: 0.7;
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
      border-radius: 15px 0 0 0;
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
</style>
