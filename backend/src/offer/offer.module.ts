import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { offerProviders } from './offer.providers';
import { usersProviders } from 'src/user/user.providers';
import { itemsProviders } from 'src/item/item.providers';
import { OfferPair } from './offer-pair.entity';
import { offerPairProviders } from './offer-pair.providers';
import { CheckoutService } from 'src/checkout/checkout.service';
import { checkoutProviders } from 'src/checkout/checkout.providers';
import { ChatModule } from 'src/chat/chat.module';
import { DiscordBotModule } from 'src/discord/discord.module';

@Module({
  controllers: [OfferController],
  imports: [DiscordBotModule, ChatModule],
  providers: [
    OfferService,
    UserService,
    CheckoutService,
    ...offerProviders,
    ...offerPairProviders,
    ...checkoutProviders,
    ...usersProviders,
    ...itemsProviders,
    JwtService,
  ],
})
export class OfferModule {}
