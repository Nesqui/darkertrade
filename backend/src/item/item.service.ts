import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import sequelize from 'sequelize';
import { QueryTypes, Includeable } from 'sequelize';
import { Bid } from 'src/bid/bid.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Stat } from 'src/stat/stat.entity';
import { User } from 'src/user/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { QueryItemDto } from './dto/query-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @Inject('ITEMS_REPOSITORY') private itemsRepository: typeof Item,
    @Inject('USERS_REPOSITORY') private usersRepository: typeof User,
    @Inject('BIDS_REPOSITORY') private bidsRepository: typeof Bid,
    @Inject('EXISTING_ITEM_REPOSITORY')
    private existingItemRepository: typeof ExistingItem,
    @Inject('STATS_REPOSITORY')
    private statRepository: typeof Stat,
    @Inject('SEQUELIZE')
    private db,
  ) {}

  create(createItemDto: CreateItemDto) {
    return 'This action adds a new item';
  }

  async findAll(itemQuery: QueryItemDto) {
    const where = {};
    if (itemQuery.slot) where['slot'] = itemQuery.slot;
    return await this.itemsRepository.findAll({
      where,
    });
  }

  async findUserItem(userId: number, existingItemId: number, user: User) {
    const existingItemWhere = {
      id: existingItemId,
      userId,
      archived: false,
    };
    if (user.id !== userId) existingItemWhere['published'] = true;

    const res = await this.itemsRepository.findOne({
      include: [
        {
          model: this.existingItemRepository,
          where: existingItemWhere,
          required: true,
          include: [
            {
              model: this.usersRepository,
              attributes: {
                exclude: ['password', 'discord', 'discordId', 'hash'],
              },
            },
            this.statRepository,
            {
              model: this.bidsRepository,
              required: false,
              where: {
                [sequelize.Op.not]: {
                  status: 'deleted',
                },
              },
              include: [
                {
                  model: this.usersRepository,
                  attributes: {
                    exclude: ['password', 'discord', 'discordId', 'hash'],
                  },
                },
                {
                  model: this.existingItemRepository,
                  as: 'suggestedExistingItem',
                  include: [this.statRepository],
                },
              ],
            },
            this.itemsRepository,
          ],
        },
      ],
    });

    if (!res)
      throw new NotFoundException('Item not exist or not related this user');
    return res;
  }

  async findUserItems(userId: number, query: QueryItemDto, user: User) {
    const existingItemWhere = {
      userId,
      archived: false,
    };

    const itemWhere = {};

    if (query.slot) itemWhere['slot'] = query.slot;

    existingItemWhere['published'] = query.published;
    existingItemWhere['offerType'] = query.offerType;
    if (user.id !== userId) existingItemWhere['published'] = true;

    return await this.itemsRepository.findAll({
      include: [
        {
          model: this.existingItemRepository,
          required: true,
          where: existingItemWhere,
          limit: 1,
        },
      ],
    });
  }

  async getMarket(query: QueryItemDto, user: User) {
    const itemWhere = {};

    const existingItemWhere = {
      published: true,
      archived: false,
    };

    if (query.slot) itemWhere['slot'] = query.slot;
    if (query.offerType) existingItemWhere['offerType'] = query.offerType;

    if (query.hideMine)
      existingItemWhere[sequelize.Op.not] = { userId: user.id };

    const res = await this.itemsRepository.findAll({
      where: itemWhere,
      include: [
        {
          model: this.existingItemRepository,
          where: existingItemWhere,
          limit: 1,
        },
      ],
    });

    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
