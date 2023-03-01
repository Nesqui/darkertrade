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
} from 'sequelize-typescript';
import { Stat } from 'src/stat/stat.entity';
import { AttributePair } from './attribute-pair.entity';

@Table
export class Attribute extends Model {
  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @Min(-500)
  @Column
  min: number;

  @Max(500)
  @Column
  max: number;

  @BelongsToMany(() => Attribute, () => AttributePair, "destAttributeId")
  attributePairs: AttributePair[]
}
