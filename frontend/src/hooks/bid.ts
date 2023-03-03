import { useApi } from "."

export interface Bid {
  price: number;
  existingItemId: number;
  suggestedItmId?: number;
  userId: number;
  createdAt: string,
  updateAt: string,
  user: User
}

export interface CreateBidDto {
  price: number;
  existingItemId: number;
  suggestedExistingItemId?: number;
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
