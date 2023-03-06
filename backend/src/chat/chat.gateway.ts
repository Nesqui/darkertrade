import { Inject, UseGuards } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWSAuthGuard } from 'src/auth/guards/ws-jwt-auth.guard';
import { Bid } from 'src/bid/bid.entity';
import { CommunityUser } from 'src/community/community-user.entity';
import { Community } from 'src/community/community.entity';
import { Message } from 'src/messages/messages.entity';
import { User } from 'src/user/user.entity';
import { Chat } from './chat.entity';
import { AuthDto } from './dto/auth.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

type EmitTypes = 'chatCreated' | 'authRequired'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  users = {}
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
  ) { }
  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    for (const key in this.users) {
      if (Object.prototype.hasOwnProperty.call(this.users, key)) {
        this.users[key] = this.users[key].filter(ws => ws.id !== client.id)
        if (!this.users[key].length) delete this.users[key]
      }
    }
    console.log('DISCONNECT ---------------- USERS', Object.keys(this.users).length);

    for (const key in this.users) {
      console.log('key', key, 'length', this.users[key].length);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {

  }

  async notifyUser(userId: number, emitType: EmitTypes, payload: any) {
    if (!this.users[userId]) {
      throw new Error("User not found")
    }

    try {
      await Promise.all(this.users[userId].map(socket => socket.emit(emitType, payload)))

    } catch (error) {
      console.log('notify err', error);
    }
  }

  onBidAccepted = async (bid: Bid) => {
    const community = await this.communityRepository.create()

    const chat = await this.chatRepository.create({
      name: 'onBidAccepted',
      communityId: community.id
    })

    const userGroup = await this.communityUsersRepository.bulkCreate([{
      userId: bid.userId,
      communityId: community.id
    },
    {
      userId: bid.existingItem.user.id,
      communityId: community.id
    }])

    const res = await this.chatRepository.findByPk(chat.id)
    return res
  }

  @SubscribeMessage('auth')
  @UseGuards(JwtWSAuthGuard)
  async auth(@MessageBody() auth: AuthDto, @ConnectedSocket() socket: Socket) {
    if (!this.users[auth.user.id]) {
      this.users[auth.user.id] = [socket]
    }
    else
      this.users[auth.user.id] = [...this.users[auth.user.id], socket]

    console.log('CONNECT ----------------');

    for (const key in this.users) {
      console.log('key', key, 'length', this.users[key].length);
    }
    await this.notifyUser(auth.user.id, 'chatCreated', 123)
  }

  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
