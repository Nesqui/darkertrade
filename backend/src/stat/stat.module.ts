import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { statsProviders } from './stat.proviers';

@Module({
  controllers: [StatController],
  providers: [StatService, ...statsProviders]
})
export class StatModule {}
