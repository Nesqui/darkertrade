import { Module } from '@nestjs/common';
import { BaseStatService } from './base-stat.service';
import { BaseStatController } from './base-stat.controller';
import { baseStatProviders } from './base-stat.providers';
import { PgModule } from 'src/pg/pg.module';
import { pgProviders } from 'src/pg/pg.providers';

@Module({
  imports: [PgModule],
  controllers: [BaseStatController],
  providers: [BaseStatService, ...pgProviders, ...baseStatProviders],
})
export class BaseStatModule {}
