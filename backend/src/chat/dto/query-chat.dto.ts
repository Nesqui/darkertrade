import { AuthorizedWsDto } from './authorized-ws.dto';

export class QueryChatDto extends AuthorizedWsDto {
  limit: number;
  offset: number;
}
