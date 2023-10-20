import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Item } from 'src/item/item.entity';
import { User } from 'src/user/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { QueryOfferDto } from './dto/query-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferPair } from './offer-pair.entity';
import { Offer } from './offer.entity';
import { groupBy } from 'lodash';
import sequelize from 'sequelize';
import { CheckoutService } from 'src/checkout/checkout.service';
import { CreateCheckoutDto } from 'src/checkout/dto/create-checkout.dto';
import { AcceptOfferPairDto } from './dto/accept-offer-pair.dto';
import { ChatGateway } from 'src/chat/chat.gateway';
import DiscordGateway from 'src/discord/discord.gateway';

const MAX_RARITY_GROUP_LENGTH = 5; // Максимальное количество пар в одной рарити группе
const MAX_OFFERS_PER_ITEM = 3;

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
    private checkoutService: CheckoutService,
    private chatGateway: ChatGateway,
    private discordGateway: DiscordGateway,
  ) {}

  async filter(query: QueryOfferDto, user: User) {
    const offersWhere = {
      archived: false,
      offerType: query.offerType,
    };

    if (query.hideMine && user) {
      offersWhere['userId'] = {
        [sequelize.Op.not]: user.id,
      };
    }

    if (query.itemId) {
      offersWhere['itemId'] = query.itemId;
    }

    const offers = await this.offerRepository.findAndCountAll({
      where: offersWhere,
      limit: query.limit,
      offset: query.offset,
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
      attributes: [
        [
          sequelize.literal(
            '(SELECT AVG("wantedPrice" / "quantity") FROM "OfferPairs" WHERE "OfferPairs"."offerId" = "Offer"."id")',
          ),
          'averagePrice',
        ],
        'offerType',
        'itemId',
        'id',
        'archived',
        'createdAt',
        'updatedAt',
        'userId',
      ],
      group: ['Offer.id'], // Группируем по ID оффераб
      order: [[sequelize.col('averagePrice'), 'ASC']],
    });

    return offers;
  }

  async acceptOfferPair(
    offerPairId: number,
    acceptOfferPairDto: AcceptOfferPairDto,
    user: User,
  ) {
    const currentOffer = await this.offerRepository.findOne({
      include: [
        {
          model: this.offerPairRepository,
          where: {
            id: offerPairId,
          },
        },
      ],
    });

    if (+currentOffer.userId === +user.id)
      throw new ForbiddenException('You cant accept your own offer');

    if (!currentOffer?.offerPairs)
      throw new NotFoundException(`No offer found`);

    const payload: CreateCheckoutDto = {
      sellerId:
        currentOffer.offerType === 'WTS' ? currentOffer.userId : user.id,
      purchaserId:
        currentOffer.offerType === 'WTB' ? currentOffer.userId : user.id,
      quantity: acceptOfferPairDto.quantity,
      price: +(
        acceptOfferPairDto.quantity * currentOffer.offerPairs[0].wantedPrice
      ).toFixed(),
    };

    const checkout = await this.checkoutService.createOfferPair(payload);
    currentOffer.offerPairs[0].checkoutId = checkout.id;
    await currentOffer.offerPairs[0].save();
    return await this.chatGateway.onOfferPairAccepted(checkout);
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

    const existingOffers = await this.offerRepository.findAll({
      where: {
        userId: user.id,
        itemId: createOfferDto.itemId,
        archived: false,
      },
      attributes: ['id'],
    });

    if (existingOffers.length >= MAX_OFFERS_PER_ITEM)
      throw new ForbiddenException(
        `You cant create more than ${MAX_OFFERS_PER_ITEM} offers to current item. Please delete unrelevant offers or edit them`,
      );

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

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  async update(id: number, updateOfferDto: UpdateOfferDto, user: User) {
    this.validateRarityGroup(updateOfferDto);

    const offer = await this.offerRepository.update(
      {
        ...updateOfferDto,
        userId: user.id,
      },
      {
        where: {
          id,
        },
      },
    );

    return offer;
  }

  async remove(id: number, user: User) {
    const req = {
      where: {
        id,
        archived: false,
      },
    };

    if (!user.isAdmin) req.where['userId'] = user.id;

    const currentOffer = await this.offerRepository.findOne(req);

    if (!currentOffer) {
      throw new NotFoundException(
        'Offer not found or you dont have permissions to delete',
      );
    }
    currentOffer.archived = true;
    await currentOffer.save();
    return true;
  }
}
