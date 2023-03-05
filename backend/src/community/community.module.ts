import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityGateway } from './community.gateway';

@Module({
  providers: [CommunityGateway, CommunityService]
})
export class CommunityModule {}
