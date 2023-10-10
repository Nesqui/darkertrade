import { ref } from 'vue'
import { Attribute, ExistingItem, ItemName, Slot, useApi } from '.'
// import { BaseStat } from "./baseStat"

const env = import.meta.env.VITE_ENV
// let gallery: string[] = []
// const gallery = Object.values(import.meta.glob('@assets/images/items/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' }))
// const gallery =  Object.values(import.meta.glob(`${env.value === 'production' ? '/items/*.{png,jpg,jpeg,PNG,JPEG}' : '/public/items/*.{png,jpg,jpeg,PNG,JPEG}'}`, { eager: true, as: 'url' }))
// if (env === 'production') {
//     gallery = Object.values(import.meta.glob(`/items/*.{png,jpg,jpeg,PNG,JPEG}`, { eager: true, as: 'url' }))
// }
// else {
//     gallery = Object.values(import.meta.glob(`@/assets/items/*.{png,jpg,jpeg,PNG,JPEG}`, { eager: true, as: 'url' }))
// }

// gallery = gallery.map(e => {
//     const splitted = e.split('/')
//     return splitted[splitted.length - 1]
// })

export interface QueryItemDto {
  id?: number
  slot?: Slot
  offerType?: 'WTB' | 'WTS'
  name?: ItemName
  hideMine?: boolean
  published?: boolean
  attributesId?: number[]
  searchItemString?: string
  limit?: number
  offset?: number
}

export interface PrefillItem {
  id: number
  name: ItemName
  slot: Slot
  offerType: 'WTB' | 'WTS'
  // baseStats: []
}

export interface DisabledItemActions {
  name: boolean
  slot: boolean
  offerType: boolean
  hideMine: boolean
  published: boolean
}

export const initItemApi = () => {
  const { axiosClient } = useApi()

  const findAll = async (params: QueryItemDto): Promise<Item[]> => {
    const res = await axiosClient('item', {
      params
    })
    return res.data
  }

  // const getBase = async (): Promise<Item[]> => {
  //   const res = await axiosClient('item/base')
  //   return res.data
  // }

  const getMarket = async (params: QueryItemDto): Promise<Item[]> => {
    const res = await axiosClient('item/market', {
      params
    })
    return res.data
  }

  const findUserItems = async (userId: number, params: QueryItemDto): Promise<Item[]> => {
    const res = await axiosClient(`item/user/${userId}`, {
      params
    })
    return res.data
  }

  const findUserItem = async (userId: number, existingItemId: number): Promise<Item> => {
    const res = await axiosClient(`item/user/${userId}/${existingItemId}`)
    return res.data
  }

  const getImg = (item: Item) => {
    const itemName = `60px-${item.name.replaceAll(' ', '_')}.png`
    // if (gallery.includes(itemName)) {
    const href = `/items/${itemName}`
    return href
    // } return `/items/60px-Placeholder.png`
  }

  return {
    findAll,
    findUserItem,
    findUserItems,
    getImg,
    getMarket
    // getBase
  }
}

export interface VirtualStat {
  min: number
  max: number
  inputRequired: boolean
  attributeId: number
  statsLength: number
}

export interface Item {
  id?: number
  name: ItemName
  slot: Slot
  existingItems?: ExistingItem[]
  createdAt?: string
  // baseStats: BaseStat[]
}
