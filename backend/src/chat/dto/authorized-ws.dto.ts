import { User } from 'src/user/user.entity';

export class AuthorizedWsDto {
  user: User;
  token: string;
}
