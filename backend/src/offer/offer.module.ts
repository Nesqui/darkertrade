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

@Module({
  controllers: [OfferController],
  providers: [
    OfferService,
    UserService,
    ...offerProviders,
    ...offerPairProviders,
    ...usersProviders,
    ...itemsProviders,
    JwtService,
  ],
})
export class OfferModule {}
