import { IsNumber } from 'class-validator';
import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  BelongsTo,
  ForeignKey,
  Min,
  Max,
  IsNumeric,
  IsDecimal,
  DataType,
  Default,
} from 'sequelize-typescript';
import { Attribute } from 'src/attribute/attribute.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';

@Table
export class Stat extends Model {
  @AllowNull(false)
  @IsDecimal
  @Min(-500)
  @Max(500)
  @Column(DataType.DECIMAL)
  value: number;

  @ForeignKey(() => Attribute)
  @AllowNull(false)
  @Column
  attributeId: number;

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @ForeignKey(() => ExistingItem)
  @AllowNull(false)
  @Column
  existingItemId: number;

  @BelongsTo(() => ExistingItem)
  existingItem: ExistingItem;

  @Default(false)
  @Column
  isBase: boolean;

  @Default(false)
  @Column
  isApproximately: boolean;
}
