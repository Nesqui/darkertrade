import { Table, Model, BelongsToMany } from 'sequelize-typescript';
import { User } from 'src/user/user.entity';
import { CommunityUser } from './community-user.entity';

@Table
export class Community extends Model {
  @BelongsToMany(() => User, () => CommunityUser)
  users: User[];
}
