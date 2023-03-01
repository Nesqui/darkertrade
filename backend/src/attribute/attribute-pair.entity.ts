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
} from 'sequelize-typescript';
import { Stat } from 'src/stat/stat.entity';
import { Attribute } from './attribute.entity';

@Table
export class AttributePair extends Model {

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @ForeignKey(() => Attribute)
  @Column
  destAttributeId: number

  @ForeignKey(() => Attribute)
  @Column
  attributeId: number

  @Column
  description: string

}
