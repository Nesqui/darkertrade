import { InjectDiscordClient, On, Once } from '@discord-nestjs/core';
import { Injectable, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { Client, discordSort, Message } from 'discord.js';
import DiscordNotifyType from './discord.interface';
import { CreateDiscordDto } from './dto/create-discord.dto';

import { MessageFromUserGuard } from './guards/message-from-user';
import { MessageToUpperInterceptor } from './interceptors/message-to-upper';
import { User } from 'src/user/user.entity';

@Injectable()
export class DiscordGateway {
  private readonly logger = new Logger(DiscordGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
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
    // const discUser = await this.client.users.fetch(discordInfo.id);
    // const responseDB = await this.usersRepository.findOne({});
    // const discordUser = this.client.users.fetch(responseDB.discordID);
    // discordUser.send('turbo notifa');
  };
}

export default DiscordGateway;
