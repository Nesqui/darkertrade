import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { itemsProviders } from './item.providers';
import { PgModule } from 'src/pg/pg.module';
import { JwtService } from '@nestjs/jwt';
import { existingItemProviders } from 'src/existing-item/existing-item.providers';
import { statsProviders } from 'src/stat/stat.proviers';
import { usersProviders } from 'src/user/user.providers';

@Module({
  imports: [PgModule],
  controllers: [ItemController],
  providers: [
    ItemService,
    ...itemsProviders,
    ...existingItemProviders,
    ...statsProviders,
    ...usersProviders,
    JwtService,
  ],
})
export class ItemModule {}
