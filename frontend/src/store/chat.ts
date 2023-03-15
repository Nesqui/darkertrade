import { defineStore } from 'pinia'
import { Chat, ChatMessagesResponse, User } from '../hooks'
import { useLocalStorage, useStorage } from '@vueuse/core'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {

  // const selectedChat = useStorage<ChatMessagesResponse | null>('selectedChat', null)
  const selectedChat = useLocalStorage<ChatMessagesResponse>('selectedChat', {
    chatId: 0,
    messages: [],
    count: 0
  })

  const changeSelectedChat = (data: ChatMessagesResponse | undefined) => {
    if (!data) {
      selectedChat.value.chatId = 0
      selectedChat.value.messages = []
      selectedChat.value.count = 0
      return
    }
    selectedChat.value = data
  }

  const expand = useLocalStorage('expand', {
    chats: '',
    sentOffers: '',
    receiveOffers: ''
  })

  return {
    selectedChat,
    expand,
    changeSelectedChat
  }
})
