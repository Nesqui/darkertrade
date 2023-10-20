import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
  Default,
  HasOne,
} from 'sequelize-typescript';
import { Bid } from 'src/bid/bid.entity';
import { Chat } from 'src/chat/chat.entity';
import { OfferPair } from 'src/offer/offer-pair.entity';
import { User } from 'src/user/user.entity';

@Table
export class Checkout extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  purchaserId: number;

  @BelongsTo(() => User, 'purchaserId')
  purchaser: User;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  sellerId: number;

  @BelongsTo(() => User, 'sellerId')
  seller: User;

  @ForeignKey(() => Chat)
  @Column
  chatId: number;

  @BelongsTo(() => Chat)
  chat: Chat;

  @HasOne(() => OfferPair)
  offerPair: OfferPair;

  @HasOne(() => Bid)
  bid: Bid;

  @Default(1)
  @Column
  quantity: number;

  @Default(100)
  @Column
  price: number;

  @Default('gold')
  @Column
  currency: 'gold' | 'key' | 'gold ingot' | 'ruby silver ingot';
}
