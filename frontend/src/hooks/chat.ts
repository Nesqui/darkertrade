import { Bid } from './bid'
import { ExistingItem } from './existingItem'
import { Offer } from './offer'
import { User } from './user'

export interface Chat {
  id: number
  name: string
  messages: Message[]
  communityId: number
  community: Community
  bid: Bid
}

export interface Community {
  id: number
  users: User[]
}

export interface ChatsCountsResponse {
  sentOffers: number
  receivedOffers: number
}

export interface ChatsResponse {
  sentOffers: ExistingItem[]
  receivedOffers: ExistingItem[]
  miscPurchases: Offer[]
  miscSales: Offer[]
}

export interface CommunityUser {
  id: number
  user: User
  userId: number
  community: Community
  communityId: number
}

export interface ChatMessagesResponse {
  chatId: number
  chat?: Chat
  messages: Message[]
  count: number
  users: User[]
}

export interface Message {
  id: number
  text: string
  userId: number
  user: User
  chatId: number
  chat: Chat
  existingItemId: number
  existingItem: User
  createdAt: string
  updatedAt: string
}

export interface ExistingItemUnpublishedChats {
  existingItemId: number
}

export type ChatOfferType = 'receivedOffers' | 'sentOffers' | 'miscSales' | 'miscPurchases'

export interface ChatCreatedDto {
  offerType: ChatOfferType
  existingItem?: ExistingItem
  miscPurchases?: Offer
  miscSales: Offer
}

export interface OnBidClosed {
  bid: Bid
}
