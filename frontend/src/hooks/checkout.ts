import { Bid, Chat, OfferPair, User } from '@/hooks'

export interface Checkout {
  purchaserId: number
  purchaser: User
  sellerId: number
  seller: User
  chatId: number
  chat: Chat
  offerPair: OfferPair
  bid: Bid
  quantity: number
  price: number
  currency: 'gold' | 'key' | 'gold ingot' | 'ruby silver ingot'
}
