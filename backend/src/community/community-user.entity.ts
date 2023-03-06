import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from 'src/user/user.entity';
import { Community } from './community.entity';

@Table
export class CommunityUser extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @PrimaryKey
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => Community)
  community: Community;

  @ForeignKey(() => Community)
  @PrimaryKey
  @AllowNull(false)
  @Column
  communityId: number;
}
