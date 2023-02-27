import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { itemsProviders } from './item.providers';
import { PgModule } from 'src/pg/pg.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PgModule],
  controllers: [ItemController],
  providers: [ItemService, ...itemsProviders, JwtService],
})
export class ItemModule {}
