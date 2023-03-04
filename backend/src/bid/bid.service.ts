import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { User } from 'src/user/user.entity';
import { Bid } from './bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Injectable()
export class BidService {
  constructor(
    @Inject('BIDS_REPOSITORY')
    private bidRepository: typeof Bid,
    @Inject('USERS_REPOSITORY')
    private userRepository: typeof User,
    @Inject('EXISTING_ITEM_REPOSITORY')
    private existingItemRepository: typeof ExistingItem,
  ) {}

  async create(createBidDto: CreateBidDto, user: User) {
    const existingItem = await this.existingItemRepository.findOne({
      where: {
        id: createBidDto.existingItemId,
        archived: false,
      },
    });
    if (!existingItem) throw new NotAcceptableException('Item not found');

    const alreadyCreatedExistingItem =
      await this.existingItemRepository.findOne({
        where: {
          id: createBidDto.existingItemId,
          archived: false,
        },
        include: [
          {
            model: this.bidRepository,
            where: {
              userId: user.id,
            },
          },
        ],
      });

    if (alreadyCreatedExistingItem)
      throw new ForbiddenException('You cant create another bid for this item');

    if (existingItem.userId === user.id)
      throw new ForbiddenException('You cant create bid for Your own item');

    if (existingItem.offerType === 'WTB') {
      if (!createBidDto.suggestedExistingItemId)
        throw new NotAcceptableException('Suggested item not presented');

      const suggestItem = await this.existingItemRepository.findByPk(
        createBidDto.suggestedExistingItemId,
      );

      if (suggestItem.itemId !== existingItem.itemId)
        throw new NotAcceptableException('Suggested item has different type');
    }

    const createdBid = await this.bidRepository.create({
      ...createBidDto,
      userId: user.id,
    });

    const bid = await this.bidRepository.findByPk(createdBid.id, {
      include: [
        {
          model: this.userRepository,
          attributes: {
            exclude: ['password', 'discord'],
          },
        },
      ],
    });

    return bid;
  }

  findAll() {
    return `This action returns all bid`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bid`;
  }

  update(id: number, updateBidDto: UpdateBidDto) {
    return `This action updates a #${id} bid`;
  }

  async remove(id: number, user: User) {
    const userBid = await this.bidRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!userBid) throw new ForbiddenException('You cant delete this bid');

    const bid = await this.bidRepository.destroy({
      where: {
        id,
      },
    });

    return bid;
  }
}
