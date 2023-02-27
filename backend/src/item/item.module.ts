import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { itemsProviders } from './item.providers';
import { PgModule } from 'src/pg/pg.module';

@Module({
  imports: [PgModule],
  controllers: [ItemController],
  providers: [ItemService, ...itemsProviders],
})
export class ItemModule {}
