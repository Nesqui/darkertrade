import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { usersProviders } from 'src/user/user.providers';
import { JwtService } from '@nestjs/jwt';
import { messagesProviders } from 'src/messages/messages.providers';
import { chatsProvider } from './chat.providers';
import { communityProvider } from 'src/community/community.providers';
import { communityUsersProviders } from 'src/community/community-user.provider';
import { bidProviders } from 'src/bid/bid.providers';
import { existingItemProviders } from 'src/existing-item/existing-item.providers';
import { itemsProviders } from 'src/item/item.providers';

@Module({
  providers: [
    JwtService,
    ChatGateway,
    ...usersProviders,
    ...messagesProviders,
    ...chatsProvider,
    ...communityProvider,
    ...communityUsersProviders,
    ...bidProviders,
    ...existingItemProviders,
    ...itemsProviders,
  ],
  exports: [ChatGateway],
})
export class ChatModule {}
