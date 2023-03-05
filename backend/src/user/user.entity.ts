import {
  Table,
  Column,
  Model,
  Unique,
  AllowNull,
  Default,
  HasMany,
} from 'sequelize-typescript';
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
}
