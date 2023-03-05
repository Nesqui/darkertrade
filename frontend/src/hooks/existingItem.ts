import { Item, QueryItemDto, Stat, useApi, User } from "."
import { Bid } from "./bid";

export interface ExistingItem {
    id?: number
    itemId: number,
    item?: Item,
    stats: Stat[],
    wantedPrice?: number,
    published: boolean,
    user?: User,
    userId?: number,
    offerType: 'WTB' | 'WTS',
    bids?: Bid[]
}

export interface UpdateExistingItemDto {
  published?: boolean;
  archived?: boolean;
}

export interface FilterExistingItemDto {
    userId?: number;
    slot?: string
}

export interface CountedExistingItemsResponse {
    count: number,
    rows: ExistingItem[]
}

export const initExistingItemApi = () => {
    const { axiosClient } = useApi()

    // const findAll = async (filterExistingItemDto: FilterExistingItemDto): Promise<ExistingItem[]> => {
    //     const res = await axiosClient('existing-item', {
    //         params: filterExistingItemDto
    //     })
    //     return res.data
    // }

    const findAllByItemId = async (itemId: number, filterExistingItemDto: QueryItemDto): Promise<CountedExistingItemsResponse> => {
        const res = await axiosClient(`existing-item/item/${itemId}`, {
            params: filterExistingItemDto
        })
        return res.data
    }

    const create = async (item: ExistingItem): Promise<ExistingItem> => {
        const res = await axiosClient.post('existing-item', item)
        return res.data
    }

    const patch = async (id: number, dto: UpdateExistingItemDto): Promise<ExistingItem> => {
        const res = await axiosClient.patch(`existing-item/${id}`, dto)
        return res.data
    }

    return {
        // findAll,
        findAllByItemId,
        create,
        patch
    }
}
