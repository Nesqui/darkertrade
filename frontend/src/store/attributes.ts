import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Attribute } from '../hooks'
import { useStorage } from '@vueuse/core'

export const useAttributesStore = defineStore('attributes', () => {
  const attributes = useStorage<Attribute[]>('attributes', [])

  const saveAll = (data: Attribute[]) => {
    if (Array.isArray(data))
      attributes.value = data
  }

  return {
    attributes,
    saveAll
  }
})
