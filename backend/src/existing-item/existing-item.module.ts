import { Module } from '@nestjs/common';
import { ExistingItemService } from './existing-item.service';
import { ExistingItemController } from './existing-item.controller';
import { existingItemProviders } from './existing-item.providers';
import { JwtService } from '@nestjs/jwt';
import { usersProviders } from 'src/user/user.providers';
import { statsProviders } from 'src/stat/stat.proviers';
import { itemsProviders } from 'src/item/item.providers';

@Module({
  controllers: [ExistingItemController],
  providers: [
    ExistingItemService,
    ...existingItemProviders,
    ...usersProviders,
    ...statsProviders,
    ...itemsProviders,
    JwtService,
  ],
})
export class ExistingItemModule {}
