import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import sequelize from 'sequelize';
import { QueryTypes, Includeable } from 'sequelize';
// import { BaseStat } from 'src/base-stat/base-stat.entity';
import { Bid } from 'src/bid/bid.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Stat } from 'src/stat/stat.entity';
import { User } from 'src/user/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { QueryItemDto } from './dto/query-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './item.entity';
import { Offer } from 'src/offer/offer.entity';
import { OfferPair } from 'src/offer/offer-pair.entity';
import { Checkout } from 'src/checkout/checkout.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ItemService {
  constructor(
    @Inject('ITEMS_REPOSITORY') private itemsRepository: typeof Item,
    // @Inject('BASE_STAT_REPOSITORY') private baseStatRepository: typeof BaseStat,
    @Inject('USERS_REPOSITORY') private usersRepository: typeof User,
    @Inject('BIDS_REPOSITORY') private bidsRepository: typeof Bid,

    @Inject('OFFERS_REPOSITORY') private offerRepository: typeof Offer,
    @Inject('OFFER_PAIRS_REPOSITORY')
    private offerPairRepository: typeof OfferPair,
    @Inject('CHECKOUT_REPOSITORY') private checkoutRepository: typeof Checkout,

    @Inject('EXISTING_ITEM_REPOSITORY')
    private existingItemRepository: typeof ExistingItem,
    @Inject('STATS_REPOSITORY')
    private statRepository: typeof Stat,
    @Inject('SEQUELIZE')
    private db,

    private configService: ConfigService,
  ) {}

  create(createItemDto: CreateItemDto) {
    return 'This action adds a new item';
  }

  // async getBase() {
  //   return await this.itemsRepository.findAll({
  //     include: [
  //       {
  //         model: this.baseStatRepository,
  //       },
  //     ],
  //   });
  // }

  async findAll(itemQuery: QueryItemDto) {
    const where = {};
    if (itemQuery.slot) where['slot'] = itemQuery.slot;
    if (itemQuery.ignore)
      where['slot'] = { [sequelize.Op.not]: itemQuery.ignore };
    return await this.itemsRepository.findAll({
      where,
    });
  }

  async getItemByCheckoutId(checkoutId: number) {
    const checkout = await this.checkoutRepository.findByPk(checkoutId, {
      include: [
        {
          model: this.offerPairRepository,
          include: [
            {
              model: this.offerRepository,
              include: [
                {
                  model: this.itemsRepository,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!checkout) return null;
    return checkout.offerPair.offer.item;
  }

  async getItemById(id: number) {
    return await this.itemsRepository.findByPk(id);
  }

  // http://localhost:5173/items/60px-Cobalt_Ingot.png
  getItemImageByName = (name: string) =>
    this.configService.get('APP_URL') +
    `/items/60px-${name.replace(/ /g, '_')}.png`;

  async findUserItem(userId: number, existingItemId: number, user: User) {
    const existingItemWhere = {
      id: existingItemId,
      userId,
      archived: false,
    };
    if (user && user.id !== userId) existingItemWhere['published'] = true;

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

  async findUserItems(
    userId: number,
    query: QueryItemDto,
    user: User | undefined,
  ) {
    const existingItemWhere = {
      userId,
      archived: false,
    };

    const itemWhere = {};

    if (query.slot) itemWhere['slot'] = query.slot;

    if (query.id) {
      itemWhere['id'] = query.id;
    }

    existingItemWhere['published'] = query.published;
    existingItemWhere['offerType'] = query.offerType;

    if (query.searchItemString) {
      itemWhere['name'] = {
        [sequelize.Op.iLike]: `%${query.searchItemString}%`,
      };
    }

    if (user && user.id !== userId) existingItemWhere['published'] = true;

    return await this.itemsRepository.findAll({
      where: itemWhere,
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

  async getMarket(query: QueryItemDto, user: User | undefined) {
    const itemWhere = {};

    const existingItemWhere = {
      published: true,
      archived: false,
    };

    if (query.slot) itemWhere['slot'] = query.slot;
    if (query.offerType) existingItemWhere['offerType'] = query.offerType;

    if (user && query.hideMine)
      existingItemWhere[sequelize.Op.not] = { userId: user.id };

    if (query.searchItemString) {
      itemWhere['name'] = {
        [sequelize.Op.iLike]: `%${query.searchItemString}%`,
      };
    }

    const res = await this.itemsRepository.findAll({
      where: itemWhere,
      order: [['name', 'ASC']],
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
