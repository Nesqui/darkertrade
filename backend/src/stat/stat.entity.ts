import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Attribute } from 'src/attribute/attribute.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';

export type StatSymbol = '>=' | '=';

@Table
export class Stat extends Model {
  @AllowNull(false)
  @Column
  value: string;

  @AllowNull(false)
  @Column
  symbol: StatSymbol;

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @ForeignKey(() => Attribute)
  attributeId: number;

  @BelongsTo(() => ExistingItem)
  existingItem: ExistingItem;

  @ForeignKey(() => ExistingItem)
  existingItemId: number;
}
