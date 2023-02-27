import { Stat, useApi } from "."

export interface ExistingItem {
    id?: number
    itemId: number,
    stats: Stat[]
}

export const initExistingItemApi = () => {
    const { axiosClient } = useApi()

    const findAll = async ():Promise<ExistingItem[]> => {
        const res = await axiosClient('existingItem')
        return res.data
    }

    return {
        findAll
    }
}
