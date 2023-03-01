import { Item, Stat, useApi } from "."

export interface ExistingItem {
    id?: number
    itemId: number,
    item?: Item,
    stats: Stat[]
}

export interface FilterExistingItemDto {
    userId?: number;
    slot?: string
}

export const initExistingItemApi = () => {
    const { axiosClient } = useApi()

    const findAll = async (filterExistingItemDto: FilterExistingItemDto): Promise<ExistingItem[]> => {
        const res = await axiosClient('existing-item', {
            params: filterExistingItemDto
        })
        return res.data
    }

    const create = async (item: ExistingItem): Promise<ExistingItem[]> => {
        const res = await axiosClient.post('existing-item', item)
        return res.data
    }

    return {
        findAll,
        create
    }
}
