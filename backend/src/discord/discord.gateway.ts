import { InjectDiscordClient, On, Once } from '@discord-nestjs/core';
import { Injectable, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { Client, discordSort, Message } from 'discord.js';
import DiscordNotifyType from './discord.interface';
import { CreateDiscordDto } from './dto/create-discord.dto';

import { MessageFromUserGuard } from './guards/message-from-user';
import { MessageToUpperInterceptor } from './interceptors/message-to-upper';

@Injectable()
export class DiscordGateway {
  private readonly logger = new Logger(DiscordGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Once('ready')
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`);
  }

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard)
  @UseInterceptors(MessageToUpperInterceptor)
  async onMessage(message: Message): Promise<void> {
    this.logger.log(`Incoming message: ${message.content}`);

    await message.reply('Message processed successfully');
  }

  zalupa = (createDiscordDto: CreateDiscordDto) => {
    return createDiscordDto;
  };

  onBidCreated = async (id: number) => {
    // TODO implement DiscordNotify
    // disc.send({})
  };
}

export default DiscordGateway;
