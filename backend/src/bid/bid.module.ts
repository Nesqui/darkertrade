import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { bidProviders } from './bid.providers';
import { existingItemProviders } from 'src/existing-item/existing-item.providers';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Module({
  controllers: [BidController],
  providers: [
    BidService,
    ...bidProviders,
    ...existingItemProviders,
    JwtService,
  ],
})
export class BidModule {}
