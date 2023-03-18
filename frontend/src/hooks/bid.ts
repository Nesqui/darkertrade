import { Chat, CountedExistingItemsResponse, ExistingItem, useApi, User } from "."
export type BidSortParam = [string, 'ABC' | 'DESC']
export interface Bid {
  id: number,
  price: number;
  existingItemId: number;
  existingItem: ExistingItem,
  suggestedExistingItemId?: number;
  suggestedExistingItem?: ExistingItem;
  userId: number;
  createdAt: string,
  updateAt: string,
  user: User,
  chatId?: number;
  chat?: Chat
  status: 'created' | 'accepted' | 'declined' | 'deleted'
}

export interface QueryBidDto {
  mine: boolean;
  limit: number
  offset: number
  sort: BidSortParam[]
  offerType: "WTS" | "WTB"
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

  const accept = async (id: number): Promise<Bid> => {
    const res = await axiosClient.patch(`bid/${id}`)
    return res.data
  }

  const decline = async (id: number): Promise<Bid> => {
    const res = await axiosClient.patch(`bid/decline/${id}`)
    return res.data
  }
  

  const filter = async (params: QueryBidDto): Promise<CountedExistingItemsResponse> => {
    const res = await axiosClient.get('bid', {
      params
    })
    return res.data
  }

  const deleteBid = async (id: number): Promise<Boolean> => {
    const res = await axiosClient.delete(`bid/${id}`)
    return !!res.data
  }

  return {
    create,
    deleteBid,
    filter,
    accept,
    decline
  }
}
