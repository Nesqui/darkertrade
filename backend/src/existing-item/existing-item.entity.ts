import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  BelongsTo,
  HasMany,
  BelongsToMany,
  ForeignKey,
  Default,
  IsNumeric,
} from 'sequelize-typescript';
import { Item } from 'src/item/item.entity';
import { Stat } from 'src/stat/stat.entity';
import { User } from 'src/user/user.entity';

@Table
export class ExistingItem extends Model {
  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: number;

  @HasMany(() => Stat)
  stats: Stat[];

  @BelongsTo(() => Item)
  item: Item;

  @ForeignKey(() => Item)
  itemId: number;

  @Default(false)
  @Column
  published: boolean;

  @IsNumeric
  @Column
  wantedPrice: number;

  @Default('WTB')
  @AllowNull(false)
  @Column
  offerType: 'WTB' | 'WTS';
}
