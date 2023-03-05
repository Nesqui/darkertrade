import { MaxLength } from 'class-validator';
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
  IsDecimal,
  DataType,
  Min,
  Max,
} from 'sequelize-typescript';
import { Bid } from 'src/bid/bid.entity';
import { Item } from 'src/item/item.entity';
import { Stat } from 'src/stat/stat.entity';
import { User } from 'src/user/user.entity';

@Table
export class ExistingItem extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Stat)
  stats: Stat[];

  @ForeignKey(() => Item)
  @AllowNull(false)
  @Column
  itemId: number;

  @BelongsTo(() => Item)
  item: Item;

  @HasMany(() => Bid)
  bids: Bid[];

  @Default(false)
  @Column
  published: boolean;

  @IsDecimal
  @Min(0)
  @Max(9999)
  @MaxLength(4)
  @Column(DataType.DECIMAL)
  get wantedPrice(): number {
    const value = this.getDataValue('wantedPrice');
    return value === null ? null : parseFloat(value);
  }
  set wantedPrice(value: number) {
    this.setDataValue('wantedPrice', value);
  }

  @Default('WTB')
  @AllowNull(false)
  @Column
  offerType: 'WTB' | 'WTS';

  @Default(false)
  @Column
  archived: boolean;
}
