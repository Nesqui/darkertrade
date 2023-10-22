import { Inject, Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Checkout } from './checkout.entity';
import { OfferPair } from 'src/offer/offer-pair.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @Inject('CHECKOUT_REPOSITORY')
    private checkoutRepository: typeof Checkout,
    @Inject('OFFER_PAIRS_REPOSITORY')
    private offerPairRepository: typeof OfferPair,
  ) {}

  async createOfferPair(createCheckoutDto: CreateCheckoutDto) {
    return await this.checkoutRepository.create({
      ...createCheckoutDto,
    });
  }

  async getById(id: number) {
    return await this.checkoutRepository.findByPk(id, {
      include: [
        {
          model: this.offerPairRepository,
        },
      ],
    });
  }

  findAll() {
    return `This action returns all checkout`;
  }
}
