import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { usersProviders } from './user.providers';
import { PgModule } from 'src/pg/pg.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PgModule],
  controllers: [UserController],
  providers: [UserService, ...usersProviders, JwtService],
  exports: [UserService],
})
export class UserModule {}
