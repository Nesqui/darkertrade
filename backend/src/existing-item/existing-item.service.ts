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
    const item = await this.existingItemRepository.findByPk(id, {
      include: [this.statRepository, this.itemRepository, this.userRepository],
    });

    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async findSimilar(id: number) {
    const baseItem = await this.existingItemRepository.findByPk(id, {
      include: [this.statRepository, this.itemRepository, this.userRepository],
    });

    function* chooseKCombos(arr, k, start = 0, combo = []) {
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
    const itemIdLF = [1, 2, 3, 4, 5].includes(baseItem.item.id) ? [1, 2, 3, 4, 5] : [6, 7, 8, 9].includes(baseItem.item.id) ? [6, 7, 8, 9] : [baseItem.item.id]
    const whereItemRep = { id: itemIdLF }


    const baseItemStatsArr = baseItem.stats.map(a => a.attributeId)
    const pairedAttributes = await this.attributePairsRepository.findAll({
      where: {
        attributeId: baseItemStatsArr
      }
    })
    //pv cver appendnut array
    const similarStats = baseItem.stats.map(a => a.attributeId)
    for (const pair of pairedAttributes) {
      similarStats.push(pair.destAttributeId)
    }
    // soglasovano na match
    const amountOfStats = baseItem.stats.length > 2 ? baseItem.stats.length - 1 : baseItem.stats.length;
    const statsLF = [...chooseKCombos(similarStats, amountOfStats)]

    const whereStatRep = {
      [sequelize.Op.or]: statsLF.map(a => ({ attributeId: a }))
    }

    const itemList = await this.existingItemRepository.findAll({
      where: {
        // id: baseItem.item.id
      },
      include: [
        {
          model: this.statRepository,
          where: whereStatRep
        }
        ,
        {
          model: this.itemRepository,
          where: whereItemRep
        },
        this.userRepository],
    });

    //logic   
    const answer = []
    const shadowArr = []
    let valueOfStats = 0
    for (const item of itemList) {

      valueOfStats = 0
      for (const stat of item.stats) {
        if (baseItemStatsArr.includes(stat.attributeId)) valueOfStats += Number(stat.value)
        valueOfStats += Number(stat.value) * 2
      }
      shadowArr.push(valueOfStats)
    }

    let copy = 0
    for (let i = 0; i < shadowArr.length; i++) {
      copy = shadowArr.indexOf(Math.max(...shadowArr))
      shadowArr[i] = -30
      answer.push(itemList[copy])
    }


    return answer

  }

  update(id: number, updateExistingItemDto: UpdateExistingItemDto) {
    return `This action updates a #${id} existingItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} existingItem`;
  }
}
