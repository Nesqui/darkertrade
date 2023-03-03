import { useApi } from "."

export interface Bid {
  price: number;
  existingItemId: number;
  suggestedItmId?: number;
  userId: number;
}

export interface CreateBidDto {
  price: number;
  existingItemId: number;
  suggestItemId?: number;
}

export const initBidApi = () => {
    const { axiosClient } = useApi()

    const create = async (createBidDto: CreateBidDto):Promise<Bid> => {
        const res = await axiosClient.post('bid', createBidDto)
        return res.data
    }

    return {
      create
    }
}
