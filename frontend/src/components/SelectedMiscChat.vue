<script setup lang="ts">
import { useChatStore, useItemStore, useUserStore } from '@/store'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import NicknameOnline from './NicknameOnline.vue'
import OfferPair from './ui/OfferPair.vue'

const route = useRoute()
const userStore = useUserStore()
const chatStore = useChatStore()
const selectedChat = computed(() => chatStore.selectedChat)
const emit = defineEmits([
  'sendMessage',
  'findAllChat',
  'getChat',
  'countAllChat',
  'push',
  'loadMoreMessages',
  'clearActiveChat'
])

const push = async (url: string) => {
  emit('push', url)
}

const itemStore = useItemStore()

const messagesRef = ref()

const props = defineProps({
  loadingMessageInput: {
    type: Boolean,
    default: false,
    required: true
  }
})

const message = ref('')

const scroll = () => {
  if (!selectedChat.value.chatId) return

  messagesRef.value.scroll({
    top: messagesRef.value.scrollHeight,
    left: 0,
    behavior: 'smooth'
  })
}

const sendMessage = () => {
  emit('sendMessage', {
    text: message.value,
    chatId: selectedChat.value.chatId
  })
  message.value = ''
}

onMounted(() => {
  nextTick(() => {
    scroll()
  })
})

const loadMoreMessages = () => {
  emit('loadMoreMessages')
}

const conversationContact = computed(() => {
  if (!selectedChat.value.users) return undefined
  return selectedChat.value.users.find((user) => user.id !== userStore.currentUser.id)
})

const clearActiveChat = async () => {
  emit('clearActiveChat')
}
</script>

<template>
  <div class="selected-chat">
    <!-- SELECTED CHAT HEADER  -->
    <div class="selected-chat__actions">
      <span class="selected-chat__actions__conversation"
        >Chat with:
        <router-link v-if="conversationContact" :to="`/user/${conversationContact.nickname}`">
          <NicknameOnline :user="conversationContact" /> </router-link
      ></span>
      <el-button link @click="clearActiveChat">Back</el-button>
    </div>

    <el-divider />

    <div class="selected-chat__info">
      <div class="selected-chat__info__li">
        <span>
          Item:
          <strong>{{
            itemStore.getItemById(selectedChat.chat?.checkout?.offerPair.offer.itemId || 0)?.name
          }}</strong>
        </span>
        <div class="bid-actions"></div>
      </div>
      <div class="selected-chat__info__li">
        <div class="d-flex align-center" v-if="selectedChat.chat?.checkout?.purchaser">
          <NicknameOnline :user="selectedChat.chat.checkout?.purchaser" />
          <div>buying</div>
        </div>

        <div class="d-flex">
          <strong class="w-100"
            >{{ selectedChat.chat?.checkout?.quantity }} *
            {{ selectedChat.chat?.checkout?.offerPair.wantedPrice }} =
            {{ selectedChat.chat?.checkout?.price }}</strong
          >
        </div>
      </div>

      <div v-if="selectedChat.chat?.checkout?.offerPair" class="selected-chat__info__li">
        <div class="d-flex align-center" v-if="selectedChat.chat?.checkout?.seller">
          <NicknameOnline :user="selectedChat.chat.checkout?.seller" />
          <div>sells</div>
        </div>

        <OfferPair :offer-pair="selectedChat.chat.checkout.offerPair" />
      </div>
    </div>

    <div ref="messagesRef" class="selected-chat__messages">
      <el-button
        link
        v-if="selectedChat.messages.length < selectedChat.count"
        @click="loadMoreMessages"
      >
        READ MORE
      </el-button>
      <p v-if="!selectedChat.messages.length">Chat started</p>

      <!-- MESSAGES  -->
      <span
        v-for="(message, index) of selectedChat.messages"
        :class="{
          'system-message': selectedChat.messages.length >= selectedChat.count && index < 2,
          'left-message': index >= 2 && userStore.currentUser.id !== message.userId,
          'right-message': index >= 2 && userStore.currentUser.id === message.userId
        }"
        :key="index"
        class="message"
      >
        <p>{{ message.text }}</p>
        <p v-if="!(selectedChat.messages.length >= selectedChat.count && index < 2)" class="date">
          {{
            new Date(message.createdAt).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit'
            })
          }}
          {{ new Date(message.createdAt).toLocaleDateString('en-GB') }}
        </p>
      </span>
    </div>
    <div class="message-input">
      <el-input
        @keyup.enter="sendMessage"
        :disabled="loadingMessageInput"
        v-model="message"
        placeholder="input text"
      >
      </el-input>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bid-actions {
  display: flex;
  gap: 0.25rem;
}

p {
  padding: 0 1rem;
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
  margin-bottom: 0.75rem;
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
  padding-bottom: 0.5rem;
  margin: 0 auto 0.5rem auto;
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
    padding-top: 0.8rem;
    gap: 0.25rem;
    margin-bottom: 0.5rem;

    &__conversation {
      font-size: 12px;
      display: flex;
      gap: 0.25rem;
      align-items: center;

      a {
        font-size: 12px;
      }
    }
  }

  &__info {
    font-size: 12px;

    &__li {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__li:not(:last-child) {
      margin-bottom: 0.45rem;
    }
  }

  &__messages {
    padding: 0.55rem 1rem;
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
  margin: 0rem 0 0.35rem 0;
}

@media (max-width: 420px) {
}
</style>

<style lang="scss"></style>
