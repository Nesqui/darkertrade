import { Module } from '@nestjs/common';
import { BaseStatService } from './base-stat.service';
import { BaseStatController } from './base-stat.controller';
import { baseStatProviders } from './base-stat.providers';
import { PgModule } from 'src/pg/pg.module';
import { pgProviders } from 'src/pg/pg.providers';
import { JwtService } from '@nestjs/jwt';
import { usersProviders } from 'src/user/user.providers';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [PgModule],
  controllers: [BaseStatController],
  providers: [
    BaseStatService,
    ...pgProviders,
    ...baseStatProviders,
    JwtService,
    UserService,
    ...usersProviders,
  ],
})
export class BaseStatModule {}
