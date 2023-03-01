import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Item } from 'src/item/item.entity';
import { Stat } from 'src/stat/stat.entity';
import { User } from 'src/user/user.entity';
import { CreateExistingItemDto } from './dto/create-existing-item.dto';
import { FilterExistingItemDto } from './dto/filter-existing-item.dto';
import { UpdateExistingItemDto } from './dto/update-existing-item.dto';
import { ExistingItem } from './existing-item.entity';

@Injectable()
export class ExistingItemService {
  constructor(
    @Inject('EXISTING_ITEM_REPOSITORY')
    private existingItemRepository: typeof ExistingItem,
    @Inject('USERS_REPOSITORY')
    private userRepository: typeof User,
    @Inject('STATS_REPOSITORY')
    private statRepository: typeof Stat,
    @Inject('ITEMS_REPOSITORY')
    private itemRepository: typeof Item,
  ) { }

  async create(createExistingItemDto: CreateExistingItemDto, user: User) {
    const item = await this.existingItemRepository.create(
      {
        ...createExistingItemDto,
        userId: user.id,
      },
      {
        include: [this.statRepository],
      },
    );
    if (!item) throw new NotFoundException('Item not found');
    return await this.findOne(item.id);
  }

  async findAll(filterExistingItemDto: FilterExistingItemDto) {
    const filter = { ...filterExistingItemDto };
    const itemWhere = {};

    if (filter.slot) {
      itemWhere['slot'] = filterExistingItemDto.slot;
      delete filter.slot;
    }

    const item = await this.existingItemRepository.findAll({
      where: { ...filter },
      include: [
        this.statRepository,
        {
          model: this.itemRepository,
          where: itemWhere,
        },
        this.userRepository,
      ],
    });

    if (!item) return [];
    return item;
  }

  async findOne(id: number) {
    const item = await this.existingItemRepository.findByPk(id, {
      include: [this.statRepository, this.itemRepository, this.userRepository],
    });

    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async findSimilar(id: number) {
    // sequelize.op
    const item = await this.existingItemRepository.findAll({
      where: {},
      include: [this.statRepository, this.itemRepository, this.userRepository],
    });
    //logic
    return item;
  }

  update(id: number, updateExistingItemDto: UpdateExistingItemDto) {
    return `This action updates a #${id} existingItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} existingItem`;
  }
}
