import { InjectDiscordClient, On, Once } from '@discord-nestjs/core';
import {
  Inject,
  Injectable,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Client, discordSort, Message } from 'discord.js';
import DiscordNotifyType from './discord.interface';
import { CreateDiscordDto } from './dto/create-discord.dto';

import { MessageFromUserGuard } from './guards/message-from-user';
import { MessageToUpperInterceptor } from './interceptors/message-to-upper';
import { User } from 'src/user/user.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Bid } from 'src/bid/bid.entity';

@Injectable()
export class DiscordGateway {
  private readonly logger = new Logger(DiscordGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
    @Inject('BIDS_REPOSITORY')
    private bidsRepository: typeof Bid,
    @Inject('EXISTING_ITEM_REPOSITORY')
    private existingItemRepository: typeof ExistingItem,
  ) { }

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

  onBidAccepted = async (bid: Bid) => {
    // TODO implement DiscordNotify
    const discordId = bid.user.discordId;
    const discordUser = await this.client.users.fetch(discordId);
    discordUser.send(`/user/${bid.existingItem.user.nickname}/items/${bid.existingItem.id}]
    Your bid was accepted`);

    // disc.send({})
    // const discUser = await this.client.users.fetch(discordInfo.id);
    // const responseDB = await this.usersRepository.findOne({});
    // const discordUser = this.client.users.fetch(responseDB.discordID);
    // discordUser.send('turbo notifa');
  };

  onBidCreated = async (bid: Bid) => {
    // TODO implement DiscordNotify
    const discordId = bid.existingItem.user.discordId;
    const discordUser = await this.client.users.fetch(discordId);
    discordUser.send(`/user/${bid.existingItem.user.nickname}/items/${bid.existingItem.id}]
    Bid was created messaga`);

    // disc.send({})
    // const discUser = await this.client.users.fetch(discordInfo.id);
    // const responseDB = await this.usersRepository.findOne({});
    // const discordUser = this.client.users.fetch(responseDB.discordID);
    // discordUser.send('turbo notifa');
  };
}

export default DiscordGateway;
