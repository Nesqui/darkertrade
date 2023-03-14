import { Inject, UseGuards } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { async } from 'rxjs';
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
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto, QueryChatDto } from './dto/query-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

type EmitTypes =
  | 'chatCreated'
  | 'authRequired'
  | 'authorized'
  | 'chatsReceived'
  | 'chatsCountsReceived';

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
    for (const key in this.users) {
      if (Object.prototype.hasOwnProperty.call(this.users, key)) {
        this.users[key] = this.users[key].filter((ws) => ws.id !== client.id);
        if (!this.users[key].length) delete this.users[key];
      }
    }
    console.log(
      'DISCONNECT ---------------- USERS',
      Object.keys(this.users).length,
    );

    for (const key in this.users) {
      console.log('key', key, 'length', this.users[key].length);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {}

  async notifyUser(userId: number, emitType: EmitTypes, payload?: any) {
    if (!this.users[userId]) {
      throw new Error('User not found');
    }

    try {
      await Promise.all(
        this.users[userId].map((socket) => socket.emit(emitType, payload)),
      );
    } catch (error) {
      console.log('notify err', error);
    }
  }

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
    if (!this.users[auth.user.id]) {
      this.users[auth.user.id] = [socket];
    } else this.users[auth.user.id] = [...this.users[auth.user.id], socket];

    console.log('CONNECT ----------------');

    for (const key in this.users) {
      console.log('key', key, 'length', this.users[key].length);
    }
    await this.notifyUser(auth.user.id, 'authorized');
  }

  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }

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

  @SubscribeMessage('getChat')
  @UseGuards(JwtWSAuthGuard)
  async getChat(
    @MessageBody() query: GetChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log({ query });

    const messages = this.messagesRepository.findAndCountAll({
      where: {
        chatId: query.chatId,
      },
      limit: query.limit,
      offset: query.offset,
      order: [['id', 'DESC']],
      include: [
        {
          model: this.userRepository,
          attributes: ['nickname', 'id'],
        },
      ],
    });

    // await this.notifyUser(query.user.id, 'chatsCountsReceived', {
    //   sentOffers,
    //   receivedOffers,
    // });
  }
}
