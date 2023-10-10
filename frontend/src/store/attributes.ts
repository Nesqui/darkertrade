import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Attribute } from '../hooks'
import { useStorage } from '@vueuse/core'

export const useAttributesStore = defineStore('attributes', () => {
  const attributes = useStorage<Attribute[]>('attributes', [])

  const saveAll = (data: Attribute[]) => {
    if (Array.isArray(data)) attributes.value = data
  }

  const getAttributeNameById = (attributeId: number) => {
    const currentAttribute = attributes.value.find((a) => a.id === +attributeId)
    if (!currentAttribute) return 'Attribute not found!'
    return currentAttribute.name
  }

  const getAttributeSymbolById = (attributeId: number) => {
    const currentAttribute = attributes.value.find((a) => a.id === +attributeId)
    if (!currentAttribute) return ''
    return currentAttribute.symbol
  }

  const getAttributeById = (attributeId: number) => {
    const currentAttribute = attributes.value.find((a) => a.id === attributeId)
    if (!currentAttribute) return null
    return currentAttribute
  }

  const attributeSearch = (queryString: string, cb: any) => {
    let results = attributes.value

    results = queryString
      ? results.filter(
          (attribute) => attribute.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        )
      : results
    cb(results)
  }

  return {
    attributes,
    getAttributeNameById,
    getAttributeSymbolById,
    saveAll,
    getAttributeById,
    attributeSearch
  }
})
