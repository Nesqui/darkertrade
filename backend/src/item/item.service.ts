import { Injectable, Inject } from '@nestjs/common';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Stat } from 'src/stat/stat.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { QueryItemDto } from './dto/query-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @Inject('ITEMS_REPOSITORY') private itemsRepository: typeof Item,
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

  async getMarket(itemQuery: QueryItemDto) {
    const where = {};
    if (itemQuery.slot) where['slot'] = itemQuery.slot;
    return await this.itemsRepository.findAll({
      where,
      include: [
        {
          model: this.existingItemRepository,
          required: true,
          include: [this.statRepository]
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
