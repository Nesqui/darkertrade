import { defineStore } from 'pinia'
import { Item, User } from '../hooks'
import { useLocalStorage } from '@vueuse/core'

export const useItemStore = defineStore('item', () => {
    const items = useLocalStorage('items', [] as Item[])

    const saveAll = (_items:Item[]) => {
      items.value = _items
    }

    return {
      items,
      saveAll
    }
})
