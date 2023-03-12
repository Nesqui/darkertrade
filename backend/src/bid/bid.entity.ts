import {
  Table,
  Column,
  Model,
  Unique,
  AllowNull,
  ForeignKey,
  BelongsTo,
  DataType,
  Min,
  Max,
  Default,
} from 'sequelize-typescript';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { User } from 'src/user/user.entity';

@Table
export class Bid extends Model {
  @AllowNull(false)
  @Min(0)
  @Max(9999)
  @Column(DataType.DECIMAL)
  price: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => ExistingItem)
  @AllowNull(false)
  @Column
  existingItemId: number;

  @BelongsTo(() => ExistingItem, { foreignKey: 'existingItemId' })
  existingItem: ExistingItem;

  @ForeignKey(() => ExistingItem)
  @Column
  suggestedExistingItemId: number;

  @BelongsTo(() => ExistingItem, { foreignKey: 'suggestedExistingItemId' })
  suggestedExistingItem: ExistingItem;

  @Default('created')
  @Column
  status: 'created' | 'accepted' | 'declined' | 'deleted';
}
