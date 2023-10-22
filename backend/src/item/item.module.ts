import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { itemsProviders } from './item.providers';
import { PgModule } from 'src/pg/pg.module';
import { JwtService } from '@nestjs/jwt';
import { existingItemProviders } from 'src/existing-item/existing-item.providers';
import { statsProviders } from 'src/stat/stat.providers';
import { usersProviders } from 'src/user/user.providers';
import { bidProviders } from 'src/bid/bid.providers';
import { pgProviders } from 'src/pg/pg.providers';
// import { baseStatProviders } from 'src/base-stat/base-stat.providers';
import { UserService } from 'src/user/user.service';
import { offerPairProviders } from 'src/offer/offer-pair.providers';
import { offerProviders } from 'src/offer/offer.providers';
import { checkoutProviders } from 'src/checkout/checkout.providers';

@Module({
  imports: [PgModule],
  controllers: [ItemController],
  providers: [
    ItemService,
    ...itemsProviders,
    UserService,
    ...existingItemProviders,
    ...statsProviders,
    ...usersProviders,
    ...bidProviders,
    ...offerPairProviders,
    ...offerProviders,
    ...checkoutProviders,
    ...pgProviders,
    // ...baseStatProviders,
    JwtService,
  ],
  exports: [ItemService],
})
export class ItemModule {}
