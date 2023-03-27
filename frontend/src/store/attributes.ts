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

  const getAttributeNameById = (attributeId: number) => {
    const currentAttribute = attributes.value.find(a => a.id === attributeId)
    if (!currentAttribute)
      return "Attribute not found!"
    return currentAttribute.name
  }

  
  const getAttributeById = (attributeId: number) => {
    const currentAttribute = attributes.value.find(a => a.id === attributeId)
    if (!currentAttribute)
      return null
    return currentAttribute
  }

  return {
    attributes,
    getAttributeNameById,
    saveAll,
    getAttributeById
  }
})
