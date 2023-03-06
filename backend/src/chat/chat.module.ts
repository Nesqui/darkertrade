import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { usersProviders } from 'src/user/user.providers';
import { JwtService } from '@nestjs/jwt';
import { messagesProviders } from 'src/messages/messages.providers';
import { chatsProvider } from './chat.providers';
import { communityProvider } from 'src/community/community.providers';
import { communityUsersProviders } from 'src/community/community-user.provider';

@Module({
  providers: [
    ChatGateway,
    ...usersProviders,
    JwtService,
    ...messagesProviders,
    ...chatsProvider,
    ...communityProvider,
    ...communityUsersProviders],
  exports: [ChatGateway]
})
export class ChatModule { }
