import {
  Table,
  Column,
  Model,
  Unique,
  AllowNull,
  Default,
} from 'sequelize-typescript';

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

  @AllowNull(false)
  @Default(false)
  @Column
  discordActive: boolean;

  @AllowNull(false)
  @Column
  active: boolean;
}
