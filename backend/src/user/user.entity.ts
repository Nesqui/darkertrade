import {
  Table,
  Column,
  Model,
  Unique,
  AllowNull,
  Default,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { CommunityUser } from 'src/community/community-user.entity';
import { Community } from 'src/community/community.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';

@Table
export class User extends Model {
  @Unique
  @Column
  nickname: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column
  lastName: string;

  @Column
  discord: string;

  @Column
  discordId: string;

  @Column
  hash: string;

  @HasMany(() => ExistingItem)
  existingItems: ExistingItem[];

  @AllowNull(false)
  @Default(false)
  @Column
  discordActive: boolean;

  @AllowNull(false)
  @Column
  active: boolean;

  @BelongsToMany(() => Community, () => CommunityUser)
  communities: Community[];
}
