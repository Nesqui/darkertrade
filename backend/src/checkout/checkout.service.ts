import { Inject, Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Checkout } from './checkout.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @Inject('CHECKOUT_REPOSITORY')
    private checkoutRepository: typeof Checkout,
  ) {}

  async createOfferPair(createCheckoutDto: CreateCheckoutDto) {
    return await this.checkoutRepository.create({
      ...createCheckoutDto,
    });
  }

  findAll() {
    return `This action returns all checkout`;
  }
}
