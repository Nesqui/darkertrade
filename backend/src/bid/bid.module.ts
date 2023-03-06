import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { bidProviders } from './bid.providers';
import { existingItemProviders } from 'src/existing-item/existing-item.providers';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { usersProviders } from 'src/user/user.providers';
import { DiscordBotModule } from 'src/discord/discord.module';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  controllers: [BidController],
  imports: [DiscordBotModule, ChatModule],
  providers: [
    BidService,
    ...bidProviders,
    ...existingItemProviders,
    ...usersProviders,
    JwtService,
  ],
})
export class BidModule {}
