import { Table, Column, Model, Unique, AllowNull } from 'sequelize-typescript';

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

  @AllowNull(false)
  @Column
  active: boolean;
}
