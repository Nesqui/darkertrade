import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PgModule } from './pg/pg.module';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { AttributeModule } from './attribute/attribute.module';
import { AuthModule } from './auth/auth.module';
import { ExistingItemModule } from './existing-item/existing-item.module';
import { StatModule } from './stat/stat.module';
import { BidModule } from './bid/bid.module';
import { DiscordBotModule } from './discord/discord.module';
import { CommunityModule } from './community/community.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
import { BaseStatModule } from './base-stat/base-stat.module';

@Module({
  imports: [
    PgModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ItemModule,
    AttributeModule,
    DiscordBotModule,
    AuthModule,
    ExistingItemModule,
    StatModule,
    BidModule,
    CommunityModule,
    ChatModule,
    MessagesModule,
    BaseStatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
