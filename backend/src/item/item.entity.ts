import { Table, Column, Model, AllowNull, Unique } from 'sequelize-typescript';
import { Slot } from './slot.entity';

@Table
export class Item extends Model {
  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @Column
  slot: Slot;
}
