import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommunityGateway {
  constructor(private readonly communityService: CommunityService) {}

  @SubscribeMessage('createCommunity')
  create(@MessageBody() createCommunityDto: CreateCommunityDto) {
    return this.communityService.create(createCommunityDto);
  }

  @SubscribeMessage('findAllCommunity')
  findAll() {
    return this.communityService.findAll();
  }

  @SubscribeMessage('findOneCommunity')
  findOne(@MessageBody() id: number) {
    return this.communityService.findOne(id);
  }

  @SubscribeMessage('updateCommunity')
  update(@MessageBody() updateCommunityDto: UpdateCommunityDto) {
    return this.communityService.update(updateCommunityDto.id, updateCommunityDto);
  }

  @SubscribeMessage('removeCommunity')
  remove(@MessageBody() id: number) {
    return this.communityService.remove(id);
  }
}
