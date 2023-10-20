import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { checkoutProviders } from './checkout.providers';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, ...checkoutProviders],
  exports: [CheckoutService],
})
export class CheckoutModule {}
