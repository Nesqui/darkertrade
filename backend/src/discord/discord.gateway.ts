import { InjectDiscordClient, On, Once } from '@discord-nestjs/core';
import {
  Inject,
  Injectable,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Client, discordSort, GuildMember, Message } from 'discord.js';
import DiscordNotifyType from './discord.interface';
import { CreateDiscordDto } from './dto/create-discord.dto';

import { MessageFromUserGuard } from './guards/message-from-user';
import { MessageToUpperInterceptor } from './interceptors/message-to-upper';
import { User } from 'src/user/user.entity';
import { Item } from 'src/item/item.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Bid } from 'src/bid/bid.entity';
import { where } from 'sequelize';
import { ConfigService } from '@nestjs/config';

// const DISCORD_JOIN_ROLE_NAME = 'fresh';
@Injectable()
export class DiscordGateway {
  private readonly logger = new Logger(DiscordGateway.name);

  constructor(
    private configService: ConfigService,
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
    @Inject('BIDS_REPOSITORY')
    private bidsRepository: typeof Bid,
    @Inject('EXISTING_ITEM_REPOSITORY')
    private existingItemRepository: typeof ExistingItem,
  ) {}

  // @On('guildMemberAdd')
  // async onguildMemberAdd(member: GuildMember): Promise<void> {
  //   member.roles.add(DISCORD_JOIN_ROLE_NAME);
  //   console.log(member);
  //   await member;
  // }

  // @On('messageCreate')
  // @UseGuards(MessageFromUserGuard)
  // @UseInterceptors(MessageToUpperInterceptor)
  // async onMessage(message: Message): Promise<void> {
  //   this.logger.log(`Incoming message: ${message.content}`);

  //   await message.reply('Message processed successfully');
  // }

  onBidAccepted = async (bid: Bid) => {
    const discordId = bid.user.discordId;

    const userDbResponse = await this.usersRepository.findOne({
      where: {
        discordId: discordId,
      },
    });

    if (!userDbResponse.discordNotification) {
      return;
    }

    const itemUrl =
      this.configService.get('APP_URL') +
      '/user/' +
      bid.existingItem.user.nickname +
      '/items/' +
      bid.existingItem.id;

    console.log(JSON.stringify(bid));
    const discordMessage =
      `${bid.user.nickname} your bid` +
      '\n' +
      `Was accepted by **${bid.existingItem.user.nickname}**` +
      '\n' +
      `__${itemUrl}__` +
      '\n' +
      `Agreed price of **${bid.price}**`;

    console.log(itemUrl);
    console.log(discordMessage);

    try {
      const discordUser = await this.client.users.fetch(discordId);
      console.log(discordMessage);
      console.log(discordUser);
      await discordUser.send(discordMessage);
    } catch (error) {
      this.logger.log(`disc send ${error}`);
    }
    // disc.send({})
    // const discUser = await this.client.users.fetch(discordInfo.id);
    // const responseDB = await this.usersRepository.findOne({});
    // const discordUser = this.client.users.fetch(responseDB.discordID);
    // discordUser.send('turbo notifa');
  };

  onBidCreated = async (bid: Bid) => {
    const discordId = bid.existingItem.user.discordId;

    // $name greet your $item created at
    // url
    // has a new bid from $user
    // price $price
    let priceString = '';

    if (bid.price > 0) {
      priceString = `with an offer of **${bid.price}**`;
    }
    const itemUrl =
      this.configService.get('APP_URL') +
      '/user/' +
      bid.existingItem.user.nickname +
      '/items/' +
      bid.existingItem.id;

    const userDbResponse = await this.usersRepository.findOne({
      where: {
        discordId: discordId,
      },
    });

    if (!userDbResponse.discordNotification) {
      return;
    }
    if (!bid.existingItem.discordNotification) {
      return;
    }
    try {
      const discordMessage =
        `${bid.existingItem.user.nickname} your ${bid.existingItem.item.name} created at` +
        '\n' +
        `__${itemUrl}__` +
        '\n' +
        `has a new bid from **${bid.user.nickname}**` +
        '\n' +
        `${priceString}`;

      const discordUser = await this.client.users.fetch(discordId);
      await discordUser.send(discordMessage);
    } catch (error) {
      this.logger.log(`disc send ${error}`);
    }

    // discordUser.send(`/user/${bid.existingItem.user.nickname}/items/${bid.existingItem.id}
    // Bid was created messaga`);

    // disc.send({})
    // const discUser = await this.client.users.fetch(discordInfo.id);
    // const responseDB = await this.usersRepository.findOne({});
    // const discordUser = this.client.users.fetch(responseDB.discordID);
    // discordUser.send('turbo notifa');
  };
}

export default DiscordGateway;
