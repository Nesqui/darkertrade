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
import { GetChatDto, QueryChatDto } from './dto/query-chat.dto';

type EmitTypes =
  | 'chatCreated'
  | 'authRequired'
  | 'authorized'
  | 'chatsReceived'
  | 'chatsCountsReceived'
  | 'receiveChatMessages'
  | 'receiveMessage'
  | 'countMessages'
  | 'notifyError';

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

  // handleConnection(client: Socket, ...args: any[]) {}

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
            // include: [
            //   {
            //     model: this.userRepository,
            //     required: true,
            //     where: {
            //       id: userId,
            //     },
            //   },
            // ],
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

  onBidDeclined = async (bid: Bid) => {};

  onBidAccepted = async (bid: Bid) => {
    const community = await this.communityRepository.create();

    const chat = await this.chatRepository.create({
      name: 'onBidAccepted',
      communityId: community.id,
    });

    bid.chatId = chat.id;
    await bid.save();

    const userGroup = await this.communityUsersRepository.bulkCreate([
      {
        userId: bid.userId,
        communityId: community.id,
      },
      {
        userId: bid.existingItem.user.id,
        communityId: community.id,
      },
    ]);

    const res = await this.chatRepository.findByPk(chat.id);
    return res;
  };

  @SubscribeMessage('auth')
  @UseGuards(JwtWSAuthGuard)
  async auth(@MessageBody() auth: AuthDto, @ConnectedSocket() socket: Socket) {
    this.users[auth.user.id] = socket;

    console.log(
      'CONNECT ---------------- Connected users -> ',
      Object.keys(this.users),
    );
    await this.notifyUser(auth.user.id, 'authorized');
  }

  @SubscribeMessage('findAllChat')
  @UseGuards(JwtWSAuthGuard)
  async findAll(
    @MessageBody() query: QueryChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    // return
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
        },
        {
          model: this.userRepository,
          attributes: ['nickname', 'id'],
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
              attributes: ['nickname', 'id'],
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
    await this.notifyUser(query.user.id, 'chatsReceived', {
      sentOffers,
      receivedOffers,
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
              attributes: ['nickname', 'id'],
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
          model: this.communityRepository,
          include: [
            {
              model: this.userRepository,
              attributes: {
                exclude: ['password', 'discord', 'discordId'],
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
      include: [
        {
          model: this.userRepository,
          attributes: ['nickname', 'id'],
        },
      ],
    });

    await this.messagesRepository.update(
      {
        read: true,
      },
      {
        where: {
          chatId: query.chatId,
          userId: {
            [sequelize.Op.not]: query.user.id,
          },
        },
      },
    );

    await this.countMessages([query.user.id]);

    await this.notifyUser(query.user.id, 'receiveChatMessages', {
      chatId: query.chatId,
      messages: messages.rows || [],
      count: messages.count,
      users: chat.community.users,
    });
  }
}
