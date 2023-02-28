import { Stat, useApi } from "."

export interface ExistingItem {
    id?: number
    itemId: number,
    stats: Stat[]
}

export const initExistingItemApi = () => {
    const { axiosClient } = useApi()

    const findAll = async ():Promise<ExistingItem[]> => {
        const res = await axiosClient('existing-item')
        return res.data
    }

    const create = async (item:ExistingItem):Promise<ExistingItem[]> => {
        const res = await axiosClient.post('existing-item', item)
        return res.data
    }

    return {
        findAll,
        create
    }
}
