import { IsNumber } from 'class-validator';
import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { Attribute } from 'src/attribute/attribute.entity';
import { Item } from 'src/item/item.entity';

@Table
export class BaseStat extends Model {
  @Column
  min: number;

  @Column
  max: number;

  @Default(false)
  @Column
  inputRequired: boolean;

  @ForeignKey(() => Item)
  @AllowNull(false)
  @Column
  itemId: number;

  @BelongsTo(() => Item)
  item: Item;

  @ForeignKey(() => Attribute)
  @AllowNull(false)
  @Column
  attributeId: number;

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @IsNumber()
  @Column
  statsLength: number;
}
