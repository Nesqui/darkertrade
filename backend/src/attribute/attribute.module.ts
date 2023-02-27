import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { attributesProviders } from './attribute.provider';
import { PgModule } from 'src/pg/pg.module';

@Module({
  imports: [PgModule],
  controllers: [AttributeController],
  providers: [AttributeService, ...attributesProviders],
})
export class AttributeModule {}
