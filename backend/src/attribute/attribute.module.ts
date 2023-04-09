import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { attributesProviders } from './attribute.provider';
import { PgModule } from 'src/pg/pg.module';
import { attributesPairsProviders } from './attribute-pair.providers';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { usersProviders } from 'src/user/user.providers';

@Module({
  imports: [PgModule],
  controllers: [AttributeController],
  providers: [
    AttributeService,
    ...attributesPairsProviders,
    ...attributesProviders,
    JwtService,
    UserService,
    ...usersProviders,
  ],
})
export class AttributeModule {}
