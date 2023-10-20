import { ForbiddenException, Inject, UseGuards } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { groupBy } from 'lodash';
import sequelize from 'sequelize';
import { Server, Socket } from 'socket.io';
import { JwtWSAuthGuard } from 'src/auth/guards/ws-jwt-auth.guard';
import { Bid } from 'src/bid/bid.entity';
import { CommunityUser } from 'src/community/community-user.entity';
import { Community } from 'src/community/community.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Item } from 'src/item/item.entity';
import { Message } from 'src/messages/messages.entity';
import { User } from 'src/user/user.entity';
import { Chat } from './chat.entity';
import { AuthDto } from './dto/auth.dto';
import { sendMessageDto } from './dto/create-message.dto';
import { GetChatDto, QueryChatDto, ReadChatDto } from './dto/query-chat.dto';
import { Checkout } from 'src/checkout/checkout.entity';
import { OfferPair } from 'src/offer/offer-pair.entity';
import { Offer } from 'src/offer/offer.entity';
type ChatOfferType = 'receivedOffers' | 'sentOffers';

type EmitTypes =
  | 'chatCreated'
  | 'authRequired'
  | 'authorized'
  | 'chatsReceived'
  | 'chatsCountsReceived'
  | 'receiveChatMessages'
  | 'receiveMessage'
  | 'countMessages'
  | 'notifyError'
  | 'existingItemUnpublish'
  | 'bidClosed';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  users = {};
  constructor(
    @Inject('USERS_REPOSITORY')
    private userRepository: typeof User,
    @Inject('CHATS_REPOSITORY')
    private chatRepository: typeof Chat,
    @Inject('COMMUNITY_REPOSITORY')
    private communityRepository: typeof Community,
    @Inject('MESSAGES_REPOSITORY')
    private messagesRepository: typeof Message,
    @Inject('COMMUNITY_USERS_REPOSITORY')
    private communityUsersRepository: typeof CommunityUser,
    @Inject('EXISTING_ITEM_REPOSITORY')
    private existingItemRepository: typeof ExistingItem,
    @Inject('ITEMS_REPOSITORY')
    private itemRepository: typeof Item,
    @Inject('BIDS_REPOSITORY')
    private bidRepository: typeof Bid,
    @Inject('OFFERS_REPOSITORY')
    private offerRepository: typeof Offer,
    @Inject('OFFER_PAIRS_REPOSITORY')
    private offerPairsRepository: typeof OfferPair,
    @Inject('CHECKOUT_REPOSITORY')
    private checkoutRepository: typeof Checkout,
  ) {}
  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(client.id);
    for (const key in this.users) {
      if (this.users[key].id === client.id) {
        delete this.users[key];
        break;
      }
    }
    console.log(
      'DISCONNECT ---------------- Current Users ->',
      Object.keys(this.users),
    );
  }

  async notifyError(err: string, userId: number) {
    this.notifyUser(userId, 'notifyError', err);
  }

  async onExistingItemUnpublish(id: number) {
    const chats = await this.chatRepository.findAll({
      include: [
        {
          model: this.bidRepository,
          attributes: ['id'],
          where: {
            [sequelize.Op.or]: [
              {
                existingItemId: id,
              },
              {
                suggestedExistingItemId: id,
              },
            ],
          },
        },
        {
          attributes: ['id'],
          model: this.communityRepository,
          include: [
            {
              attributes: ['id'],
              model: this.userRepository,
            },
          ],
        },
      ],
    });

    if (!chats) return;

    await this.chatRepository.update(
      {
        active: false,
      },
      {
        where: {
          id: chats.map((chat) => chat.id),
        },
      },
    );

    const userIds = [
      ...chats
        .map((chat) => chat.community.users.map((user) => user.id))
        .flat(),
    ];

    if (!userIds.length) return;

    await Promise.all(
      userIds.map((uId) =>
        this.notifyUser(uId, 'existingItemUnpublish', {
          existingItemId: id,
        }),
      ),
    );

    this.countMessages(userIds);
  }

  async notifyUser(userId: number, emitType: EmitTypes, payload?: any) {
    if (!this.users[userId]) {
      return;
    }
    try {
      this.users[userId].emit(emitType, payload);
    } catch (error) {
      console.log('notify err', error);
    }
  }

  countMessages = async (userIds: number[]) => {
    userIds.forEach(async (userId) => {
      const communities = await this.communityRepository.findAll({
        include: [
          {
            model: this.userRepository,
            attributes: ['id'],
            where: {
              id: userId,
            },
          },
        ],
        raw: true,
      });

      const communityIds = communities.map((c) => c.id);

      const counts = await this.chatRepository.findAll({
        where: {
          active: true,
        },
        attributes: [
          // 'id' as 'chatId',
          [sequelize.col('"Chat"."id"'), 'chatId'],
          // [sequelize.col('"messages"."userId"'), 'userId'],
          [
            sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Messages"
          WHERE "Messages"."chatId" = "Chat"."id"
            AND "Messages"."read" = false
            AND "Messages"."userId" != ${userId}
        )`),
            'unreadMessages',
          ],
        ],
        include: [
          {
            model: this.messagesRepository,
            required: true,
            where: {
              userId: {
                [sequelize.Op.not]: userId,
              },
            },
            as: 'messages',
            attributes: [],
          },
          {
            model: this.communityRepository,
            attributes: [],
            where: {
              id: communityIds,
            },
          },
        ],
        raw: true,
        nest: true,
        group: [
          'Chat.id',
          'messages.userId',
          'community.id',
          // 'community.users.id',
          // 'community.users.CommunityUser.id',
          // 'community.users.CommunityUser.userId',
          // 'community.users.CommunityUser.communityId',
        ],
      });

      // const groupByUserCounts = groupBy(counts, 'userId');
      this.notifyUser(+userId, 'countMessages', counts);
    });
  };

  onBidClosed = async (bid: Bid) => {
    if (!bid.chatId) return;

    const currentChat = await this.chatRepository.findOne({
      include: [
        {
          model: this.bidRepository,
          where: {
            id: bid.id,
          },
        },
        {
          attributes: ['id'],
          model: this.communityRepository,
          include: [
            {
              attributes: ['id'],
              model: this.userRepository,
            },
          ],
        },
      ],
    });

    if (!currentChat) return;

    currentChat.active = false;
    await currentChat.save();

    const userIds = currentChat.community.users.map((user) => user.id);

    if (!userIds.length) return;

    await Promise.all(
      userIds.map((uId) =>
        this.notifyUser(uId, 'bidClosed', {
          bid,
        }),
      ),
    );
    this.countMessages(userIds);
  };

  createChat = async (name: string, userIds: Array<string | number>) => {
    const community = await this.communityRepository.create();

    const chat = await this.chatRepository.create({
      name,
      communityId: community.id,
    });

    if (userIds.length)
      await this.communityUsersRepository.bulkCreate(
        userIds.map((userId) => ({
          userId,
          communityId: community.id,
        })),
      );

    return chat;
  };

  onOfferPairAccepted = async (checkout: Checkout) => {
    const chat = await this.createChat('onOfferPairAccepted', [
      checkout.purchaserId,
      checkout.sellerId,
    ]);

    checkout.chatId = chat.id;
    await checkout.save();

    await this.messagesRepository.bulkCreate([
      {
        chatId: chat.id,
        read: false,
        userId: checkout.purchaserId,
        text: `Chat started.
        ${new Date(chat.createdAt).toLocaleDateString('en-GB')} at ${new Date(
          chat.createdAt,
        ).toLocaleTimeString('en-GB')}`,
      },
      {
        chatId: chat.id,
        read: false,
        userId: checkout.sellerId,
        text: `Offer accepted ${new Date().toLocaleDateString(
          'en-GB',
        )} at ${new Date().toLocaleTimeString()}`,
      },
    ]);

    const miscPurchases = await this.offerRepository.findOne(
      this.getMiscChatsRequest('Purchases', checkout.purchaserId),
    );

    const miscSales = await this.offerRepository.findOne(
      this.getMiscChatsRequest('Sales', checkout.sellerId),
    );

    await this.notifyUser(checkout.purchaserId, 'chatCreated', {
      offerType: 'miscPurchases',
      miscPurchases,
    });

    await this.notifyUser(checkout.sellerId, 'chatCreated', {
      offerType: 'miscSales',
      miscSales,
    });

    await this.countMessages([checkout.purchaserId, checkout.sellerId]);
  };

  onBidAccepted = async (bid: Bid) => {
    const chat = await this.createChat('onBidAccepted', [
      bid.userId,
      bid.existingItem.user.id,
    ]);

    bid.chatId = chat.id;
    await bid.save();

    const existingItem = await this.existingItemRepository.findOne({
      where: {
        archived: false,
        published: true,
        id: bid.existingItemId,
      },
      include: [
        {
          model: this.bidRepository,
          where: {
            id: bid.id,
          },
          include: [
            {
              model: this.userRepository,
              attributes: ['nickname', 'id', 'online'],
            },
          ],
        },
        {
          model: this.userRepository,
          attributes: ['nickname', 'id', 'online'],
        },
        {
          model: this.itemRepository,
        },
      ],
    });

    await this.messagesRepository.bulkCreate([
      {
        chatId: chat.id,
        read: false,
        userId: bid.userId,
        text: `Chat started.
        Bid was created ${new Date(bid.createdAt).toLocaleDateString(
          'en-GB',
        )} at ${new Date(bid.createdAt).toLocaleTimeString('en-GB')}`,
      },
      {
        chatId: chat.id,
        read: false,
        userId: bid.existingItem.user.id,
        text: `Bid was accepted ${new Date().toLocaleDateString(
          'en-GB',
        )} at ${new Date().toLocaleTimeString()}`,
      },
    ]);

    await this.notifyUser(bid.userId, 'chatCreated', {
      offerType: 'sentOffers',
      existingItem,
    });

    await this.notifyUser(bid.existingItem.user.id, 'chatCreated', {
      offerType: 'receivedOffers',
      existingItem,
    });

    await this.countMessages([bid.userId, bid.existingItem.user.id]);
  };

  private async _readMessagesOnChat(userId: number, chatId: number) {
    await this.messagesRepository.update(
      {
        read: true,
      },
      {
        where: {
          chatId: chatId,
          userId: {
            [sequelize.Op.not]: userId,
          },
        },
      },
    );

    await this.countMessages([userId]);
  }

  private getMiscChatsRequest = (
    type: 'Purchases' | 'Sales',
    userId: number,
    checkoutId?: number,
  ) => {
    const typedWhereQuery = {};
    if (type === 'Purchases') typedWhereQuery['purchaserId'] = userId;
    else typedWhereQuery['sellerId'] = userId;

    if (checkoutId) typedWhereQuery['id'] = checkoutId;

    const request = {
      where: {
        archived: false,
      },
      include: [
        {
          model: this.offerPairsRepository,
          required: true,
          include: [
            {
              model: this.checkoutRepository,
              where: typedWhereQuery,
              required: true,
              include: [
                {
                  model: this.userRepository,
                  as: 'purchaser',
                  attributes: ['nickname', 'id', 'online'],
                },
                {
                  model: this.userRepository,
                  as: 'seller',
                  attributes: ['nickname', 'id', 'online'],
                },
              ],
            },
          ],
        },
        {
          model: this.itemRepository,
        },
        {
          model: this.userRepository,
          attributes: ['nickname', 'id', 'online'],
        },
      ],
    };

    return request;
  };

  @SubscribeMessage('auth')
  @UseGuards(JwtWSAuthGuard)
  async auth(@MessageBody() auth: AuthDto, @ConnectedSocket() socket: Socket) {
    this.users[auth.user.id] = socket;
    await this.notifyUser(auth.user.id, 'authorized');
  }

  @SubscribeMessage('findAllChat')
  @UseGuards(JwtWSAuthGuard)
  async findAll(
    @MessageBody() query: QueryChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const sentOffers = await this.existingItemRepository.findAll({
      where: {
        archived: false,
        published: true,
      },
      include: [
        {
          model: this.bidRepository,
          where: {
            status: 'accepted',
            userId: query.user.id,
          },
          include: [
            {
              model: this.userRepository,
              attributes: ['nickname', 'id', 'online'],
            },
          ],
        },
        {
          model: this.userRepository,
          attributes: ['nickname', 'id', 'online'],
        },
        {
          model: this.itemRepository,
        },
      ],
    });

    const receivedOffers = await this.existingItemRepository.findAll({
      where: {
        userId: query.user.id,
        archived: false,
        published: true,
      },
      include: [
        {
          model: this.bidRepository,
          include: [
            {
              model: this.userRepository,
              attributes: ['nickname', 'id', 'online'],
            },
          ],
          where: {
            status: 'accepted',
          },
        },
        {
          model: this.itemRepository,
        },
      ],
    });

    const miscSales = await this.offerRepository.findAll(
      this.getMiscChatsRequest('Sales', query.user.id),
    );

    const miscPurchases = await this.offerRepository.findAll(
      this.getMiscChatsRequest('Purchases', query.user.id),
    );

    await this.notifyUser(query.user.id, 'chatsReceived', {
      sentOffers,
      receivedOffers,
      miscPurchases,
      miscSales,
    });
  }

  @SubscribeMessage('countAllChat')
  @UseGuards(JwtWSAuthGuard)
  async countAll(
    @MessageBody() query: QueryChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    // return
    const sentOffers = await this.existingItemRepository.count({
      where: {
        archived: false,
        published: true,
      },
      include: [
        {
          model: this.bidRepository,
          where: {
            status: 'accepted',
            userId: query.user.id,
          },
        },
        {
          model: this.itemRepository,
        },
      ],
    });

    const receivedOffers = await this.existingItemRepository.count({
      where: {
        userId: query.user.id,
        archived: false,
        published: true,
      },
      include: [
        {
          model: this.bidRepository,
          where: {
            status: 'accepted',
          },
        },
        {
          model: this.itemRepository,
        },
      ],
    });
    await this.notifyUser(query.user.id, 'chatsCountsReceived', {
      sentOffers,
      receivedOffers,
    });
  }

  @SubscribeMessage('countMessages')
  @UseGuards(JwtWSAuthGuard)
  async countMessagesReq(@MessageBody() query: QueryChatDto) {
    await this.countMessages([query.user.id]);
  }

  @SubscribeMessage('readMessagesOnChat')
  @UseGuards(JwtWSAuthGuard)
  async readMessagesOnChat(@MessageBody() query: ReadChatDto) {
    if (!query.chatId) return;
    return await this._readMessagesOnChat(query.user.id, query.chatId);
  }

  @SubscribeMessage('sendMessage')
  @UseGuards(JwtWSAuthGuard)
  async sendMessage(
    @MessageBody() query: sendMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    if (query.text.length > 150) {
      this.notifyError('Message too long, 150 letters max', query.user.id);
      return;
    }

    const currentChat = await this.chatRepository.findOne({
      where: { id: query.chatId },
      include: [
        {
          model: this.communityRepository,
          include: [
            {
              required: true,
              attributes: ['nickname', 'id', 'online'],
              model: this.userRepository,
            },
          ],
        },
      ],
    });

    if (
      !currentChat ||
      !currentChat.community.users.find((u) => u.id === query.user.id)
    ) {
      this.notifyError('You cant text to this chat', query.user.id);
      return;
    }

    const message = await this.messagesRepository.create({
      text: query.text,
      userId: query.user.id,
      chatId: query.chatId,
    });

    const relatedUsersIds = currentChat.community.users.map((u) => u.id);
    await this.countMessages(relatedUsersIds);
    await Promise.all(
      relatedUsersIds.map((id) =>
        this.notifyUser(id, 'receiveMessage', message),
      ),
    );
    return;
  }

  @SubscribeMessage('getChat')
  @UseGuards(JwtWSAuthGuard)
  async getChat(
    @MessageBody() query: GetChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatRepository.findOne({
      where: {
        id: query.chatId,
      },
      include: [
        {
          model: this.bidRepository,
          include: [
            {
              model: this.existingItemRepository,
              as: 'existingItem',
              include: [
                {
                  model: this.itemRepository,
                },
              ],
            },
            {
              model: this.existingItemRepository,
              as: 'suggestedExistingItem',
            },
          ],
        },
        {
          model: this.communityRepository,
          include: [
            {
              model: this.userRepository,
              attributes: {
                exclude: ['password', 'discord', 'discordId', 'hash'],
              },
            },
          ],
        },
      ],
    });

    if (!chat.community.users.find((user) => user.id === query.user.id)) {
      this.notifyError('You cant read this chat', query.user.id);
      return;
    }

    const messages = await this.messagesRepository.findAndCountAll({
      where: {
        chatId: query.chatId,
      },
      limit: query.limit,
      offset: query.offset,
      order: [['id', 'DESC']],
      include: [
        {
          model: this.userRepository,
          attributes: ['nickname', 'id', 'online'],
        },
      ],
    });

    await this._readMessagesOnChat(query.user.id, query.chatId);

    await this.notifyUser(query.user.id, 'receiveChatMessages', {
      chatId: query.chatId,
      chat,
      messages: messages.rows || [],
      count: messages.count,
      users: chat.community.users,
    });
  }
}
