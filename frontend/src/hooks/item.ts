import { ExistingItem, ItemName, Slot, useApi } from "."

export interface QueryItemDto {
    slot: Slot;
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

    const findUserItems = async (userId: number): Promise<Item[]> => {
        const res = await axiosClient(`item/user/${userId}`)
        return res.data
    }

    const findUserItem = async (userId: number, itemId: number): Promise<Item> => {
        const res = await axiosClient(`item/user/${userId}/${itemId}`)
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
    existingItems?: ExistingItem[]
}