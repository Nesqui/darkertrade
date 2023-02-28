import {
  Table,
  Column,
  Model,
  Unique,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Auction } from 'src/auction/auction.entity';
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

  @BelongsTo(() => Auction)
  auction: Auction;

  @ForeignKey(() => Auction)
  auctionId: Auction;

  @BelongsTo(() => ExistingItem)
  existingItem: ExistingItem;

  @ForeignKey(() => ExistingItem)
  existingItemId: ExistingItem;
}
