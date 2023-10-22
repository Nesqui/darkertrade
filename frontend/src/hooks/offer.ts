import { Attribute, Checkout, ExistingOffer, Item, OfferName, Slot, User, useApi } from '.'

const env = import.meta.env.VITE_ENV

export type OfferSortParam = [string, 'ABC' | 'DESC']

export interface QueryOfferDto {
  hideMine: boolean
  limit: number
  offset: number
  sort?: OfferSortParam[]
  offerType: 'WTS' | 'WTB'
  itemId: number
}

export interface UpdateOfferPairDto {
  id: number
  rarity: number
  wantedPrice: number
  quantity: number
}

export interface CreateOfferDto {
  offerType: 'WTS' | 'WTB'
  itemId: number
  offerPairs: CreateOfferPairDto[]
}

export interface CreateOfferPairDto {
  rarity: number
  wantedPrice: number
  quantity: number
}

export interface Offer {
  userId: number
  user: User
  itemId: number
  item: Item
  offerType: 'WTB' | 'WTS'
  archived: boolean
  offerPairs: OfferPair[]
  id: number
}

export interface OfferPair {
  id: number
  wantedPrice: number
  quantity: number
  offerId: number
  offer: Offer
  rarity: number
  checkouts: Checkout[]
}

export interface CountedOffersResponse {
  rows: Offer[] & { averagePrice: number }[]
  count: number
}

export const initOfferApi = () => {
  const { axiosClient } = useApi()

  const getMarket = async (params: QueryOfferDto): Promise<CountedOffersResponse> => {
    const res = await axiosClient('offer', {
      params
    })
    return res.data
  }

  const getMine = async (): Promise<Offer[] & { averagePrice: number }[]> => {
    const res = await axiosClient('offer/mine')
    return res.data
  }

  const create = async (data: CreateOfferDto): Promise<Offer> => {
    const res = await axiosClient.post('offer', data)
    return res.data
  }

  const remove = async (id: number): Promise<Offer[]> => {
    const res = await axiosClient.delete(`offer/${id}`)
    return res.data
  }

  const update = async (id: number, updateOfferDto: UpdateOfferPairDto): Promise<Offer[]> => {
    const res = await axiosClient.patch(`offer/${id}`, updateOfferDto)
    return res.data
  }

  const acceptOfferPair = async (offerPairId: number, quantity: number): Promise<Checkout> => {
    const res = await axiosClient.post(`offer/accept/offerPair/${offerPairId}`, { quantity })
    return res.data
  }

  return {
    remove,
    getMarket,
    update,
    create,
    acceptOfferPair,
    getMine
  }
}
