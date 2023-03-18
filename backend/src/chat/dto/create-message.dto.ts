import { AuthorizedWsDto } from './authorized-ws.dto';

export class sendMessageDto extends AuthorizedWsDto {
  text: string;
  chatId: number;
}
