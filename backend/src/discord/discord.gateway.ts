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
    // TODO implement DiscordNotify
    const discordId = bid.user.discordId;
    const discordUser = await this.client.users.fetch(discordId);
    try{
    discordUser.send(`/user/${bid.existingItem.user.nickname}/items/${bid.existingItem.id}]
    Your bid was accepted`);

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
    // TODO implement DiscordNotify
    const discordId = bid.existingItem.user.discordId;
    const discordUser = await this.client.users.fetch(discordId);

    // $name greet your $item created at
    // url
    // has a new bid from $user
    // price $price
    let priceString = '';

    if (bid.price > 0) {
      priceString = `with an offer of ${bid.price}`;
    }
    const itemUrl =
      this.configService.get('APP_URL') +
      '/user/' +
      bid.existingItem.user.nickname +
      '/items/' +
      bid.existingItem.id;
      
      try {
        discordUser.send(` ${bid.existingItem.user.nickname} your ${bid.existingItem.item.name} created at 
        ${itemUrl}
        has a new bid from ${bid.user.nickname}
        ${priceString}`);
        
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
