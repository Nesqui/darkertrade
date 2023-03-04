import { useApi, User } from "."

export interface Bid {
  id: number,
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

  const create = async (createBidDto: CreateBidDto): Promise<Bid> => {
    const res = await axiosClient.post('bid', createBidDto)
    return res.data
  }

  const deleteBid = async (id: number): Promise<Boolean> => {
    const res = await axiosClient.delete(`bid/${id}`)
    return !!res.data
  }

  return {
    create,
    deleteBid
  }
}
