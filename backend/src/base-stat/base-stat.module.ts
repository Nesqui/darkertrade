import { Module } from '@nestjs/common';
import { BaseStatService } from './base-stat.service';
import { BaseStatController } from './base-stat.controller';

@Module({
  controllers: [BaseStatController],
  providers: [BaseStatService]
})
export class BaseStatModule {}
