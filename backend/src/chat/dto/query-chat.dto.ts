import { AuthorizedWsDto } from './authorized-ws.dto';

export class QueryChatDto extends AuthorizedWsDto {
  limit: number;
  offset: number;
}

export class ReadChatDto extends AuthorizedWsDto {
  chatId: number;
}

export class GetChatDto extends AuthorizedWsDto {
  chatId?: number;
  limit: number;
  offset: number;
}
