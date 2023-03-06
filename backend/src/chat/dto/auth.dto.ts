import { User } from "src/user/user.entity"

export class AuthDto {
  token: string
  user?: User
}
