import { Injectable, Inject, NotFoundException } from '@nestjs/common';
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

  async findUserItem(userId: number, existingItemId: number) {
    const res = await this.itemsRepository.findOne({
      include: [
        {
          model: this.existingItemRepository,
          where: {
            id: existingItemId,
            userId,
          },
          required: true,
          include: [
            {
              model: this.usersRepository,
              attributes: {
                exclude: ['password', 'discord'],
              },
            },
            this.statRepository,
            this.bidsRepository,
            this.itemsRepository,
          ],
        },
      ],
    });

    if (!res)
      throw new NotFoundException('Item not exist or not related this user');
    return res;
  }

  async findUserItems(userId: number) {
    return await this.itemsRepository.findAll({
      include: [
        {
          model: this.existingItemRepository,
          required: true,
          where: {
            userId,
          },
          include: [
            {
              model: this.usersRepository,
              attributes: {
                exclude: ['password', 'discord'],
              },
            },
            this.statRepository,
            this.itemsRepository,
            this.bidsRepository,
          ],
        },
      ],
    });
  }

  async getMarket(itemQuery: QueryItemDto) {
    const where = {};
    if (itemQuery.slot) where['slot'] = itemQuery.slot;
    return await this.itemsRepository.findAll({
      where,
      include: [
        {
          model: this.existingItemRepository,
          required: true,
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
