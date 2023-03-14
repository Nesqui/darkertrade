import { AuthorizedWsDto } from './authorized-ws.dto';

export class QueryChatDto extends AuthorizedWsDto {
  limit: number;
  offset: number;
}

export class GetChatDto {
  chatId?: number;
  limit: number;
  offset: number;
}
