import { Attribute, ExistingItem, ItemName, Slot, useApi } from "."
// const gallery = Object.values(import.meta.glob('@assets/images/items/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' }))
// import g from '@/assets/images/items/'
export interface QueryItemDto {
    id?: number,
    slot?: Slot,
    offerType?: 'WTB' | 'WTS',
    name?: ItemName,
    hideMine?: boolean,
    published?: boolean,
    searchExistingItemString?: string,
    searchItemString?: string,
    limit?: number,
    offset?: number
}

export interface PrefillItem {
    id: number
    name: ItemName
    slot: Slot
    offerType: 'WTB' | 'WTS',
    baseStats: []
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

    const getBase = async (): Promise<Item[]> => {
        const res = await axiosClient('item/base')
        return res.data
    }

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
        const href = `/items/${itemName}`;
        return href
    }

    return {
        findAll,
        findUserItem,
        findUserItems,
        getImg,
        getMarket,
        getBase
    }
}

export interface BaseStat {
  min: number;
  max: number;
  inputRequired: boolean;
  itemId: number;
  item: Item;
  attributeId: number;
  attribute: Attribute;
  statsLength: number;
}

export interface VirtualStat {
  min: number;
  max: number;
  inputRequired: boolean;
  attributeId: number;
  statsLength: number;
}

export interface Item {
    id?: number,
    name: ItemName;
    slot: Slot;
    existingItems?: ExistingItem[];
    createdAt?: string,
    baseStats: BaseStat[]
}