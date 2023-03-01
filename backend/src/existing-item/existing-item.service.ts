import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import sequelize from 'sequelize';
import { AttributePair } from 'src/attribute/attribute-pair.entity';
import { Attribute } from 'src/attribute/attribute.entity';
import { Item } from 'src/item/item.entity';
import { Stat } from 'src/stat/stat.entity';
import { User } from 'src/user/user.entity';
import { CreateExistingItemDto } from './dto/create-existing-item.dto';
import { FilterExistingItemDto } from './dto/filter-existing-item.dto';
import { UpdateExistingItemDto } from './dto/update-existing-item.dto';
import { ExistingItem } from './existing-item.entity';
const ATTRIBUTE_BASE_WEIGHT = 2;
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
    @Inject('ATTRIBUTES_PAIRS_REPOSITORY')
    private attributePairsRepository: typeof AttributePair,
    @Inject('ATTRIBUTES_REPOSITORY')
    private attributeRepository: typeof Attribute,
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
    const existingItem = await this.existingItemRepository.findByPk(id, {
      include: [this.statRepository, this.itemRepository, this.userRepository],
    });

    if (!existingItem) throw new NotFoundException('Item not found');
    return existingItem;
  }

  async findSimilar(id: number) {
    const baseItem = await this.existingItemRepository.findByPk(id, {
      include: [
        {
          model: this.statRepository,
          attributes: ['attributeId'],
        },
        this.itemRepository,
        this.userRepository,
      ],
    });

    function* chooseKCombos(arr: number[], k: number, start = 0, combo = []) {
      if (combo.length === k) {
        yield combo;
        return;
      }

      for (let i = start; i < arr.length; i++) {
        yield* chooseKCombos(arr, k, i + 1, [...combo, arr[i]]);
      }
    }

    // separate slots
    // gunдонскuй methoд
    const itemIdLF = [1, 2, 3, 4, 5].includes(baseItem.item.id)
      ? [1, 2, 3, 4, 5]
      : [6, 7, 8, 9].includes(baseItem.item.id)
        ? [6, 7, 8, 9]
        : [baseItem.item.id];

    const whereItemRep = { id: itemIdLF };

    const baseItemStatsIds = baseItem.stats.map((a) => a.attributeId);
    const pairedAttributes = await this.attributePairsRepository.findAll({
      where: {
        attributeId: baseItemStatsIds,
      },
    });

    //pv cver appendnut array
    const similarAttributeIds = [
      ...baseItem.stats.map((a) => a.attributeId),
      ...pairedAttributes.map((a) => a.attributeId),
    ];

    // What we consider relevant in stats
    // If item has more stats than 2 count as (n-1) for leniency
    const amountOfStats =
      baseItem.stats.length > 2
        ? baseItem.stats.length - 1
        : baseItem.stats.length;

    const whereStatRep = {
      [sequelize.Op.or]: [
        ...chooseKCombos(similarAttributeIds, amountOfStats),
      ].map((a) => ({
        attributeId: a,
      })),
    };

    const existingItems = await this.existingItemRepository.findAll({
      include: [
        {
          model: this.statRepository,
          where: whereStatRep,
        },
        {
          model: this.itemRepository,
          where: whereItemRep,
        },
      ],
    });

    //logic
    existingItems.forEach((existingItem) => {
      existingItem['weight'] = existingItem.stats.reduce((pv, cv) => {
        if (baseItemStatsIds.includes(cv.attributeId)) pv += Number(cv.value);
        pv += Number(cv.value) * ATTRIBUTE_BASE_WEIGHT;
        return pv;
      }, 0);
    });

    existingItems.sort((a, b) => b['weight'] - a['weight']);
    return existingItems;
  }

  update(id: number, updateExistingItemDto: UpdateExistingItemDto) {
    return `This action updates a #${id} existingItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} existingItem`;
  }
}
