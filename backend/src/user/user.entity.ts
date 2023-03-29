import { IsOptional } from 'class-validator';
import {
  Table,
  Column,
  Model,
  Unique,
  AllowNull,
  Default,
  HasMany,
  BelongsToMany,
  Validate,
} from 'sequelize-typescript';
import { CommunityUser } from 'src/community/community-user.entity';
import { Community } from 'src/community/community.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';

@Table
export class User extends Model {
  @Unique
  @Validate({
    is: /^[a-zA-Z0-9]+$/,
  })
  @Column
  nickname: string;

  @Column
  password: string;

  @Validate({
    is: /^[a-zA-Z0-9]+$/,
  })
  @Column
  name: string;

  @Column
  lastName: string;

  @Validate({
    is: /^[a-zA-Z0-9\s]+#[0-9]{4}$/,
  })
  @Column
  discord: string;

  @Unique
  @Column
  discordId: string;

  @Default(true)
  @Column
  discordNotification: boolean;

  @Column
  bannedUntil: Date;

  @Column
  hash: string;

  @HasMany(() => ExistingItem)
  existingItems: ExistingItem[];

  @AllowNull(false)
  @Column
  active: boolean;

  @BelongsToMany(() => Community, () => CommunityUser)
  communities: Community[];
}
