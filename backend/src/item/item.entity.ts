import { Table, Column, Model, AllowNull, Unique, HasMany } from 'sequelize-typescript';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Slot } from './slot.entity';

@Table
export class Item extends Model {
  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @Column
  slot: Slot;

  @HasMany(() => ExistingItem)
  existingItems: ExistingItem[];
}
