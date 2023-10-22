import { defineStore } from 'pinia'
import { Item, User } from '../hooks'
import { useLocalStorage } from '@vueuse/core'

export const useItemStore = defineStore('item', () => {
  const items = useLocalStorage('items', [] as Item[])

  const saveAll = (_items: Item[]) => {
    items.value = _items
  }

  const getItemById = (id: number) => items.value.find((item) => item.id === id)

  return {
    items,
    getItemById,
    saveAll
  }
})
