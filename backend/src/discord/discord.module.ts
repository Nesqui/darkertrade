import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GatewayIntentBits } from 'discord.js';
import { DiscordController } from './discord.controller';

import { DiscordGateway } from './discord.gateway';
import { ResetCommand } from './commands/reset.command';
import { RegisterCommand } from './commands/register.command';
import { usersProviders } from 'src/user/user.providers';
import { itemsProviders } from 'src/item/item.providers';
import { bidProviders } from 'src/bid/bid.providers';
import { existingItemProviders } from 'src/existing-item/existing-item.providers';
import { ItemService } from 'src/item/item.service';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ItemModule,
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('DISCORD_TOKEN'),
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            // You must allow message content for your application in discord developers
            // https://support-dev.discord.com/hc/en-us/articles/4404772028055
            GatewayIntentBits.MessageContent,
          ],
        },
        registerCommandOptions: [
          {
            forGuild: configService.get('DISCORD_GUILD_ID'),
            removeCommandsBefore: true,
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DiscordController],
  providers: [
    DiscordGateway,
    JwtService,
    ResetCommand,
    RegisterCommand,
    ...usersProviders,
    ...bidProviders,
    ...existingItemProviders,
    ...itemsProviders,
  ],
  exports: [DiscordGateway],
})
export class DiscordBotModule {}
