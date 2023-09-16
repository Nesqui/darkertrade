import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Item } from 'src/item/item.entity';
import { User } from 'src/user/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { QueryOfferDto } from './dto/query-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferPair } from './offer-pair.entity';
import { Offer } from './offer.entity';
import { groupBy } from 'lodash';

const MAX_RARITY_GROUP_LENGTH = 5; // Максимальное количество пар в одной рарити группе

@Injectable()
export class OfferService {
  constructor(
    @Inject('OFFERS_REPOSITORY')
    private offerRepository: typeof Offer,
    @Inject('USERS_REPOSITORY')
    private userRepository: typeof User,
    @Inject('ITEMS_REPOSITORY')
    private itemRepository: typeof Item,
    @Inject('OFFER_PAIRS_REPOSITORY')
    private offerPairRepository: typeof OfferPair,
  ) {}

  async filter(query: QueryOfferDto, user: User) {
    const offersWhere = {
      archived: false,
      offerType: query.offerType,
    };

    if (query.mine) {
      offersWhere['userId'] = user.id;
    }

    const req = {
      where: offersWhere,
      limit: query.limit,
      offset: query.offset,
      distinct: true,
      include: [
        {
          model: this.itemRepository,
        },
        {
          model: this.userRepository,
          attributes: ['nickname', 'id', 'online'],
        },
        {
          model: this.offerPairRepository,
        },
      ],
    };

    const offers = await this.offerRepository.findAndCountAll(req);
    return offers;
  }

  // Проверка превышения количества пар в одной рарити группе
  private validateRarityGroup(dto: CreateOfferDto | UpdateOfferDto) {
    const rarityGroups = groupBy(dto.offerPairs, 'rarity');
    for (const key in rarityGroups) {
      if (Object.prototype.hasOwnProperty.call(rarityGroups, key)) {
        const group = rarityGroups[key];
        if (group.length > MAX_RARITY_GROUP_LENGTH)
          throw new ForbiddenException(
            `Rarity group cant have more that ${MAX_RARITY_GROUP_LENGTH} items`,
          );
      }
    }
  }

  async create(createOfferDto: CreateOfferDto, user: User) {
    this.validateRarityGroup(createOfferDto);

    const offer = await this.offerRepository.create(
      {
        ...createOfferDto,
        userId: user.id,
      },
      {
        include: {
          model: this.offerPairRepository,
        },
      },
    );

    return offer;
  }

  async findAll() {
    return await this.offerRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
