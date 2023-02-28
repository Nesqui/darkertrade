import { Table, Column, Model, Unique, AllowNull, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Bid } from 'src/bid/bid.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';

export type AuctionType = 'WTS' | 'WTB';

@Table
export class Auction extends Model {
  @AllowNull(false)
  @Column
  declaredPrice: number;

  @AllowNull(false)
  @Column
  type: AuctionType;

  @AllowNull(false)
  @Column
  active: boolean;

  @AllowNull(false)
  @Column
  minStats: number;

  @BelongsTo(() => ExistingItem)
  existingItemId: ExistingItem;

  @ForeignKey(() => ExistingItem)
  existingItem: ExistingItem;

  @HasMany(() => Bid)
  bids: Bid;
}
