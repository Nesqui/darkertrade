import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { checkoutProviders } from './checkout.providers';
import { offerPairProviders } from 'src/offer/offer-pair.providers';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, ...offerPairProviders, ...checkoutProviders],
  exports: [CheckoutService],
})
export class CheckoutModule {}
