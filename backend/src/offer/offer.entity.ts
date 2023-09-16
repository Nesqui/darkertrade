import { MaxLength } from 'class-validator';
import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Item } from 'src/item/item.entity';
import { User } from 'src/user/user.entity';
import { OfferPair } from './offer-pair.entity';

@Table
export class Offer extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Item)
  @AllowNull(false)
  @Column
  itemId: number;

  @BelongsTo(() => Item)
  item: Item;

  @Default('WTB')
  @AllowNull(false)
  @Column
  offerType: 'WTB' | 'WTS';

  @Default(false)
  @Column
  archived: boolean;

  @HasMany(() => OfferPair)
  offerPairs: OfferPair[];
}
