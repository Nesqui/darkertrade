import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  Min,
  Max,
  BelongsTo,
  BelongsToMany,
  HasMany,
  DataType,
} from 'sequelize-typescript';
import { Stat } from 'src/stat/stat.entity';
import { AttributePair } from './attribute-pair.entity';
import { IsString } from 'class-validator';

@Table
export class Attribute extends Model {
  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @Min(-500)
  @Max(9998)
  @Column(DataType.DECIMAL)
  min: number;

  @Min(-499)
  @Max(9999)
  @Column(DataType.DECIMAL)
  max: number;

  @IsString()
  @Column
  symbol: string;

  @HasMany(() => Stat)
  stats: Stat[];

  @BelongsToMany(() => Attribute, () => AttributePair, 'destAttributeId')
  attributePairs: AttributePair[];

  @HasMany(() => AttributePair)
  attributeSimilars: AttributePair[];
}
