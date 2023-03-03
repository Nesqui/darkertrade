import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { bidProviders } from './bid.providers';
import { existingItemProviders } from 'src/existing-item/existing-item.providers';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { usersProviders } from 'src/user/user.providers';

@Module({
  controllers: [BidController],
  providers: [
    BidService,
    ...bidProviders,
    ...existingItemProviders,
    ...usersProviders,
    JwtService,
  ],
})
export class BidModule {}
