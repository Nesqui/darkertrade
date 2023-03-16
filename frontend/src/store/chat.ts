import { defineStore } from 'pinia'
import { Chat, ChatMessagesResponse, User } from '../hooks'
import { useLocalStorage, useStorage } from '@vueuse/core'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {

  // const selectedChat = useStorage<ChatMessagesResponse | null>('selectedChat', null)
  const selectedChat = useLocalStorage<ChatMessagesResponse>('selectedChat', {
    chatId: 0,
    messages: [],
    count: 0,
    users: []
  })

  const messagePagination = useLocalStorage('messagePagination',{
    limit: 10,
    offset: 0
  })

  const changeSelectedChat = (data: ChatMessagesResponse | undefined) => {
    if (!data) {
      selectedChat.value.chatId = 0
      selectedChat.value.messages = []
      selectedChat.value.count = 0
      selectedChat.value.users = []
      messagePagination.value.limit = 10
      messagePagination.value.offset = 0
      return
    }
    if (selectedChat.value.chatId === data.chatId) {
      selectedChat.value.count = data.count
      selectedChat.value.messages = [...data.messages, ...selectedChat.value.messages]
      return
    }
    selectedChat.value = data
  }

  const expand = useLocalStorage('expand', {
    chats: '',
    offerType: 'receivedOffers'
  })

  return {
    selectedChat,
    expand,
    changeSelectedChat,
    messagePagination
  }
})
