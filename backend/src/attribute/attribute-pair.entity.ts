import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  Min,
  Max,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import { Stat } from 'src/stat/stat.entity';
import { Attribute } from './attribute.entity';

@Table
export class AttributePair extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @BelongsTo(() => Attribute, 'attributeId')
  attribute: Attribute;

  @ForeignKey(() => Attribute)
  @PrimaryKey
  @AllowNull(false)
  @Column
  attributeId: number;

  @BelongsTo(() => Attribute, 'destAttributeId')
  destAttribute: Attribute;

  @ForeignKey(() => Attribute)
  @PrimaryKey
  @AllowNull(false)
  @Column
  destAttributeId: number;

  @Column
  description: string;
}
