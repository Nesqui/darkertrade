import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import sequelize from 'sequelize';
import { Attribute } from 'src/attribute/attribute.entity';
import { ChatGateway } from 'src/chat/chat.gateway';
import DiscordGateway from 'src/discord/discord.gateway';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Item } from 'src/item/item.entity';
import { Stat } from 'src/stat/stat.entity';
import { User } from 'src/user/user.entity';
import { Bid } from './bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { QueryBidDto } from './dto/query-bid.dto';
const DELAY_TIME_CREATE_BIT = 60 * 1000 * 5;

@Injectable()
export class BidService {
  constructor(
    @Inject('BIDS_REPOSITORY')
    private bidRepository: typeof Bid,
    @Inject('USERS_REPOSITORY')
    private userRepository: typeof User,
    @Inject('EXISTING_ITEM_REPOSITORY')
    private existingItemRepository: typeof ExistingItem,
    private chatGateway: ChatGateway,
    private discordGateway: DiscordGateway,
    @Inject('STATS_REPOSITORY')
    private statRepository: typeof Stat,
    @Inject('USERS_REPOSITORY') private usersRepository: typeof User,
    @Inject('ITEMS_REPOSITORY')
    private itemRepository: typeof Item,
    @Inject('ATTRIBUTES_REPOSITORY')
    private attributeRepository: typeof Attribute,
  ) { }

  async create(createBidDto: CreateBidDto, user: User) {
    const existingItem = await this.existingItemRepository.findOne({
      where: {
        id: createBidDto.existingItemId,
        archived: false,
        published: true
      },
    });
    if (!existingItem) throw new NotAcceptableException('Item not found');

    const alreadyCreatedExistingItem =
      await this.existingItemRepository.findOne({
        where: {
          id: createBidDto.existingItemId,
          archived: false,
        },
        order: [
          [
            {
              model: this.bidRepository,
              as: 'bids',
            },
            'updatedAt',
            'desc',
          ],
        ],
        include: [
          {
            model: this.bidRepository,
            where: {
              userId: user.id,
            },
          },
        ],
      });

    if (alreadyCreatedExistingItem?.bids.length) {
      if (
        alreadyCreatedExistingItem?.bids.find(
          (bid) => !(bid.status === 'deleted' || bid.status === 'declined'),
        )
      )
        throw new ForbiddenException(
          'You cant create another bid for this item',
        );

      const timeDiff =
        new Date().getTime() -
        new Date(alreadyCreatedExistingItem.bids[0].updatedAt!).getTime();

      if (timeDiff < DELAY_TIME_CREATE_BIT)
        throw new ForbiddenException(
          `You cant create bid for this item ~${(
            (DELAY_TIME_CREATE_BIT - timeDiff) /
            (1000 * 60)
          ).toFixed(0)} minutes`,
        );
    }

    if (existingItem.userId === user.id)
      throw new ForbiddenException('You cant create bid for Your own item');

    if (existingItem.offerType === 'WTB') {
      if (!createBidDto.suggestedExistingItemId)
        throw new NotAcceptableException('Suggested item not presented');

      const suggestItem = await this.existingItemRepository.findOne({
        where: {
          id: createBidDto.suggestedExistingItemId,
          userId: user.id
        }
      });

      if (!suggestItem)
        throw new NotAcceptableException('You cant suggest this item');

      if (suggestItem.itemId !== existingItem.itemId)
        throw new NotAcceptableException('Suggested item has different type');
    }

    const createdBid = await this.bidRepository.create({
      ...createBidDto,
      userId: user.id,
    });

    const bid = await this.bidRepository.findByPk(createdBid.id, {
      include: [
        {
          model: this.userRepository,
          attributes: {
            exclude: ['password', 'discord'],
          },
        },
        {
          as: 'existingItem',
          model: this.existingItemRepository,
          include: [
            {
              model: this.usersRepository,
              attributes: {
                exclude: ['password', 'discord'],
              },
            },
            {
              model: this.itemRepository,
            },
          ],
        },
        {
          model: this.existingItemRepository,
          as: 'suggestedExistingItem',
          include: [
            this.statRepository,
            {
              model: this.usersRepository,
              attributes: {
                exclude: ['password', 'discord'],
              },
            },
          ],
        },
      ],
    });

    try {
      await this.discordGateway.onBidCreated(bid);
      delete bid.user.dataValues.discordId;
      delete bid.existingItem.user.dataValues.discordId;
      if (bid.suggestedExistingItem)
        delete bid.suggestedExistingItem.user.dataValues.discordId;
    } catch (error) {
      console.log('DISCORD CANT SEND', error);
    }
    return bid;
  }

  async filter(query: QueryBidDto, user: User) {
    const bidsWhere = {}
    const excludedStatuses = ['deleted']
    const suggestedExistingItemWhere = {}
    const existingItemWhere = {
      offerType: query.offerType,
      published: true
    }

    console.log(JSON.stringify(query));

    if (query.mine)
      existingItemWhere['userId'] = user.id

    bidsWhere[sequelize.Op.not] = {
      status: excludedStatuses
    }

    // else
    //   suggestedExistingItemWhere['userId'] = user.id

    const req = {
      where: existingItemWhere,
      limit: query.limit,
      offset: query.offset,
      include: [
        {
          model: this.statRepository,
          include: [this.attributeRepository]
        },
        {
          required: true,
          model: this.bidRepository,
          where: bidsWhere,
          include: [{
            as: 'suggestedExistingItem',
            model: this.existingItemRepository,
            include: [{
              model: this.statRepository,
              include: [this.attributeRepository]
            },{
              model: this.userRepository,
              attributes: {
                exclude: ['password', 'discord', 'discordId']
              }
            }]
          }, {
            model: this.userRepository,
            attributes: {
              exclude: ['password', 'discord', 'discordId']
            }
          }]
        },
        {
          model: this.itemRepository
        }
      ]
    }

    // if (query.sort && query.sort.length)
    //   req['order'] = query.sort

    const existingItems = await this.existingItemRepository.findAll(req)
    return existingItems
  }

  findOne(id: number) {
    return `This action returns a #${id} bid`;
  }

  async accept(id: number, user: User) {
    const bid = await this.bidRepository.findByPk(id, {
      include: [
        {
          model: this.existingItemRepository,
          as: 'existingItem',
          include: [
            {
              model: this.userRepository,
            },
          ],
        },
        this.userRepository,
      ],
    });

    if (user.id !== bid.existingItemId || bid.status !== 'created')
      throw new ConflictException('You cant accept this bid');

    bid.status = 'accepted';

    await bid.save();
    await this.discordGateway.onBidAccepted(bid);
    await this.chatGateway.onBidAccepted(bid);

    return 'accepted';
  }

  async remove(id: number, user: User) {
    const userBid = await this.bidRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!userBid) throw new ForbiddenException('You cant delete this bid');

    userBid.status = 'deleted';
    userBid.save();
    return userBid;
  }
}
