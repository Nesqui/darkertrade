import { ExistingItem, ItemName, Slot, useApi } from "."

export interface QueryItemDto {
    id?: number,
    slot?: Slot,
    offerType?:'WTB' | 'WTS',
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
    offerType: 'WTB' | 'WTS'
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

    const findAll = async (params: QueryItemDto):Promise<Item[]> => {
        const res = await axiosClient('item', {
            params
        })
        return res.data
    }

    const getMarket = async (params: QueryItemDto):Promise<Item[]> => {
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

    const getImg = (item:Item) => {
        return new URL(`/src/assets/images/${item.slot}/60px-${item.name.replaceAll(' ', '_')}.png`, import.meta.env.VITE_URL).href
    }

    return {
        findAll,
        findUserItem,
        findUserItems,
        getImg,
        getMarket
    }
}

export interface Item {
    id?: number,
    name: ItemName;
    slot: Slot;
    existingItems?: ExistingItem[];
    createdAt?: string
}