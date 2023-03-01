import {
  Table,
  Column,
  Model,
  Unique,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { User } from 'src/user/user.entity';

@Table
export class Bid extends Model {
  @AllowNull(false)
  @Column
  price: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: User;

  @BelongsTo(() => ExistingItem)
  existingItem: ExistingItem;

  @ForeignKey(() => ExistingItem)
  existingItemId: ExistingItem;
}
