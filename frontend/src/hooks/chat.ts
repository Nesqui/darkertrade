import { User } from "./user";

export interface Chat {
  id: number;
  name: string;
  messages: Message[];
  communityId: number;
  community: Community;
}

export interface Community {
  id: number;
  users: User[];
}

export interface CommunityUser {
  id: number;
  user: User;
  userId: number;
  community: Community;
  communityId: number;
}

export interface Message {
  id: number;
  text: string;
  userId: number;
  user: User;
  chatId: number;
  chat: Chat;
  existingItemId: number;
  existingItem: User;
}
