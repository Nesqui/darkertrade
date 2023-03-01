import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import sequelize from 'sequelize';
import { AttributePair } from 'src/attribute/attribute-pair.entity';
import { Item } from 'src/item/item.entity';
import { Stat } from 'src/stat/stat.entity';
import { User } from 'src/user/user.entity';
import { CreateExistingItemDto } from './dto/create-existing-item.dto';
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

  async findAll() {
    const item = await this.existingItemRepository.findAll({
      include: [this.statRepository, this.itemRepository, this.userRepository],
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
    /*
        function k_combinations(set, k) {
    
          let i, j, combs, head, tailcombs;
          if (k > set.length || k <= 0) {
            return [];
          }
    
          // K-sized set has only one K-sized subset.
          if (k == set.length) {
            return [set];
          }
    
          // There is N 1-sized subsets in a N-sized set.
          if (k == 1) {
            combs = [];
            for (i = 0; i < set.length; i++) {
              combs.push([set[i]]);
            }
            return combs;
          }
          combs = [];
          for (i = 0; i < set.length - k + 1; i++) {
            head = set.slice(i, i + 1);
            tailcombs = k_combinations(set.slice(i + 1), k - 1);
            for (j = 0; j < tailcombs.length; j++) {
              combs.push(head.concat(tailcombs[j]));
            }
          }
          return combs
        }
    */
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

    //count stats MEDIAN    
    // 1 1
    // 2 2
    // 3 2
    // 4 3
    const baseItemStatsArr = baseItem.stats.map(a => a.attributeId)
    const statPairs = await this.attributePairsRepository.findAll({
      include: [this.statRepository, this.itemRepository, this.userRepository],
      where: {
        attributeId: [baseItemStatsArr]
      }
    });
    console.log(statPairs)

    const amountOfStats = baseItem.stats.length > 2 ? baseItem.stats.length - 1 : baseItem.stats.length;
    const statsLF = chooseKCombos(baseItem.stats.map(a => a.attributeId), amountOfStats)



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
    // sequelize.op


    //logic
    return itemList

  }

  update(id: number, updateExistingItemDto: UpdateExistingItemDto) {
    return `This action updates a #${id} existingItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} existingItem`;
  }
}
