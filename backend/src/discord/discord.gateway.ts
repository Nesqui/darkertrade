import { InjectDiscordClient } from '@discord-nestjs/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  TextChannel,
  Client,
  EmbedBuilder,
  OverwriteResolvable,
} from 'discord.js';
import { User as DiscordUser } from 'discord.js';
import { User } from 'src/user/user.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Item } from 'src/item/item.entity';
import { Bid } from 'src/bid/bid.entity';
import { ConfigService } from '@nestjs/config';
import { Checkout } from 'src/checkout/checkout.entity';
import { ItemService } from 'src/item/item.service';

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
    @Inject('ITEMS_REPOSITORY')
    private itemRepository: typeof Item,
    private ItemService: ItemService,
  ) {}

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

  getOfferPairAcceptedText = (
    checkout: Checkout,
    item: Item,
    sellerDiscord: DiscordUser,
    purchaserDiscord: DiscordUser,
  ) => {
    return new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Order | ${item.name}`)
      .setThumbnail(this.ItemService.getItemImageByName(item.name))
      .addFields(
        { name: 'Seller:', value: sellerDiscord.toString() },
        { name: 'Purchaser:', value: purchaserDiscord.toString() },
        {
          name: 'Offer pair:',
          value: `${checkout.offerPair.quantity} x ${checkout.offerPair.wantedPrice}`,
        },
        {
          name: 'Quantity:',
          value: `${checkout.quantity}`,
        },
        {
          name: 'Price:',
          value: `${checkout.price} ${checkout.currency}`,
        },
      )
      .setTimestamp()
      .setFooter({ text: `Trade and Trader Bot` });
  };

  getBidAcceptedText = (
    bid: Bid,
    item: Item,
    itemAuthor: DiscordUser,
    bidCreator: DiscordUser,
    itemUrl: string,
    suggestedExistingItemUrl?: string,
  ) => {
    const fields = [
      { name: 'Item author:', value: itemAuthor.toString() },
      { name: 'Bid creator:', value: bidCreator.toString() },
      {
        name: 'Price:',
        value: `${bid.price}`,
      },
      {
        name: 'Item url:',
        value: itemUrl,
      },
    ];

    if (suggestedExistingItemUrl)
      fields.push({
        name: 'Suggested item url:',
        value: suggestedExistingItemUrl,
      });

    return new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Bid | ${item.name}`)
      .setURL(itemUrl)
      .setThumbnail(this.ItemService.getItemImageByName(item.name))
      .addFields(fields)
      .setTimestamp()
      .setFooter({ text: `Trade and Trader Bot` });
  };

  createTradeChannel = async (name = 'Trade conversation') => {
    const guildId = this.configService.get('DISCORD_GUILD_ID');
    const guild = this.client.guilds.cache.get(guildId);
    const categoryId =
      this.configService.get('DISCORD_TRADE_CATEGORY_ID') ||
      '1165011027646218250';

    const channel = await guild.channels.create({
      name: name,
      parent: categoryId, // Устанавливаем категорию
    });

    // Получаем роль "everyone" (все пользователи) на сервере
    const everyoneRole = channel.guild.roles.everyone;
    await channel.permissionOverwrites.edit(everyoneRole, {
      SendMessages: false,
      ViewChannel: false,
    });

    return channel;
  };

  onOfferPairAccepted = async (checkout: Checkout) => {
    const item = await this.ItemService.getItemByCheckoutId(checkout.id);
    const channel = await this.createTradeChannel(
      `${checkout.id} Misc ${item.name}`,
    );

    const seller = await this.usersRepository.findByPk(checkout.sellerId);
    const purchaser = await this.usersRepository.findByPk(checkout.purchaserId);

    const sellerDiscord = await this.client.users.fetch(seller.discordId);
    const purchaserDiscord = await this.client.users.fetch(purchaser.discordId);

    await Promise.all([
      this.addUserToChannel(channel, sellerDiscord),
      this.addUserToChannel(channel, purchaserDiscord),
    ]);
    await channel.send(
      `trade between <@${sellerDiscord.id}> <@${purchaserDiscord.id}>`,
    );

    await channel.send({
      embeds: [
        this.getOfferPairAcceptedText(
          checkout,
          item,
          sellerDiscord,
          purchaserDiscord,
        ),
      ],
    });

    const DMMessage = `Offer was accepted: we have created chat room for you.\n<#${channel.id}>`;
    await Promise.all([
      sellerDiscord.send(DMMessage),
      purchaserDiscord.send(DMMessage),
    ]);

    return channel.id;
  };

  onBidAccepted = async (bid: Bid) => {
    const discordId = bid.user.discordId;

    const itemCreator = await this.usersRepository.findByPk(
      bid.existingItem.userId,
    );

    const itemCreatorDiscord = await this.client.users.fetch(
      itemCreator.discordId,
    );
    const bidCreatorDiscord = await this.client.users.fetch(discordId);

    const itemUrl = `${this.configService.get('APP_URL')}/user/${
      bid.existingItem.user.nickname
    }/items/${bid.existingItem.id}`;

    const suggestedExistingItemUrl = bid.suggestedExistingItem
      ? `${this.configService.get('APP_URL')}/user/${
          bid.suggestedExistingItem.user.nickname
        }/items/${bid.suggestedExistingItem.id}`
      : '';

    const item = await this.ItemService.getItemById(bid.existingItem.itemId);
    const channel = await this.createTradeChannel(`${bid.id} Bid ${item.name}`);

    await Promise.all([
      this.addUserToChannel(channel, itemCreatorDiscord),
      this.addUserToChannel(channel, bidCreatorDiscord),
    ]);

    await channel.send(
      `trade between <@${itemCreatorDiscord.id}> <@${bidCreatorDiscord.id}>`,
    );

    await channel.send({
      embeds: [
        this.getBidAcceptedText(
          bid,
          item,
          itemCreatorDiscord,
          bidCreatorDiscord,
          itemUrl,
          suggestedExistingItemUrl,
        ),
      ],
    });

    const DMMessage = `Bid was accepted: we have created chat room for you.\n<#${channel.id}>`;
    await Promise.all([
      itemCreatorDiscord.send(DMMessage),
      bidCreatorDiscord.send(DMMessage),
    ]);

    return channel.id;
  };

  archiveChannel = async (
    channelId: string,
    reason = 'Channel closed automatically',
  ) => {
    const guildId = this.configService.get('DISCORD_GUILD_ID');
    const guild = this.client.guilds.cache.get(guildId);
    const channel = await guild.channels.fetch(channelId);
    if (channel) {
      // Получаем список участников канала
      const members = channel.members;

      const everyoneRole = channel.guild.roles.everyone;
      const permissionOverwrites: OverwriteResolvable[] = Object.keys(
        members,
      ).map((member) => ({
        id: members[member].id,
        deny: 'ViewChannel',
        type: 1, // Member,
      }));

      permissionOverwrites.push({
        id: everyoneRole,
        deny: 'ViewChannel',
        type: 0, // Role,
      });

      channel.edit({
        permissionOverwrites,
      });

      (channel as TextChannel).send(reason);
    }
  };

  addUserToChannel = async (channel: TextChannel, discordUser: DiscordUser) => {
    try {
      // Устанавливаем права доступа для пользователя
      await channel.permissionOverwrites.edit(discordUser, {
        SendMessages: true,
        EmbedLinks: true,
        AttachFiles: true,
        ViewChannel: true,
      });
    } catch (error) {
      console.error(
        'Произошла ошибка при добавлении пользователя в канал:',
        error,
      );
    }
  };
}

export default DiscordGateway;
