import { MaxLength } from 'class-validator';
import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
  Default,
  IsDecimal,
  DataType,
  Min,
  Max,
  HasMany,
} from 'sequelize-typescript';
import { Offer } from './offer.entity';
import { Checkout } from 'src/checkout/checkout.entity';

@Table
export class OfferPair extends Model {
  @Default(0)
  @Min(0)
  @Max(5)
  @IsDecimal
  @Column
  rarity: number;

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

  @IsDecimal
  @Min(0)
  @Max(9999)
  @Column(DataType.DECIMAL)
  get quantity(): number {
    const value = this.getDataValue('quantity');
    return value === null ? null : parseFloat(value);
  }
  set quantity(value: number) {
    this.setDataValue('quantity', value);
  }

  @ForeignKey(() => Offer)
  @AllowNull(false)
  @Column
  offerId: number;

  @BelongsTo(() => Offer)
  offer: Offer;

  @HasMany(() => Checkout)
  checkouts: Checkout[];
}
