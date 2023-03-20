import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import sequelize from 'sequelize';
import { AttributePair } from 'src/attribute/attribute-pair.entity';
import { Attribute } from 'src/attribute/attribute.entity';
import { Bid } from 'src/bid/bid.entity';
import { ChatGateway } from 'src/chat/chat.gateway';
import { QueryItemDto } from 'src/item/dto/query-item.dto';
import { Item } from 'src/item/item.entity';
import { Stat } from 'src/stat/stat.entity';
import { User } from 'src/user/user.entity';
import { CreateExistingItemDto } from './dto/create-existing-item.dto';
import { UpdateExistingItemDto } from './dto/update-existing-item.dto';
import { ExistingItem } from './existing-item.entity';
const ATTRIBUTE_BASE_WEIGHT = 1.444455623;
const LIMITS = {
  WTB: 10,
  WTS: 20,
};
@Injectable()
export class ExistingItemService {
  constructor(
    @Inject('BIDS_REPOSITORY')
    private bidRepository: typeof Bid,
    private chatGateway: ChatGateway,
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
    @Inject('SEQUELIZE')
    private db,
  ) {}

  async create(createExistingItemDto: CreateExistingItemDto, user: User) {
    const quantityOfExistingItems = await this.existingItemRepository.count({
      where: {
        userId: user.id,
        offerType: createExistingItemDto.offerType,
        archived: false,
      },
    });

    if (quantityOfExistingItems > LIMITS[createExistingItemDto.offerType])
      throw new ForbiddenException(
        `You cant have more than ${LIMITS[createExistingItemDto.offerType]} ${
          createExistingItemDto.offerType
        } items`,
      );

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

  async count(user: User) {
    const quantityOfExistingItems = await this.existingItemRepository.findAll({
      where: {
        userId: user.id,
        archived: false,
      },
      attributes: [
        'offerType',
        [sequelize.fn('COUNT', sequelize.col('offerType')), 'offerTypeCount'],
      ],
      group: ['offerType'],
    });

    return { quantity: quantityOfExistingItems, limits: LIMITS };
  }

  async findAllByItemIdAndUserId(
    query: QueryItemDto,
    itemId: number,
    userId: number | null = null,
    user: User,
  ) {
    const existingItemWhere = {
      archived: false,
      itemId,
    };

    if (userId) existingItemWhere['userId'] = userId;

    if (isNaN(query.limit) || isNaN(query.offset))
      throw new ForbiddenException('You must paginate this query');

    const itemWhere = {};

    if (query.slot) {
      itemWhere['slot'] = query.slot;
    }

    if (!query.published && query.hideMine) {
      throw new ForbiddenException('You cant find not own private items');
    }

    existingItemWhere['published'] = query.published;

    if (!query.published) existingItemWhere['userId'] = user.id;

    // ALL FILTER
    // if (query.offerType) existingItemWhere['offerType'] = query.offerType;

    existingItemWhere['offerType'] = query.offerType;
    if (query.hideMine)
      existingItemWhere[sequelize.Op.not] = { userId: user.id };

    const item = await this.existingItemRepository.findAndCountAll({
      where: existingItemWhere,
      include: [
        this.statRepository,
        {
          model: this.itemRepository,
          where: itemWhere,
        },
        {
          model: this.userRepository,
          attributes: {
            exclude: ['password', 'discord', 'discordId', 'hash'],
          },
        },
      ],
      limit: query.limit,
      offset: query.offset,
    });

    if (!item) return [];
    return item;
  }

  async findOne(id: number) {
    const existingItem = await this.existingItemRepository.findOne({
      where: {
        id,
        archived: false,
      },
      include: [
        this.statRepository,
        this.itemRepository,
        {
          model: this.userRepository,
          attributes: {
            exclude: ['password', 'discord', 'discordId', 'hash'],
          },
        },
      ],
    });

    if (!existingItem) throw new NotFoundException('Item not found');
    return existingItem;
  }

  async findSimilar(id: number) {
    const baseExistingItem = await this.existingItemRepository.findOne({
      where: {
        id,
        archived: false,
      },
      include: [
        {
          model: this.statRepository,
          attributes: ['attributeId'],
        },
        this.itemRepository,
        {
          model: this.userRepository,
          attributes: {
            exclude: ['password', 'discord', 'discordId', 'hash'],
          },
        },
      ],
    });

    // function* chooseKCombos(arr: number[], k: number, start = 0, combo = []) {
    //   if (combo.length === k) {
    //     yield combo;
    //     return;
    //   }

    //   for (let i = start; i < arr.length; i++) {
    //     yield* chooseKCombos(arr, k, i + 1, [...combo, arr[i]]);
    //   }
    // }

    //tupeyshiy cancer udalit fast amuleti teper amuleti ringi teper ringi
    const itemIdLF = [1, 2, 3, 4, 5].includes(baseExistingItem.item.id)
      ? [1, 2, 3, 4, 5]
      : [6, 7, 8, 9].includes(baseExistingItem.item.id)
      ? [6, 7, 8, 9]
      : [baseExistingItem.item.id];

    const baseExistingItemAttributeIds = baseExistingItem.stats.map(
      (a) => a.attributeId,
    );
    const pairedAttributes = await this.attributePairsRepository.findAll({
      where: {
        attributeId: baseExistingItemAttributeIds,
      },
    });

    const similarAttributeIds = [
      ...baseExistingItem.stats.map((a) => a.attributeId),
      ...pairedAttributes.map((a) => a.destAttributeId),
    ];

    const pageSize = 6;
    const offset = 0;

    const query = `
    SELECT "ExistingItem".*, 
      SUM(
        CASE 
          WHEN "Stat"."attributeId" IN (${baseExistingItem.stats
            .map((a) => a.attributeId)
            .join(
              ', ',
            )}) THEN CAST("Stat"."value" AS INTEGER) * ${ATTRIBUTE_BASE_WEIGHT}
          ELSE CAST("Stat"."value" AS INTEGER) 
        END
      ) AS weight
    FROM "ExistingItems" AS "ExistingItem"
    LEFT JOIN "Stats" AS "Stat" ON "Stat"."existingItemId" = "ExistingItem"."id"
    WHERE "ExistingItem"."id" != ${id}
    AND "ExistingItem"."archived" = false
    AND "ExistingItem"."itemId" IN (${itemIdLF.join(', ')})
    AND "Stat"."attributeId" IN (${similarAttributeIds.join(', ')})
    GROUP BY "ExistingItem"."id"
    ORDER BY weight DESC
    LIMIT ${pageSize}
    OFFSET ${offset};
  `;
    const existingItems = await this.db.query(query, {
      model: this.existingItemRepository,
      mapToModel: true,
      include: [
        {
          model: this.statRepository,
          include: [this.attributeRepository],
        },
        this.itemRepository,
      ],
    });

    return existingItems;
  }

  // publish unpublish
  async update(
    id: number,
    updateExistingItemDto: UpdateExistingItemDto,
    user: User,
  ) {
    const currentExistingItem = await this.existingItemRepository.findOne({
      where: {
        id,
        userId: user.id,
        archived: false,
      },
    });

    if (!currentExistingItem)
      throw new ForbiddenException('You cant update this item');

    // DELETE ALL BIDS
    if (!updateExistingItemDto.published || updateExistingItemDto.archived) {
      await this.bidRepository.update(
        {
          status: 'deleted',
        },
        {
          where: {
            existingItemId: id,
          },
        },
      );
    }

    await this.existingItemRepository.update(updateExistingItemDto, {
      where: {
        id,
        userId: user.id,
        archived: false,
      },
    });

    try {
      // DELETE CHAT
      if (!updateExistingItemDto.published || updateExistingItemDto.archived) {
        this.chatGateway.onExistingItemUnpublish(id);
      }
    } catch (error) {
      console.log('unpublish err', error);
    }

    return updateExistingItemDto.archived || (await this.findOne(id));
  }

  async changeDiscordNotification(id: number, bool: boolean, user: User) {
    const currentExistingItem = await this.existingItemRepository.findOne({
      where: {
        id,
        userId: user.id,
        archived: false,
      },
    });

    if (!currentExistingItem)
      throw new ForbiddenException('You cant change this item');

    currentExistingItem.discordNotification = bool;
    await currentExistingItem.save();
    return bool;
  }

  remove(id: number) {
    return `This action removes a #${id} existingItem`;
  }
}
