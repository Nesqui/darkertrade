import { Module } from '@nestjs/common';
import { ExistingItemService } from './existing-item.service';
import { ExistingItemController } from './existing-item.controller';
import { existingItemProviders } from './existing-item.providers';
import { JwtService } from '@nestjs/jwt';
import { usersProviders } from 'src/user/user.providers';
import { statsProviders } from 'src/stat/stat.proviers';
import { itemsProviders } from 'src/item/item.providers';
import { attributesPairsProviders } from 'src/attribute/attribute-pair.providers';
import { attributesProviders } from 'src/attribute/attribute.provider';
import { pgProviders } from 'src/pg/pg.providers';

@Module({
  controllers: [ExistingItemController],
  providers: [
    ExistingItemService,
    ...existingItemProviders,
    ...usersProviders,
    ...statsProviders,
    ...itemsProviders,
    ...attributesPairsProviders,
    ...attributesProviders,
    ...pgProviders,
    JwtService,
  ],
})
export class ExistingItemModule {}
